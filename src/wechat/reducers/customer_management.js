import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WECHAT_CUSTOMERMANAGEMENT_LIST, 
} from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	wait: {
		count: 0,
		list: []
	},
    params: {},
	pending: true,
})

const actionHandlers = {
	[FETCH_WECHAT_CUSTOMERMANAGEMENT_LIST]: (state, { response, wait, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('wait', x => Immutable.fromJS(wait))
			.update('pending', x => false)
	},

	['wechatCustomerManagement']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}


}


export default createReducer(initialState, actionHandlers)