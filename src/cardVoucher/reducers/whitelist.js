import createReducer from 'Application/utils/create-reducer'
import {
	FETCH_CARD_VOUCHER_WHITE,
	CHECK_CARD_VOUCHER_WHITE,
	ADD_CARD_VOUCHER_WHITE,
	DEL_CARD_VOUCHER_WHITE,
	UPDATE_CARD_VOUCHER_WHITE,
	GET_STATUS_SELECT_WHITE,
	GET_STATUS_SELECT_PULL
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
		objectType: [],
		whiteType: [],
		routList: [],
		cardList: []
	},
	pending: true
})

const actionHandlers = {
	[FETCH_CARD_VOUCHER_WHITE]: ( state, { response, params } ) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
					.update('params', x => Immutable.fromJS(params))					
					.update('pending',x => false)
	},

	[CHECK_CARD_VOUCHER_WHITE]: ( state, { response } ) => {
		return state.set('info',Immutable.fromJS(response.result))
	},

	[ADD_CARD_VOUCHER_WHITE]: ( state, { response }) => {
		console.log(response)
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params','count'], x => x + 1 )
	},

	[DEL_CARD_VOUCHER_WHITE]: ( state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params','count'], x => x - 1)
	},

	[UPDATE_CARD_VOUCHER_WHITE]: ( state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1){
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	[GET_STATUS_SELECT_WHITE]: ( state, { response } ) => {
		return state.setIn(['selectData','objectType'], Immutable.fromJS(response.result.objectType))
		            .setIn(['selectData','whiteType'], Immutable.fromJS(response.result.whiteType))				
					
	},

	[GET_STATUS_SELECT_PULL]: ( state, { response } ) => {
		return state.setIn(['selectData','objectType'], Immutable.fromJS(response.result.objectType))
		            .setIn(['selectData','whiteType'], Immutable.fromJS(response.result.whiteType))
		            .setIn(['selectData','routList'], Immutable.fromJS(response.result.whiteType))	
		            .setIn(['selectData','cardList'], Immutable.fromJS(response.result.whiteType))					
					
	},

	['whitelist']: (state, { error }) => {
		return state.set('pending',false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)