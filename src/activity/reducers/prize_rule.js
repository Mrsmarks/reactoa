import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_ACTIVITY_PRIZERULE_LIST,
	ADD_ACTIVITY_PRIZERULE_LIST,
	UPDATE_ACTIVITY_PRIZERULE_LIST,
	DELETE_ACTIVITY_PRIZERULE_LIST,
	FETCH_PRIZERULE_EDIT_SELECT,
	 } from 'activity/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	id: '',
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	select:{
		activityList:[],
		validityType:[],
		redeemCode:[],
		whiteList:[],
		balckList:[],
		creditRule:[],
		creditType:[]
	},
	pending: true
})

const actionHandlers = {
	[FETCH_ACTIVITY_PRIZERULE_LIST]: (state, { response, select, params}) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('select', x => Immutable.fromJS(select.result))
			.update('pending', x => false)
	},

	[FETCH_PRIZERULE_EDIT_SELECT]: (state, { select }) => {
		return state.update('select', x => Immutable.fromJS(select.result))
	},

	[ADD_ACTIVITY_PRIZERULE_LIST]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	[DELETE_ACTIVITY_PRIZERULE_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[UPDATE_ACTIVITY_PRIZERULE_LIST]: (state, { response }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	['activityPrizeRule']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)