import createReducer from 'Application/utils/create-reducer'
import {
	FETCH_CARD_VOUCHER_ROUTES,
	CHECK_CARD_VOUCHER_ROUTE,
	ADD_CARD_VOUCHER_ROUTE,
	DEL_CARD_VOUCHER_ROUTE,
	UPDATE_CARD_VOUCHER_ROUTE,
	FETCH_CARD_VOUCHER_CARD_LIST
} from 'cardVoucher/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	info: {},
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true,
	cardList: []
})

const actionHandlers = {
	[FETCH_CARD_VOUCHER_ROUTES]: ( state, { response, params } ) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
					.update('params', x => Immutable.fromJS(params))
					.update('pending',x => false)
	},
	[FETCH_CARD_VOUCHER_CARD_LIST]: ( state, { response, params } ) => {
		return state.update('cardList', x => Immutable.fromJS(response.result.card_list))
					.update('pending',x => false)
	},
	[CHECK_CARD_VOUCHER_ROUTE]: ( state, { response } ) => {
		return state.set('info',Immutable.fromJS(response.result))
	},

	[ADD_CARD_VOUCHER_ROUTE]: ( state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params','count'], x => x + 1 )
	},
	[DEL_CARD_VOUCHER_ROUTE]: (state, {response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params','count'], x => x - 1)
					.update('pending',x => false)
	},
	 

	[UPDATE_CARD_VOUCHER_ROUTE]: ( state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.get('id')== response.result.id)
			if(index > -1){
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	['cardVoucherRoute']: (state, { error }) => {
		return state.set('pending',false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)