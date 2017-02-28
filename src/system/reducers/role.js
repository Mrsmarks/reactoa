import createReducer from 'Application/utils/create-reducer'
import { FETCH_SYSTEM_ROLE_LIST, FETCH_SYSTEM_ROLE_MODAL_DATA, DELETE_SYSTEM_ROLE, ADD_SYSTEM_ROLE } from '../constants'
import Immutable, { fromJS } from 'immutable'
import format from 'Application/utils/formatDate'

const initialState = Immutable.fromJS({
	content: [],
	count: 0,
	params: {
		page: 0,
		psize: 0,
		count: 0,
		name: ''
	},
	
	// 以下为弹窗使用的数据
	authPackageList: []
})

const actionHandlers = {
	[FETCH_SYSTEM_ROLE_LIST]: (state, { response: { list }, params }) => {	
		list.forEach(item => {
			item.last_update_time = format(item.last_update_time * 1000)
		})	
		return state.set('content', fromJS(list))
					.set('params', fromJS(params))
					.set('pending', false)
	},

	[FETCH_SYSTEM_ROLE_MODAL_DATA]: (state, { response: { authPackageList } }) => {
		return state.set('authPackageList', fromJS(authPackageList))
	},

	[DELETE_SYSTEM_ROLE]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[ADD_SYSTEM_ROLE]: (state, { response }) => {
		response.last_update_time = format(response.last_update_time * 1000)
		return state.update('content', content => content.unshift(Immutable.fromJS(response)))
					.setIn(['params', 'count'], state.get('content').size)
	},

	['systemRole']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)