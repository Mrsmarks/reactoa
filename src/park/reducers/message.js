import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_PARK_MESSAGE_LIST
	 } from 'park/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	option: {
		sendStatus: [],
		userStatus: []
	},
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_PARK_MESSAGE_LIST]: (state, { response, params, option }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('option', x => Immutable.fromJS(option.result))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	['parkMessage']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)