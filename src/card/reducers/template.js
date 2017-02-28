import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_CARD_TEMPLATE_LIST,
	ADD_CARD_TEMPLATE_LIST,
	UPDATE_CARD_TEMPLATE_LIST,
	DELETE_CARD_TEMPLATE_LIST,
	 } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	id: '',
	select: [],
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_CARD_TEMPLATE_LIST]: (state, { response, params, select }) => {
		
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result.templateType))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	[ADD_CARD_TEMPLATE_LIST]: (state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	[DELETE_CARD_TEMPLATE_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[UPDATE_CARD_TEMPLATE_LIST]: (state, { response }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	['cardTemplate']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)