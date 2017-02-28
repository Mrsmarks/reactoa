import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_TEACHER_USER_LIST
	 } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	option: {
		workType: []
	},
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_TEACHER_USER_LIST]: (state, { response, params, option }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('option', x => Immutable.fromJS(option.result))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	['teacherUser']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)