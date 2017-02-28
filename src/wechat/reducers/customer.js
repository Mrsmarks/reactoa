import createReducer from 'Application/utils/create-reducer'
import { FETCH_WECHAT_CUSTOMER_LIST, ADD_WECHAT_CUSTOMER, UPDATE_WECHAT_CUSTOMER, DELETE_WECHAT_CUSTOMER } from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
})

const actionHandlers = {
	[FETCH_WECHAT_CUSTOMER_LIST]: (state, { response: { result: { list } }, params }) => {
		
		return state.update('content', x => Immutable.fromJS(list))
					.update('params', x => Immutable.fromJS(params))
					.set('pending', false)
	},
	[ADD_WECHAT_CUSTOMER]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response)))
	},
	[DELETE_WECHAT_CUSTOMER]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},
	[UPDATE_WECHAT_CUSTOMER]: (state, { response, id }) => {
		return state.update('content', x => {
			return x.map(item => {
				if (item.get('id') == id) {
					item = Immutable.fromJS({
						...item.toJS(),
						...response
					})
				}
				return item
			})
		})
	}

}


export default createReducer(initialState, actionHandlers)