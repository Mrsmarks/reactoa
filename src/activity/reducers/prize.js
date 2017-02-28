import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_ACTIVITY_PRIZE_LIST,
	FETCH_ACTIVITY_PRIZE_SELECT,
	ADD_ACTIVITY_PRIZE_LIST,
	UPDATE_ACTIVITY_PRIZE_LIST,
	DELETE_ACTIVITY_PRIZE_LIST,
	FETCH_ACTIVITY_PRIZE_DETAIL, 
	FETCH_PRIZERULE_EDIT_SELECT
	 } from 'activity/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	info:{},
	id: '',
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	select:{
		activityList: [],
		prizeRule: [],
		prizeType: [],
		sponsorList: []
	},
	ruleOption: {
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
	[FETCH_ACTIVITY_PRIZE_LIST]: (state, { response, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	[FETCH_PRIZERULE_EDIT_SELECT]: (state, { select }) => {
		return state.update('ruleOption', x => Immutable.fromJS(select.result))
	},

	[FETCH_ACTIVITY_PRIZE_SELECT]: (state, { select }) => {
		return state.update('select', x => Immutable.fromJS(select.result))
	},

	[ADD_ACTIVITY_PRIZE_LIST]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	[DELETE_ACTIVITY_PRIZE_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[UPDATE_ACTIVITY_PRIZE_LIST]: (state, { response }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	[FETCH_ACTIVITY_PRIZE_DETAIL]: (state, { response, id }) => {
		return state.update('info', x => Immutable.fromJS(response.result))
					.update('id', x => id)
	},

	['activityPrize']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)