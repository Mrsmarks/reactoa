import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_ACTIVITY_SETTING_LIST,
	FETCH_ACTIVITY_SETTING_DETAIL, 
	ADD_ACTIVITY_SETTING_LIST,
	UPDATE_ACTIVITY_SETTING_LIST, 
	DELETE_ACTIVITY_SETTING_LIST, 
	GET_ACTIVITY_SETTING_SELETE
	 } from 'activity/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	info: {},
	id: '',
	select: [],
	error:{},
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_ACTIVITY_SETTING_LIST]: (state, { response, params, select, aid }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('select', x => Immutable.fromJS(select.result.prizeList))
			.update('id', x => aid)
			.update('pending', x => false)
			.set('error', {})
	},

	[ADD_ACTIVITY_SETTING_LIST]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	[DELETE_ACTIVITY_SETTING_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[UPDATE_ACTIVITY_SETTING_LIST]: (state, { response }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
		.update('info', x => Immutable.fromJS(response.result))
	},

	[FETCH_ACTIVITY_SETTING_DETAIL]: (state, { response }) => {
		return state.update('info', x => Immutable.fromJS(response.result))
	},

	['activitySetting']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)