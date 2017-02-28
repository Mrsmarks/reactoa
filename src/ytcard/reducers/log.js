import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_YTCARD_LOG_LIST,
	 } from 'ytcard/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	option: {
		typeList:[]
	},
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_YTCARD_LOG_LIST]: (state, { response, option, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('option', x => Immutable.fromJS(option.result))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	['ytCardLog']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)