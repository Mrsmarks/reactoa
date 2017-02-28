import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_SYSTEM_ORGANIZATION_LIST, 
	ADD_SYSTEM_ORGANIZATION_LIST, 
	UPDATE_SYSTEM_ORGANIZATION_LIST, 
	DELETE_SYSTEM_ORGANIZATION_LIST
} from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	select: [],
	params:{
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_SYSTEM_ORGANIZATION_LIST]: (state, { response, select, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result.enableType))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},
	[ADD_SYSTEM_ORGANIZATION_LIST]: (state, { response}) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},
	[UPDATE_SYSTEM_ORGANIZATION_LIST]: (state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},
	[DELETE_SYSTEM_ORGANIZATION_LIST]:(state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},
	['systemOrganization']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)