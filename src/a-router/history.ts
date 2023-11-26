// Todo: change "url" to transition info object, normalize url format, add transition type (push / pop / go)
export type Blocker = (url: string, confirm: () => void) => void

class RouterHistory {
	public windowHistory: History
	private blockers: Array<Blocker>
	private useOnbeforeunload: boolean
	private idx: number
	private ignorePop = false
	private popCallback: null | (() => void) = null

	constructor() {
		this.windowHistory = window.history
		this.blockers = []
		this.useOnbeforeunload = false
		this.idx = 0
		this.windowHistory.replaceState({ ...this.windowHistory.state, idx: 0 }, '')
		window.onpopstate = this.handlePop.bind(this)
	}

	private confirmNavigation(url: string, callback: () => void) {
		const firstBlocker = this.blockers[0]
		if (!firstBlocker) {
			callback()
			return
		}
		let i = 0
		const confirm = () => {
			i++
			const blocker = this.blockers[i]
			if (!blocker) {
				callback()
			} else {
				blocker(url, confirm)
			}
		}
		firstBlocker(url, confirm)
	}

	public push(url: string) {
		console.log('push ', url)
		this.confirmNavigation(url, () => {
			this.windowHistory.pushState({ idx: ++this.idx }, '', url)
		})
	}

	public replace(url: string) {
		console.log('replace ', url)
		this.confirmNavigation(url, () => {
			this.windowHistory.replaceState({ idx: this.idx }, '', url)
		})
	}

	public get length() {
		return this.windowHistory.length
	}

	public block(blocker: Blocker) {
		const blockerIdx = this.blockers.push(blocker)

		if (this.blockers.length === 1) {
			this.useOnbeforeunload = window.onbeforeunload === null
			if (this.useOnbeforeunload) {
				window.onbeforeunload = promptBeforeUnload
			} else {
				window.addEventListener('onbeforeunload', promptBeforeUnload)
			}
		}

		return () => {
			this.blockers.copyWithin(blockerIdx, blockerIdx + 1)
			this.blockers.pop()
			if (this.blockers.length === 0) {
				if (this.useOnbeforeunload) {
					window.onbeforeunload = null
				} else {
					window.removeEventListener('onbeforeunload', promptBeforeUnload)
				}
			}
		}
	}

	private handlePop() {
		if (this.ignorePop) {
			this.ignorePop = false
			if (this.popCallback) {
				this.popCallback()
				this.popCallback = null
			}
			return
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const idx: number | undefined = this.windowHistory.state.idx
		if (idx === undefined) {
			console.warn('No idx in history state')
			return
		}
		const delta = this.idx - idx
		if (this.blockers.length === 0) {
			this.idx = idx
			return
		}
		const url = window.location.pathname + window.location.search
		// If there are blockers: revert pop first, get confirmation, then re-do pop if approved
		this.ignorePop = true
		this.popCallback = () => {
			this.confirmNavigation(url, () => {
				console.log('Confirmed')
				this.ignorePop = true
				this.windowHistory.go(-delta)
				this.idx = idx
			})
		}
		this.windowHistory.go(delta)
	}
}

export const history = new RouterHistory()

function promptBeforeUnload(event: BeforeUnloadEvent) {
	//event.preventDefault()
	event.returnValue = ''
}
