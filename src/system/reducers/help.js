import createReducer from 'Application/utils/create-reducer'
import { FETCH_SYSTEM_HELP_LIST, ADD_SYSTEM_HELP_NODE, DEL_SYSTEM_HELP_NODE, UPDATE_SYSTEM_HELP_NODE } from '../constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	params: {},
	pending: true
})

const actionHandlers = {
	[FETCH_SYSTEM_HELP_LIST]: (state, { response, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},
	[ADD_SYSTEM_HELP_NODE]: (state, { response: { result } }) => {
		return state.update('content', x => {
			if(result.parent_id == 0) {
				result.children = []
				return x.unshift(Immutable.fromJS(result))
			}else{
				for(let [key, value] of x.entries()){
					if(value.get('id') == result.parent_id){
						const children = value.get('children').unshift(Immutable.fromJS(result))
						return x.update(key, k =>  k.set('children', children))
					}
				}
			}
		})
		.updateIn(['params', 'count'], x => result.parent_id == 0? x + 1: x)
	},
	[DEL_SYSTEM_HELP_NODE]: (state, { response: { result }, id }) => {
		var isParent = false
		return state.update('content', x => {
			for(let [key, value] of x.entries()) {
				if(value.get('id') == id) {
					isParent = true
					return x.filter(item => item.get('id') != id)
				}else{
					for(let [key1, value1] of value.get('children').entries()){
						if(value1.get('id') == id) {
							let children = value.get('children').delete(key1)
							return x.update(key, k => k.set('children', children))
						}
					}
				}
			}
		})
		.updateIn(['params', 'count'], x => isParent? x - 1: x)
	},
	[UPDATE_SYSTEM_HELP_NODE]:(state, { response: { result }, id }) => {
		return state.update('content', x => {
			result.id = id
			if(result.parent_id == 0) {
				var index1 = x.findIndex(item => item.get('id') == id)
				if(index1 > -1) {
					return x.update(index1, x => Immutable.fromJS(result))
				}
			}else{
				for(let [key, value] of x.entries()){
					if(value.get('id') == result.parent_id){
						var index2 = value.get('children').findIndex(item => item.get('id') == id)
						if(index2 > -1) {
							const children = value.get('children').update(index2, x => Immutable.fromJS(result))
							return x.update(key, k =>  k.set('children', children))
						}
					}
				}
			}
		})
	},
	['systemHelp']: (state, {error}) => {
		return state.update('pending', x => false)
	}

}

export default createReducer(initialState, actionHandlers)