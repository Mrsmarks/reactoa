import createReducer from 'Application/utils/create-reducer'
import {
	FETCH_CARD_VOUCHER_RECORD,
	CHECK_CARD_VOUCHER_RECORD,
	FETCH_CARD_VOUCHER_RECORD_SELECTOR
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
	cardStatus:[]
})

const actionHandlers = {
	[FETCH_CARD_VOUCHER_RECORD]: ( state, { response, params } ) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
					.update('params', x => Immutable.fromJS(params))
					.update('pending',x => false)
	},

	[CHECK_CARD_VOUCHER_RECORD]: ( state, { response } ) => {
		return state.set('info',Immutable.fromJS(response.result))
					.update('pending',x => false)
	},
 
	[FETCH_CARD_VOUCHER_RECORD_SELECTOR]: ( state, { response } ) => {
		return state.update('cardStatus', x => Immutable.fromJS(response.result.cardStatus))
					.update('pending', x => false)
	},
 
	['cardVoucherRecord']: (state, { error }) => {
		return state.set('pending',false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)