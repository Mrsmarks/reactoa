import createReducer from 'Application/utils/create-reducer'
import { 
	ADD_WALL_PRIZE,
	FETCH_WALL_PRIZE,
	DELETE_WALL_PRIZE,
	UPDATE_WALL_PRIZE,
	FETCH_WALL_PRIZE_SELECT
} from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	password: "888888",
	selectData: {
		moneyList: [],
		shakeList: [],
		voteList: []
	},
	content: [/*{
		key: 1,
		url: 'http://inews.gtimg.com/newsapp_ls/0/354021077_12088/0',
		awardName: '一等奖', // 奖项
		prizeName: 'ipad', // 奖品
		prizeTotal: 1, // 奖品数量
		take: 1, // 每次抽取数
		config: {
			conditions: 0, //参与抽奖条件
			type: '', // any, contains
			minumumMsg: 0, // 至少发送消息数量,
			shakeId: 0, // 摇一摇的id
			voteId: 0, // 投票id
			voteOptionId: 0, // 投票选项id
			moneyId: 0, // 数钱ID
		}
	},{
		key: 2,
		url: 'http://inews.gtimg.com/newsapp_ls/0/354021077_12088/0',
		awardName: '二等奖',
		prizeName: 'ipad',
		prizeTotal: 12,
		take: 2, // 每次抽取数
		config: {
			conditions: 1,
			type: 'contains', // any, contains
			minumumMsg: 5, // 至少发送消息数量,
			shakeId: 100, // 摇一摇的id
			voteId: 200, // 投票id
			voteOptionId: 222, // 投票选项id
			moneyId: 300, // 数钱ID
		}
		
	}*/]
})

const actionHandlers = {
	[ADD_WALL_PRIZE]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
	},

	[DELETE_WALL_PRIZE]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
	},

	[UPDATE_WALL_PRIZE]: (state, { id, response }) => {
		return state.update('content', x => x.map(item => {
			if (item.get('id') == id) {
				return Immutable.fromJS(response.result)
			}
			return item
		}))
	},

	[FETCH_WALL_PRIZE_SELECT]: (state, { response }) => {
		return state.set('selectData', Immutable.fromJS(response.result))
	},

	[FETCH_WALL_PRIZE]: (state, { response }) => {
		return state.set('content', Immutable.fromJS(response.result.list))
					.set('password', response.result.password)
	},

	['xxx']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)
