type Update = {
	action: 'push' | 'pop' | 'replace'
	url: string
}

export type Blocker = (update: Update, confirm: () => void) => void

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

	private confirmNavigation(update: Update, callback: () => void) {
		console.log('Confirm ', update)
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
				blocker(update, confirm)
			}
		}
		firstBlocker(update, confirm)
	}

	public push(url: string) {
		console.log('push ', url)
		const normalizedUrl = normalizeUrl(url)
		this.confirmNavigation(
			{
				action: 'push',
				url: normalizedUrl,
			},
			() => {
				this.windowHistory.pushState({ idx: ++this.idx }, '', normalizedUrl)
			}
		)
	}

	public replace(url: string) {
		console.log('replace ', url)
		const normalizedUrl = normalizeUrl(url)
		this.confirmNavigation(
			{
				action: 'replace',
				url: normalizedUrl,
			},
			() => {
				this.windowHistory.replaceState({ idx: this.idx }, '', normalizedUrl)
			}
		)
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
		const url = normalizeUrl(window.location.href)
		const update: Update = {
			action: 'pop',
			url,
		}
		// If there are blockers: revert pop first, get confirmation, then re-do pop if approved
		this.ignorePop = true
		this.popCallback = () => {
			this.confirmNavigation(update, () => {
				this.ignorePop = true
				this.windowHistory.go(-delta)
				this.idx = idx
			})
		}
		this.windowHistory.go(delta)
	}
}

const normalizeUrl = (url: string) => {
	// Todo: this probably needs more rigorous testing
	if (url.includes(':')) {
		const origin = location.origin
		if (!url.startsWith(origin)) {
			throw new Error("Can't use external url with history API")
		}
		return url.substring(origin.length)
	}
	return `${url.startsWith('/') ? '' : '/'}${url}`
}

export const history = new RouterHistory()

function promptBeforeUnload(event: BeforeUnloadEvent) {
	event.preventDefault()
	event.returnValue = ''
}
