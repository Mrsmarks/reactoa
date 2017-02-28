export default function createReducer (initialState, actionHandlers) {
	initialState = initialState.set('pending', true)
							   .set('error', {})
	return (state = initialState, action) => {
		const reduceFn = actionHandlers[action.type]
		if (!reduceFn) {
			return state
		}
		//return { ...state, ...reduceFn(state, action) }
		return reduceFn(state, action)
	}
}
