import createReducer from 'Application/utils/create-reducer'
import {
	FETCH_CARD_VOUCHER_PHOTOS,
	CHECK_CARD_VOUCHER_PHOTOS,
	ADD_CARD_VOUCHER_PHOTOS,
	DEL_CARD_VOUCHER_PHOTOS,
	UPDATE_CARD_VOUCHER_PHOTOS	
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
	acname:''
})

const actionHandlers = {
	[FETCH_CARD_VOUCHER_PHOTOS]: ( state, { response, params } ) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
					.update('params', x => Immutable.fromJS(params))
					.update('acname', x => Immutable.fromJS(response.result.acname))
					.update('pending',x => false)
	},

	[CHECK_CARD_VOUCHER_PHOTOS]: ( state, { response } ) => {
		return state.set('info',Immutable.fromJS(response.result))
	},

	[ADD_CARD_VOUCHER_PHOTOS]: ( state, { response }) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params','count'], x => x + 1 )
	},

	[DEL_CARD_VOUCHER_PHOTOS]: ( state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params','count'], x => x - 1)
	},

	[UPDATE_CARD_VOUCHER_PHOTOS]: ( state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1){
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	['cardVoucherPic']: (state, { error }) => {
		return state.set('pending',false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)