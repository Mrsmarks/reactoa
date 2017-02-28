import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WALL_ACTIVITY_ALL,
	SAVE_WALL_ACTIVITY,
	DELETE_WALL_ACTIVITY
} from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	all: {
		list: [],
		params: {
			page: 1,
			psize: 10,
			count: 0,
			name: ''
		}
	},
	activityType: 0
})

const actionHandlers = {
	[FETCH_WALL_ACTIVITY_ALL]: (state, { response, params, activityType }) => {
		if (!params.name && activityType == state.get('activityType') && params.page != state.getIn(['all', 'params', 'page'])) {
			state = state.updateIn(['all', 'list'], x => {
				return Immutable.fromJS([
					...x.toJS(),
					...response.result.list
				])
			})
		} else {
			state = state.setIn(['all', 'list'], Immutable.fromJS(response.result.list))
		}

		return state.setIn(['all', 'params'], Immutable.fromJS(params))
					.set('pending', false)
					.set('activityType', activityType)
	},

	[SAVE_WALL_ACTIVITY]: (state, { response }) => {
		return state.updateIn(['all', 'list'], x => x.push(Immutable.fromJS(response.result)))
					.updateIn(['all', 'params', 'count'], x => x + 1)
	},

	[DELETE_WALL_ACTIVITY]: (state, { id }) => {
		return state.updateIn(['all', 'list'], x => x.filter(item => item.get('id') != id))
	},

	['wallRecord']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)