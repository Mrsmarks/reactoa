import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WALLDETAIL_BUMP_LIST,
	FETCH_WALL_GUEST_LIST,
	ADD_WALL_GUEST,
	UPDATE_WALL_GUEST,
	DELETE_WALL_GUEST
} from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: []
})

const actionHandlers = {
	[FETCH_WALL_GUEST_LIST]: (state, { response }) => {
		response.result.list.sort((a, b) => a.sort > b.sort)
		return state.set('content', Immutable.fromJS(response.result.list))
	},

	[ADD_WALL_GUEST]: (state, { response }) => {
		return state.update('content', x => x.push(Immutable.fromJS(response.result)))
	},

	[UPDATE_WALL_GUEST]: (state, { response, id }) => {
		return state.update('content', x => x.map(item => {
			if (item.get('id') == id) {
				return Immutable.fromJS(response.result)
			}
			return item
		}))
	},

	[DELETE_WALL_GUEST]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
	},

	['xxx']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)