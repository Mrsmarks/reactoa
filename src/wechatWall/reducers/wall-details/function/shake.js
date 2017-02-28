import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WALL_SHAKE_LIST,
	UPDATE_WALL_SHAKE_CONFIG,
	DELETE_WALL_SHAKE,
	UPDATE_WALL_SHAKE,
	ADD_WALL_SHAKE
} from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	hasLimit: false, // 是否限制
	topLevel: 1, // 比赛结果的前x名
	afterRound: 1, // 不能参与之后的x轮摇一摇
	content: [/*{
		title: '摇一摇名称1111', // 摇一摇名称
		time: 60, // 摇一摇时间，单位秒
		topLevel: 5, // 结束后显示前x名
		type: '手动创建' // 创建类型
	},{
		title: '摇一摇名称2222',
		time: 120,
		topLevel: 50,
		type: '手动创建'
	}*/]
})

const actionHandlers = {
	[FETCH_WALL_SHAKE_LIST]: (state, { response }) => {
		response.result.config = response.result.config || {}
		Object.assign({
			shake_limit_top: 1,
			shake_limit_periods: 1,
			shake_limit: false
		}, response.result.config)
		response.result.list.map(item => {
			if (item.children) {
				item.children = item.children.map((item, index) => {
					item.key = item.id
					return item
				})
			}
			item.key = item.id

			return item
		})
		return state.set('content', Immutable.fromJS(response.result.list))
					.set('topLevel', response.result.config.shake_limit_top)
					.set('afterRound', response.result.config.shake_limit_periods)
					.set('hasLimit', !!response.result.config.shake_limit)
	},

	[UPDATE_WALL_SHAKE_CONFIG]: (state, { postData }) => {
		return state.set('topLevel', postData.shake_limit_top)
					.set('afterRound', postData.shake_limit_periods)
					.set('hasLimit', !!postData.shake_limit)
	},

	[DELETE_WALL_SHAKE]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
	},

	[UPDATE_WALL_SHAKE]: (state, { response, id }) => {
		if (response.result.parent == 0) {
			return state.update('content', x => x.map(item => {
				if (item.get('id') == id) {
					response.result.key = id
					if (item.get('children')) {
						response.result.children = item.get('children')
					}
					return Immutable.fromJS(response.result)
				}
				return item
			}))
		} else {
			return state.update('content', x => x.map(item => {
				if (item.get('id') == response.result.parent) {
					item = item.set('children', item.get('children').map(item => {
						if (item.get('id') == id) {
							response.result.key = id
							return Immutable.fromJS(response.result)
						}
						return item
					}))
				}
				
				return item
			}))
		}
		
	},

	[ADD_WALL_SHAKE]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
	},

	['xxx']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)