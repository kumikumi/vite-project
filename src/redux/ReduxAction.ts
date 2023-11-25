type ReduxVoidActions = 'counter/increment' | 'counter/decrement'
type ReduxActionsWithPayload = {
	'counter/incrementBy': number
	'counter/decrementBy': number
}

type ReduxVoidActionsRecord = { [K in ReduxVoidActions]: { type: K } }
export type ReduxVoidAction =
	ReduxVoidActionsRecord[keyof ReduxVoidActionsRecord]

type ReduxActionsWithPayloadRecord = {
	[K in keyof ReduxActionsWithPayload]: {
		type: K
		payload: ReduxActionsWithPayload[K]
	}
}
export type ReduxActionWithPayload =
	ReduxActionsWithPayloadRecord[keyof ReduxActionsWithPayloadRecord]

type AllReduxActionsRecord = ReduxVoidActionsRecord &
	ReduxActionsWithPayloadRecord
export type ReduxAction = AllReduxActionsRecord[keyof AllReduxActionsRecord]
