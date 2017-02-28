import createReducer from 'Application/utils/create-reducer'
import { FETCH_SYSTEM_ADMIN_LIST, FETCH_ADMIN_GROUP_LIST, DELETE_SYSTEM_ADMIN_ITEM, ADD_SYSTEM_ADMIN_ITEM, UPDATE_SYSTEM_ADMIN_ITEM } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	pending: true,
	content: [],
	id: '',
	select: {
		adminGroupList: [],
		authPackageList: [],
		companyList:[]
	},
	option: {
		adminGroupList: [],
		authPackageList: [],
		companyList:[]
	},
	params:{
		page: 0,
		psize: 0,
		count: 0
	},
	groupList: [],
	auth: {}
})

const actionHandlers = {
	[FETCH_SYSTEM_ADMIN_LIST]: (state, { response, select, option, params }) => {
        console.log(select.result)
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result))
			.update('option', x => Immutable.fromJS(option.result))
			.update('params', x => Immutable.fromJS(params))
			.set('pending', false)
	},

	[FETCH_ADMIN_GROUP_LIST]: (state, { response, id }) => {
		return state.update('groupList', x => Immutable.fromJS(response.result))
			.update('id', x => id)
	},

	[DELETE_SYSTEM_ADMIN_ITEM]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[ADD_SYSTEM_ADMIN_ITEM]: (state, { response }) => {
		var content = state.get('content').toJS()
		var params = state.get('params').toJS()
		const info = response.result
		params.count = params.count + 1
		content.unshift(info)
		return state.update('content', x => Immutable.fromJS(content))
					.update('params', x => Immutable.fromJS(params))
	},

	[UPDATE_SYSTEM_ADMIN_ITEM]: (state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	['systemAdmin']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)