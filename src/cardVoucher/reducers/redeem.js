import createReducer from 'Application/utils/create-reducer'
import {
	FETCH_CARD_VOUCHER_REDEEM,
	CHECK_CARD_VOUCHER_REDEEM,
	ADD_CARD_VOUCHER_REDEEM,
	DEL_CARD_VOUCHER_REDEEM,
	UPDATE_CARD_VOUCHER_REDEEM,
	GET_STATUS_SELECT_REDEEM,
	GET_STATUS_SELECT_PULLR
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
	selectData:{
		cardsList: [],
		redeemType: [],
		synchType: []
	},
	pending: true
})

const actionHandlers = {
	[FETCH_CARD_VOUCHER_REDEEM]: ( state, { response, params } ) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
					.update('params', x => Immutable.fromJS(params))					
					.update('pending',x => false)
	},

	[CHECK_CARD_VOUCHER_REDEEM]: ( state, { response } ) => {
		return state.set('info',Immutable.fromJS(response.result))
	},

	[ADD_CARD_VOUCHER_REDEEM]: ( state, { response }) => {
		console.log(response)
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params','count'], x => x + 1 )
	},

	[DEL_CARD_VOUCHER_REDEEM]: ( state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params','count'], x => x - 1)
	},

	[UPDATE_CARD_VOUCHER_REDEEM]: ( state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1){
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	[GET_STATUS_SELECT_REDEEM]: ( state, { response } ) => {
		return state.setIn(['selectData','cardsList'], Immutable.fromJS(response.result.cardsList))
		            .setIn(['selectData','redeemType'], Immutable.fromJS(response.result.redeemType))
		            .setIn(['selectData','synchType'], Immutable.fromJS(response.result.synchType))				
					
	},

	[GET_STATUS_SELECT_PULLR]: ( state, { response } ) => {
		return state.setIn(['selectData','cardsList'], Immutable.fromJS(response.result.cardsList))			
					
	},

	['redeemlist']: (state, { error }) => {
		return state.set('pending',false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)