import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_MENU_LIST_PAGE,
	FETCH_SYSTEM_MENU_LIST, 
	UPDATE_SYSTEM_MENU_LIST,
	FETCH_SYSTEM_MENU_TYPE 
} from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({

	menuList: [],
	menuDetails: {},
	// content: {},
	currentKey: -1,

	menuType: []
})

const actionHandlers = {
	[FETCH_MENU_LIST_PAGE]: (state, { menuList, menuDetails = {}, currentKey }) => {
		return state.update('menuList', x => Immutable.fromJS(menuList))
					.update('menuDetails', x => Immutable.fromJS(menuDetails))
					.update('currentKey', x => +currentKey)
					.set('pending', false)
					.set('error', {})
	},
	[UPDATE_SYSTEM_MENU_LIST]: (state, { data, response }) => {
		return state.update('menuList', x => x = x.push({
						id: response.result.id,
						name: data.name
					}))
					
	},
	[FETCH_SYSTEM_MENU_LIST]: (state, { menuDetails = {} }) => {
		return state.update('menuDetails', x => Immutable.fromJS(menuDetails))
					.set('error', {})
	},
	[FETCH_SYSTEM_MENU_TYPE]: (state, { response: { result: { menuType } } }) => {
		return state.update('menuType', x => Immutable.fromJS(menuType))
	},
	['systemMenu']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)