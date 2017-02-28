import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WECHAT_CUSTOMMENU_LIST,
	UPDATE_WECHAT_CUSTOMMENU_LIST,
	DELETE_WECHAT_CUSTOMMENU_LIST,
	ADD_WECHAT_CUSTOMMENU_LIST
} from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true,
})

const actionHandlers = {
	[FETCH_WECHAT_CUSTOMMENU_LIST]: (state, { response, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('status', x => Immutable.fromJS(status))
			.update('pending', x => false)
	},

    [UPDATE_WECHAT_CUSTOMMENU_LIST]: (state, { response, id }) => {
    	return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == id)
			if(index > -1) {
				response.result.id = id
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
    },

	[DELETE_WECHAT_CUSTOMMENU_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[ADD_WECHAT_CUSTOMMENU_LIST]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	['wechatCustomMenu']:(state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}

}


export default createReducer(initialState, actionHandlers)