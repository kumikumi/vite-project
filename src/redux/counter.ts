import { Reducer } from '@reduxjs/toolkit'

import { ReduxAction } from './ReduxAction'

export const counter: Reducer<number, ReduxAction> = (value = 0, action) => {
	switch (action.type) {
		case 'counter/increment':
			return value + 1
		case 'counter/decrement':
			return value - 1
		case 'counter/incrementBy':
			return value + action.payload
		case 'counter/decrementBy':
			return value - action.payload
	}
	return value
}
