import createReducer from 'Application/utils/create-reducer'
import { FETCH_WECHAT_CUSTOMERSTATISTICAL_LIST } from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	params: {
		page: 1,
		psize: 10,
		name: '',
		start_time: '',
		end_time: ''
	}
})

const actionHandlers = {
	[FETCH_WECHAT_CUSTOMERSTATISTICAL_LIST]: (state, { response: { result: { list } }, params }) => {
		return state.set('content', Immutable.fromJS(list))
					.set('params', Immutable.fromJS(params))
					.set('pending', false)
	}
}


export default createReducer(initialState, actionHandlers)