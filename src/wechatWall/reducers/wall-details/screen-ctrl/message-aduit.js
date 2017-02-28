import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WALL_MESSAGE_ADUIT_LIST,
	FETCH_WALL_RUN_LIST,
	FETCH_WALL_UNPASS_LIST,
	FETCH_WALL_NAME_LIST,
	WALL_UNPASS_ADUIT_ITEM,
	WALL_PASS_ADUIT_ITEM
	 } from 'wechatWall/constants'
import Immutable from 'immutable'


const initialState = Immutable.fromJS({
	msg_auth: 0,
	msg_sensitive: 0,
	option:{
		messageType:[],
		refuseType:[]
	},
	content: {
		aduit: {
			list: [],
			params: {
				page: 0,
				psize: 0,
				count: 0
			},
		},
		wall: {
			list: [],
			select: [],
			params: {
				page: 0,
				psize: 0,
				count: 0
			}
		},
		unpass: {
			list: [],
			select: [],
			params: {
				page: 0,
				psize: 0,
				count: 0
			}
		},
		nameList: {
			list: [],
			params: {
				page: 0,
				psize: 0,
				count: 0
			}
		},
	},
	pending: true
})

const actionHandlers = {
	[FETCH_WALL_MESSAGE_ADUIT_LIST]: (state, { response, params  }) => {
		return state.updateIn(['content', 'aduit', 'list'], x => Immutable.fromJS(response.result.list))
			.updateIn(['content', 'aduit', 'params'], x => Immutable.fromJS(params))
			.update('msg_auth', x => response.result.msg_auth)
			.update('msg_sensitive', x => response.result.msg_sensitive)
			// .update('listType', x => {
			// 	if(x.includes(listType)) return
			// 	return x.push(listType)
			// })
			.update('pending', x => false)
	},
	[FETCH_WALL_RUN_LIST]: (state, { response, params, option }) => {
		
		return state.updateIn(['content', 'wall', 'list'], x => Immutable.fromJS(response.result.list))
			.updateIn(['content', 'wall', 'params'], x => Immutable.fromJS(params))
			.update('option', x => Immutable.fromJS(option.result))
			.update('msg_auth', x => response.result.msg_auth)
			.update('msg_sensitive', x => response.result.msg_sensitive)
			// .update('listType', x => {
			// 	if(x.includes(listType)) return
			// 	return x.push(listType)
			// })
			.update('pending', x => false)
	},
	[FETCH_WALL_UNPASS_LIST]: (state, { response, params, option }) => {
		
		return state.updateIn(['content', 'unpass', 'list'], x => Immutable.fromJS(response.result.list))
			.updateIn(['content', 'unpass', 'params'], x => Immutable.fromJS(params))
			.update('option', x => Immutable.fromJS(option.result))
			.update('msg_auth', x => response.result.msg_auth)
			.update('msg_sensitive', x => response.result.msg_sensitive)
			// .update('listType', x => {
			// 	if(x.includes(listType)) return
			// 	return x.push(listType)
			// })
			.update('pending', x => false)
	},
	[FETCH_WALL_NAME_LIST]: (state, { response, params }) => {
		
		return state.updateIn(['content', 'nameList', 'list'], x => Immutable.fromJS(response.result.list))
			.updateIn(['content', 'nameList', 'params'], x => Immutable.fromJS(params))
			.update('msg_auth', x => response.result.msg_auth)
			.update('msg_sensitive', x => response.result.msg_sensitive)
			// .update('listType', x => {
			// 	if(x.includes(listType)) return
			// 	return x.push(listType)
			// })
			.update('pending', x => false)
	},

	['wallDetailMessageAduit']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)