import createReducer from 'Application/utils/create-reducer'
import { 
	UPDATE_SHAKE_PRIZE_CONFIG,
	FETCH_SHAKE_RPIZE_LIST,
	SAVE_WALL_SHAKE_PRIZE,
	UPDATE_WALL_SHAKE_PRIZE,
	DELETE_WALL_SHAKE_PRIZE
} from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	repeat: 1, // 允许重复摇中奖品 
	content: []
})

const actionHandlers = {
	[UPDATE_SHAKE_PRIZE_CONFIG]: (state, { repeat }) => {
		return state.set('repeat', repeat)
	},

	[FETCH_SHAKE_RPIZE_LIST]: (state, { response }) => {
		response.result.list.map(item => {
			item.key = item.id
			item.giftList.map(item => {
				item.key = item.id
				return item
			})
			item.moneyList.map(item => {
				item.key = item.id
				return item
			})
			return item
		})
		return state.set('content', Immutable.fromJS(response.result.list))
					.set('repeat', response.result.shake_prize_repeat)
	},

	[SAVE_WALL_SHAKE_PRIZE]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
	},

	[UPDATE_WALL_SHAKE_PRIZE]: (state, { response, id }) => {
		return state.update('content', x => x.map(item => {
			if (item.get('id') == id) {
				return Immutable.fromJS(response.result)
			}
			return item
		}))
	},

	[DELETE_WALL_SHAKE_PRIZE]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
	},

	['xxx']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)