import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_SYSTEM_KEY_LIST, 
	ADD_SYSTEM_KEY_LIST, 
	DELETE_SYSTEM_KEY_LIST, 
	UPDATE_SYSTEM_KEY_LIST,
} from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	select: {
		thirdPartyKeyType:[],
		companyList:[]
	},
	params:{
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_SYSTEM_KEY_LIST]: (state, { response, params, select }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('select', x => Immutable.fromJS(select.result))
			.update('pending', x => false)
	},
	[ADD_SYSTEM_KEY_LIST]: (state, { response}) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},
	[DELETE_SYSTEM_KEY_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},
	[UPDATE_SYSTEM_KEY_LIST]:(state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},
	['systemKey']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)