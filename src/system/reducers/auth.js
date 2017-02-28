import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_SYSTEM_AUTH_LIST, 
	FETCH_SYSTEM_AUTH_EDIT_DATA, 
	DELETE_SYSTEM_AUTH_PACKAGE,
	ADD_SYSTEM_AUTH_PACKAGE,
	UPDATE_SYSTEM_AUTH_PACKAGE
} from '../constants'
import Immutable from 'immutable'

import format from 'Application/utils/formatDate'

const initialState = Immutable.fromJS({
	content: [],
	count: 0,
	params: {
		page: 0,
		psize: 0,
		count: 0
	},

	// 以下是编辑权限包相关的数据
	authPackageList: [],
	menuList: [],
	authDetails: {},
	editId: null
})

const actionHandlers = {
	[FETCH_SYSTEM_AUTH_LIST]: (state, { response: { result: { list, count } }, params }) => {		
		list.forEach(item => {
			item.last_update_time = format(item.last_update_time * 1000)
		})

		return state.set('content', Immutable.fromJS(list))
					.set('count', count)
					.set('pending', false)
					.set('params', Immutable.fromJS(params))
	},

	[FETCH_SYSTEM_AUTH_EDIT_DATA]: (state, { authPackageList = [], menuList = [], authDetails, editId }) => {
		return state.set('authPackageList', Immutable.fromJS(authPackageList))
					.set('menuList', Immutable.fromJS(menuList))
					.set('authDetails', Immutable.fromJS(authDetails))
					.set('editId', editId)
	},

	[DELETE_SYSTEM_AUTH_PACKAGE]: (state, { id }) => {
		state = state.update('content', x => x.filter(item => item.get('id') != id))
		return state.setIn(['params', 'count'], state.get('content').size )
	},

	[ADD_SYSTEM_AUTH_PACKAGE]: (state, { response }) => {
		response.last_update_time = format(response.last_update_time * 1000)
		return state.update('content', content => content.unshift(Immutable.fromJS(response)))
					.setIn(['params', 'count'], state.get('content').size)
	},

	[UPDATE_SYSTEM_AUTH_PACKAGE]: (state, { response, id }) => {
		return state.update('content', content => {
			const index = content.findIndex(item => item.get('id') == id)
			return content.update(index, x => Immutable.fromJS({
				...x.toJS(),
				...response
			}))
		})
	},

	['systemAuth']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)