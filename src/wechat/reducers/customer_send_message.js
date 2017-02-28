import createReducer from 'Application/utils/create-reducer'
import { FETCH_WECHAT_CUSTOMERSENDMESSAGE_LIST, FETCH_WECHAT_CUSTOMER_BYID, FETCH_WECHAT_CUSTOMER_MSG_SELECT, SAVE_WECHAT_CUSTOMER_MSG, DELETE_WECHAT_CUSTOMER_MSG } from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	params: {},

	editData: {
		content: []
	},

	selectData: {
		userType: [],
		messageType: [],
		weixinGroup: [],
		virtualGroup: []
	}
})

const actionHandlers = {
	[FETCH_WECHAT_CUSTOMERSENDMESSAGE_LIST]: (state, { response: { result: { list } }, params }) => {
		
		return state.set('content', Immutable.fromJS(list))
					.set('params', Immutable.fromJS(params))
					.set('pending', false)
	},
	[FETCH_WECHAT_CUSTOMER_MSG_SELECT]: (state, { response }) => {
		return state.set('selectData', Immutable.fromJS(response))
	},
	[SAVE_WECHAT_CUSTOMER_MSG]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response)))
					.updateIn(['params', 'count'], x => x + 1)
	},
	[DELETE_WECHAT_CUSTOMER_MSG]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},
	[FETCH_WECHAT_CUSTOMER_BYID]: (state, { response }) => {
		return state.set('editData', Immutable.fromJS(response))
	}
}


export default createReducer(initialState, actionHandlers)