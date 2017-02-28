import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_CARD_SETTING_LIST,
	ADD_CARD_SETTING_LIST,
	UPDATE_CARD_SETTING_LIST,
	DELETE_CARD_SETTING_LIST,
	FETCH_CARD_SETTING_EDIT_SELECT,
	FETCH_CARD_SETTING_DETAIL,
	FETCH_ADMIN_GROUP_LIST
	 } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	info:{},
	id: '',
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	option:{
		index:[],
		list:[],
		greeting:[]
	},
	pending: true
})

const actionHandlers = {
	[FETCH_CARD_SETTING_LIST]: (state, { response, params, option }) => {
		
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('option', x => Immutable.fromJS(option.result.templateList))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	[FETCH_CARD_SETTING_EDIT_SELECT]: (state, { option }) => {
		return state.update('option', x => Immutable.fromJS(option.result.templateList))
	},

	[ADD_CARD_SETTING_LIST]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	[DELETE_CARD_SETTING_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[UPDATE_CARD_SETTING_LIST]: (state, { response }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	[FETCH_CARD_SETTING_DETAIL]: (state, { response, id }) => {
		return state.update('info', x => Immutable.fromJS(response.result))
					.update('id', x => id)
	},

	['cardSetting']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)