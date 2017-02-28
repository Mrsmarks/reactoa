import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_STATUS_CODE_LIST,
	ADD_STATUS_CODE_LIST,
	UPDATE_STATUS_CODE_LIST,
} from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	pending: true,
	content: [],
	params: {
		page: 0,
		psize: 0,
		count: 0
	}
})

const actionHandlers = {
	[FETCH_STATUS_CODE_LIST]: (state, { response, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.set('pending', false)
	},

	[ADD_STATUS_CODE_LIST]: (state, {response}) => {
		return state.update('content', x => x.unshift(Immutable.fromJS(response.result)))
					.updateIn(['params', 'count'], x => x + 1 )
	},

	[UPDATE_STATUS_CODE_LIST]: (state, {response}) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.toJS().id == response.result.id)
			if(index > -1) {
				return x.update(index, x => Immutable.fromJS(response.result))
			}
		})
	},

	['systemStatusCode']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)