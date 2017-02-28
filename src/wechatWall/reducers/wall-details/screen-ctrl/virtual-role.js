import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_VIRTUAL_ROLE_LIST,
    ADD_VIRTUAL_ROLE_LIST,
    UPDATE_VIRTUAL_ROLE_LIST, 
    DELETE_VIRTUAL_ROLE_LIST,
    FETCH_VIRTUAL_MESSAGE_LIST
	 } from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	option:[],
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true,
})

const actionHandlers = {
	[FETCH_VIRTUAL_ROLE_LIST]: (state, { response }) => {
		return state.update('option', x => Immutable.fromJS(response.result.list))
			.update('pending', x => false)
	},

	[FETCH_VIRTUAL_MESSAGE_LIST]: (state, { response, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	[ADD_VIRTUAL_ROLE_LIST]: (state, { response }) => {
		return state		
	},

	[UPDATE_VIRTUAL_ROLE_LIST]: (state, { response }) => {
		return state		
	},

	[DELETE_VIRTUAL_ROLE_LIST]: (state, { response }) => {
		return state		
	},

	['wallDetailVirtual']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)