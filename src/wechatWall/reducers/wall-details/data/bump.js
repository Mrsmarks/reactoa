import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_ACTIVITY_BUMP_LIST,
	 } from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_ACTIVITY_BUMP_LIST]: (state, { response, params }) => {
		
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	['wallDetailBump']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)