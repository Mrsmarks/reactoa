import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_SYSTEM_DEPARTMENT_LIST,
	FETCH_SYSTEM_DEPARTMENT_BYID,
	FETCH_SYSTEM_DEPARTMENT_SELECTOR,
	DELETE_SYSTEM_DEPARTMENT,
	SAVE_SYSTEM_DEPARTMENT,
	UPDATE_SYSTEM_DEPARTMENT,
	FETCH_DEPARTMENT_GROUP_LIST
} from '../constants'
import Immutable, { fromJS } from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	params: {
		page: 0,
		psize: 0,
		count: 0,
		name: ''
	},
	dpid: '',
	// 以下为编辑相关的数据
	deptData: {

	},
	deptSelector: {
		exchangeState: [],
		type: [],
		userState: [],
		wechat: [],
		load: false
	},
	groupList: [],
	deptId: -1
	
})

const actionHandlers = {
	[FETCH_SYSTEM_DEPARTMENT_LIST]: (state, { response: { list }, params }) => {	
		return state.set('content', fromJS(list))
					.set('params', fromJS(params))
					.set('pending', false)
	},

	[FETCH_SYSTEM_DEPARTMENT_BYID]: (state, { response = {}, deptId }) => {
		return state.set('deptData', Immutable.fromJS(response))
					.set('deptId', deptId)
	},

	[FETCH_DEPARTMENT_GROUP_LIST]: (state, { response, dpid }) => {
		return state.update('groupList', x => Immutable.fromJS(response.result.group))
				.update('dpid', x => dpid)
	},

	[FETCH_SYSTEM_DEPARTMENT_SELECTOR]: (state, { response }) => {
		response.load = true
		return state.set('deptSelector', Immutable.fromJS(response))
	},

	[DELETE_SYSTEM_DEPARTMENT]: (state, { deptId } ) => {
		return state.update('content', x => x.filter(item => item.get('id') != deptId))
	},

	[SAVE_SYSTEM_DEPARTMENT]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response)))
					.updateIn(['params', 'count'], x => x + 1)
	},

	[UPDATE_SYSTEM_DEPARTMENT]: (state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.get('id') == id)
			if (index > -1) {
				return x.update(index, x => {
					return Immutable.fromJS({
						...x.toJS(),
						...response
					})
				})
			}
		})
		
		
	},

	['systemDepartment']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)