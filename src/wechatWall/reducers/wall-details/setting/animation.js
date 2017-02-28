import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WALL_SETTING_TEMPLATE,
	ADD_WALL_SETTING_TEMPLATE,
	UPDATE_WALL_SETTING_TEMPLATE,
	DELETE_WALL_SETTING_TEMPLATE,
	GET_WALL_SETTING_EDIT_TEMPLATE,
	CHECK_WALL_SETTING_TEMPLATE
	 } from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	id: '',
	info:{},
	option:{
		templateLayout:[],
		templateStyleType:[],
		msgFram:[],
		headFram:[],
		numList:[],
		flipType:[],
		alignList:[]
	},
	select: {
		templateLayout: [],
		templateStyleType: []
	},
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_WALL_SETTING_TEMPLATE]: (state, { response, select, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	[ADD_WALL_SETTING_TEMPLATE]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	[DELETE_WALL_SETTING_TEMPLATE]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[UPDATE_WALL_SETTING_TEMPLATE]: (state, { response }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
			return x
		})
	},

	[CHECK_WALL_SETTING_TEMPLATE]: (state, { response }) => {
		return state.update('info', x => Immutable.fromJS(response.result))
	},

	[GET_WALL_SETTING_EDIT_TEMPLATE]: (state, { option }) => {
		return state.update('option', x => Immutable.fromJS(option.result))
			 .update('pending', x => false)
	},

	['wallSettingTemplate']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)