import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_SYSTEM_GROUP_LIST, 
	ADD_SYSTEM_GROUP_LIST, 
	UPDATE_SYSTEM_GROUP_LIST, 
	DELETE_SYSTEM_GROUP_LIST,
	CHECK_SYSTEM_GROUP_LIST,
	GET_SYSTEM_GROUP_LIST
} from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	info:[],
	group:{
		name:'',
		wechat_account_auth:[]
	},
	params:{
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_SYSTEM_GROUP_LIST]: (state, { response, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},
	[ADD_SYSTEM_GROUP_LIST]: (state, { response}) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},
	[UPDATE_SYSTEM_GROUP_LIST]: (state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},
	[GET_SYSTEM_GROUP_LIST]: (state, { response }) => {
		return state.update('group', x => Immutable.fromJS(response.result))
	},

	[CHECK_SYSTEM_GROUP_LIST]: (state, { response }) => {
		return state.update('info', x => Immutable.fromJS(response.result.accountGroupList))
	},
	[DELETE_SYSTEM_GROUP_LIST]:(state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},
	['systemGroup']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)