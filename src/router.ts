import { RouterHistory, Update } from './a-router/history'
import { Store } from './redux/Store'

export const history = new RouterHistory()

history.listen((update) => {
	const type: `router/${Update['action']}` = `router/${update.action}`
	const reduxAction = { type, payload: update.url }
	Store.dispatch(reduxAction)
})
