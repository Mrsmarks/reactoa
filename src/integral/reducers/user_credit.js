import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_SINGER_USER_RECORD
	 } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	singer_record: [],
	total: '',
	pending: true
})

const actionHandlers = {
	[FETCH_SINGER_USER_RECORD]: (state, { response }) => {
		return state.update('singer_record', x => Immutable.fromJS(response.result.list))
			.update('total', x => Immutable.fromJS(response.result.total_credit))
			.update('pending', x => false)
	},

	['integralUserRecord']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)