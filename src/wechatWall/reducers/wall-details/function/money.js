import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WALL_MONEY_INFO,
	ADD_MONEY_INFO,
	UPDATE_MONEY_INFO,
	DELETE_MONEY_INFO
} from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: []
})

const actionHandlers = {
	[FETCH_WALL_MONEY_INFO]: (state, { response }) => {
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
	},

	[ADD_MONEY_INFO]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
	},

	[UPDATE_MONEY_INFO]: (state, { response, id }) => {

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

	[DELETE_MONEY_INFO]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
	},

	['xxx']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)