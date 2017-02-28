import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_NET_WORK_LIST, 
	ADD_NET_WORK_LIST, 
	DELETE_NET_WORK_LIST, 
	UPDATE_NET_WORK_LIST 
} from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	option: {
		userState:[],
		departmentList:[]
	},
	params:{
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_NET_WORK_LIST]: (state, { response, params, option }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('option', x => Immutable.fromJS(option.result))
			.update('pending', x => false)
	},
	[ADD_NET_WORK_LIST]: (state, { response}) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},
	[DELETE_NET_WORK_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},
	[UPDATE_NET_WORK_LIST]:(state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},
	['systemNetWork']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)