import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_ACTIVITY_ROUTE_LIST,
	ADD_ACTIVITY_ROUTE_LIST,
	UPDATE_ACTIVITY_ROUTE_LIST,
	DELETE_ACTIVITY_ROUTE_LIST,
	FETCH_ROUTE_EDIT_SELECT,
	CHECK_ACTIVITY_ROUTE_LIST
	 } from 'activity/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	info: {},
	id: '',
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	option: {
		activityList:[],
		templateList:[]
	},
	pending: true
})

const actionHandlers = {
	[FETCH_ACTIVITY_ROUTE_LIST]: (state, { response, params, select }) => {
		
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	[ADD_ACTIVITY_ROUTE_LIST]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	[UPDATE_ACTIVITY_ROUTE_LIST]: (state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	[FETCH_ROUTE_EDIT_SELECT]: (state, { option }) => {
		return state.update('option', x => Immutable.fromJS(option.result))
	},

	[DELETE_ACTIVITY_ROUTE_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[CHECK_ACTIVITY_ROUTE_LIST]: (state, {response}) => {
		return state.update('info', x => Immutable.fromJS(response.result))
	},


	['activityRoute']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)