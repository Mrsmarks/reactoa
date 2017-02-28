import createReducer from 'Application/utils/create-reducer'
import { FETCH_SYSTEM_SETTING_DATA, UPDATE_SYSTEM_SETTING_DATA } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	pending: true,
	setting: {}
	
})

const actionHandlers = {
	[FETCH_SYSTEM_SETTING_DATA]: (state, { response }) => {		
		return state.update('setting', x => Immutable.fromJS(response))
			.set('pending', false)
	},

	[UPDATE_SYSTEM_SETTING_DATA]: (state, { response }) => {
		return state
	},


	['systemSetting']:(state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)