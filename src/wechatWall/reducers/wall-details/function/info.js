import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_ACTIVITY_BYID,
	UPDATE_WALL_ACTIVITY
} from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	// activityName: '这是活动主题',
	// startTime: +new Date,
	// endTime: +new Date

	info: {}
})

const actionHandlers = {
	[FETCH_ACTIVITY_BYID]: (state, { response }) => {
		return state.set('info', Immutable.fromJS(response.result))
	},
	[UPDATE_WALL_ACTIVITY]: (state, { response }) => {
		return state.set('info', Immutable.fromJS(response.result))
	},

	['xxx']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)