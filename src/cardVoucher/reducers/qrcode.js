import createReducer from 'Application/utils/create-reducer'
import {
	FETCH_CARD_VOUCHER_QRCODES,
	CHECK_CARD_VOUCHER_QRCODE,
	ADD_CARD_VOUCHER_QRCODE,
	DEL_CARD_VOUCHER_QRCODE,
	UPDATE_CARD_VOUCHER_QRCODE,
	FETCH_CARD_VOUCHER_QRCODE_SELECTOR,
	GENERATE_CARD_VOUCHER_QRCODE
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
	select:{
		cardList: [],
		sceneList: [],
		uniqueType: []
	}
})

const actionHandlers = {
	[FETCH_CARD_VOUCHER_QRCODES]: ( state, { response, params } ) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
					.update('params', x => Immutable.fromJS(params))
					.update('pending',x => false)
	},

	[CHECK_CARD_VOUCHER_QRCODE]: ( state, { response } ) => {
		return state.set('info',Immutable.fromJS(response.result))
					.update('pending',x => false)
	},

	[ADD_CARD_VOUCHER_QRCODE]: ( state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params','count'], x => x + 1 )
	},

	[DEL_CARD_VOUCHER_QRCODE]: ( state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params','count'], x => x - 1)
	},

	[UPDATE_CARD_VOUCHER_QRCODE]: ( state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.get('id') == response.result.id)
			if(index > -1){
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},
	[FETCH_CARD_VOUCHER_QRCODE_SELECTOR]: ( state, { response } ) => {
		return state.update('select', x => Immutable.fromJS(response.result))
					.update('pending', x => false)
	},
	[GENERATE_CARD_VOUCHER_QRCODE]: ( state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.get('id') == response.result.id)
			if(index > -1){
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},
	['cardVoucherQRCODE']: (state, { error }) => {
		return state.set('pending',false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)