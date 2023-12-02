import { Reducer } from '@reduxjs/toolkit'

import { ReduxAction } from './ReduxAction'
import { normalizeUrl } from '../a-router/history'

export const routerLocation: Reducer<string, ReduxAction> = (
	state = normalizeUrl(window.location.href),
	action
) => {
	switch (action.type) {
		case 'router/push':
		case 'router/pop':
		case 'router/replace':
			return action.payload
		default:
			return state
	}
}
