import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_INTEGRAL_USER_LIST,
	FETCH_SINGER_USER_RECORD
	 } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	singer_record: [],
	option: {
		userType: []
	},
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_INTEGRAL_USER_LIST]: (state, { response, params, option }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('option', x => Immutable.fromJS(option.result))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},
	
	[FETCH_SINGER_USER_RECORD]: (state, { response }) => {
		return state.update('singer_record', x => Immutable.fromJS(response.result.list))
	},

	['integralUser']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)