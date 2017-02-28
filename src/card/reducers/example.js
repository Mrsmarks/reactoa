import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_CARD_EXAMPLE_LIST,
	ADD_CARD_EXAMPLE_LIST,
	UPDATE_CARD_EXAMPLE_LIST,
	DELETE_CARD_EXAMPLE_LIST,
	FETCH_CARD_EXAMPLE_DETAIL,
	FETCH_CARD_EXAMPLE_AUTH,
	FETCH_CARD_EXAMPLE_EDIT_SELECT,
	UPDATE_CARD_EXAMPLE_STICKY
	 } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	info: {},
	id: '',
	auth: [],
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	options:{
		CardsType: [],
		CardsTemplate: []
	},
	pending: true
})

const actionHandlers = {
	[FETCH_CARD_EXAMPLE_LIST]: (state, { response, params, option }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('options', x => Immutable.fromJS(option.result))
			.update('pending', x => false)
	},

	[ADD_CARD_EXAMPLE_LIST]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	[DELETE_CARD_EXAMPLE_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[UPDATE_CARD_EXAMPLE_LIST]: (state, { response }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	[FETCH_CARD_EXAMPLE_DETAIL]: (state, { response ,id }) => {
		return state.update('info', x => Immutable.fromJS(response.result))
					.update('id', x => id)
	},
	
	[FETCH_CARD_EXAMPLE_EDIT_SELECT]: (state, { option }) => {
		return state.update('options', x => Immutable.fromJS(option.result))
	},

	[FETCH_CARD_EXAMPLE_AUTH]: (state, { response, id }) => {
		return state.update('auth', x => Immutable.fromJS(response.result.CardsConfig))
	},

	[UPDATE_CARD_EXAMPLE_STICKY]: (state, {response, id}) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	['cardExample']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)