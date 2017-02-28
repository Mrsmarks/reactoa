import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_ACTIVITY_BLACK_LIST,
	FETCH_BLACK_EDIT_SELECT,
	ADD_ACTIVITY_BLACK_LIST,
	DELETE_ACTIVITY_BLACK_LIST,
	UPDATE_ACTIVITY_BLACK_LIST
	 } from 'activity/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	id: '',
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	select:{
		activityList: [],
		type:[]
	},
	pending: true
})

const actionHandlers = {
	[FETCH_ACTIVITY_BLACK_LIST]: (state, { response, params, select }) => {
		
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	[ADD_ACTIVITY_BLACK_LIST]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	[DELETE_ACTIVITY_BLACK_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[UPDATE_ACTIVITY_BLACK_LIST]: (state, { response }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	['activityBlack']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)