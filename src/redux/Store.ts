import { Reducer, ThunkMiddleware, configureStore } from '@reduxjs/toolkit'
import { useSelector as useReactReduxSelector } from 'react-redux'

import { counter } from './counter'
import { ReduxAction } from './ReduxAction'

const rootReducers = {
	counter,
} as const
type RootReducersRecord = typeof rootReducers
type ValueFromReducer<T> = T extends Reducer<infer S> ? S : never

type RootState = {
	[K in keyof RootReducersRecord]: ValueFromReducer<RootReducersRecord[K]>
}

export const Store = configureStore<
	RootState,
	ReduxAction,
	[ThunkMiddleware<RootState, ReduxAction>]
>({
	reducer: rootReducers,
})

export type AppDispatch = typeof Store.dispatch

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typecheck = () => {
	//@ts-expect-error If this line goes red, type checking of Store.dispatch has failed.
	//Make sure that every reducer has its action properly typed.
	Store.dispatch({ type: 'nonexistent' })
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const useSelector: <SelectedValue>(
	fn: (state: RootState) => SelectedValue
) => SelectedValue = useReactReduxSelector as any
