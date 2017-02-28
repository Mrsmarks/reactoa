import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_ACTIVITY_VOTE_LIST,
	FETCH_ACTIVITY_VOTE_PEOPLE
	 } from 'wechatWall/constants'
import Immutable from 'immutable'


const initialState = Immutable.fromJS({
	content:[],
	select:[],
	people:[],
	pending: true
})

const actionHandlers = {
	[FETCH_ACTIVITY_VOTE_LIST]: (state, { response, select }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result.voteList))
			.update('pending', x => false)
	},

	[FETCH_ACTIVITY_VOTE_PEOPLE]: (state, { response }) => {
		return state.update('people', x => Immutable.fromJS(response.result.list))
	},

	['wallDetailVote']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)