import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WALL_WORD_LIST ,
	ADD_WALL_WORD_LIST ,
	DELETE_WALL_WORD_LIST ,
	DELETE_WALL_WORDS_LIST 
	 } from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true,
})

const actionHandlers = {
	[FETCH_WALL_WORD_LIST]: (state, { response, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	[ADD_WALL_WORD_LIST]: (state, { response }) => {
		return state.update('content', x => Immutable.fromJS(response.result).concat(x))
					.updateIn(['params', 'count'], x => x + response.result.length )		
	},

	[DELETE_WALL_WORD_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)		
	},

	[DELETE_WALL_WORDS_LIST]: (state, { response }) => {
		return state		
	},

	['wallDetailWord']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)