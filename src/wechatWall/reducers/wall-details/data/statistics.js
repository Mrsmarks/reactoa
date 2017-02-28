import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_ACTIVITY_DATA_BYID,
	 } from 'wechatWall/constants'
import Immutable from 'immutable'


const initialState = Immutable.fromJS({
	content: {
		list:[],
		count: 0, 
		mess_count: 0,
		fensi_count: 0,
	},
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_ACTIVITY_DATA_BYID]: (state, { response, params }) => {
		return state.updateIn(['content', 'list'], x => Immutable.fromJS(response.result.list))
			.updateIn(['content', 'count'], x => Immutable.fromJS(response.result.count))
			.updateIn(['content', 'mess_count'], x => Immutable.fromJS(response.result.mess_count))
			.updateIn(['content', 'fensi_count'], x => Immutable.fromJS(response.result.fensi_count))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	['wallDetailStatistics']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)