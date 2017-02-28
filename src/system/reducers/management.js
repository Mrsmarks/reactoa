import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_SYSTEM_MANAGEMENT_LIST,
	ADD_SYSTEM_MANAGEMENT_LIST,
	UPDATE_SYSTEM_MANAGEMENT_LIST,
	DELETE_SYSTEM_MANAGEMENT_LIST,
	CHECK_SYSTEM_MANAGEMENT_LIST
} from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	pending: true,
	content: [],
	info: {},
	id: '',
	option:{
		userState:[],
		exchangeState: []
	},
	params: {
		page: 0,
		psize: 0,
		count: 0
	}
})

const actionHandlers = {
	[FETCH_SYSTEM_MANAGEMENT_LIST]: (state, { response, params, option}) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('option', x => Immutable.fromJS(option.result))
			.update('params', x => Immutable.fromJS(params))
			.set('pending', false)
	},

	[ADD_SYSTEM_MANAGEMENT_LIST]: (state, {response}) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	[UPDATE_SYSTEM_MANAGEMENT_LIST]: (state, {response}) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	[DELETE_SYSTEM_MANAGEMENT_LIST]: (state, {response, id}) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[CHECK_SYSTEM_MANAGEMENT_LIST]: (state, {response, id}) => {
		console.log(response.result)
		return state.update('info', x => Immutable.fromJS(response.result))
					.update('id', x => id)
	},

	['systemManagement']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)