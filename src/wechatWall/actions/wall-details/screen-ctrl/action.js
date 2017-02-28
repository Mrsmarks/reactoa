import load from 'Application/utils/fetchApi'
import * as Constants from 'wechatWall/constants'
// 屏幕控制台
// 消息审核
export function MessageAduitList({ page = 1, psize = 10, id, auth_status = 0, message_type, refuse_type, item = 'aduit', list_type }) {

	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
				sid: id,
				auth_status,
				message_type,
				refuse_type,
				list_type,
				item
			}
			const response = await load({
				url: '/wechatWall/wechat-wall-message/index',
				data: params
			})

			const option = await load({
				url: '/seletor/wechat-wall/get-wechat-wall-message-list-selector'
			})
			var x = ''
			switch(item) {
				case 'aduit':
				x = Constants.FETCH_WALL_MESSAGE_ADUIT_LIST
				break
				case 'wall':
				x = Constants.FETCH_WALL_RUN_LIST
				break
				case 'unpass': 
				x = Constants.FETCH_WALL_UNPASS_LIST
			}
			dispatch({
				type: x,
				response,
				option,
				// listType: type,
				params: {
					psize,
					count: response.result.count,
					page: response.result.page,
				}
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}


export function BlackNameList({ page = 1, psize = 10, sid, type = 'nameList'}) {

	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
				sid,
				type
			}
			const response = await load({
				url: '/wechatWall/wechat-wall-black-list/index',
				data: params
			})
			dispatch({
				type: Constants.FETCH_WALL_NAME_LIST,
				response,
				listType: type,
				params: {
					psize,
					count: response.result.count,
					page: response.result.page,
				}
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//审批通过
export function passAduit(id) {
	return async (dispatch) => {
		try {
			const params = {
				id
			}
			const response = await load({
				url: '/wechatWall/wechat-wall-message/pass-wall',
				data: params
			})
			// dispatch({
			// 	type: Constants.WALL_PASS_ADUIT_ITEM,
			// 	response,
			// 	id,
			// 	params: {
			// 		psize,
			// 		count: response.result.count,
			// 		page: response.result.page,
			// 	}
			// })
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}
//批量审批接口
export function aduitItems(id, type) {
	return async (dispatch) => {
		try {
			const params = {
				id
			}
			const response = await load({
				url: '/wechatWall/wechat-wall-message/batch-operate?type='+type,
				data: params,
				method: 'post'
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//审批不通过
export function unPassAduit(id) {
	return async (dispatch) => {
		try {
			const params = {
				id
			}
			const response = await load({
				url: '/wechatWall/wechat-wall-message/down-wall',
				data: params
			})
			// dispatch({
			// 	type: Constants.WALL_UNPASS_ADUIT_ITEM,
			// 	response,
			// 	id,
			// 	params: {
			// 		psize,
			// 		count: response.result.count,
			// 		page: response.result.page,
			// 	}
			// })
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//屏蔽消息
export function unMessageAduit(id) {
	return async (dispatch) => {
		try {
			const params = {
				id
			}
			const response = await load({
				url: '/wechatWall/wechat-wall-message/shield',
				data: params
			})
			// dispatch({
			// 	type: Constants.WALL_UNMESSAGE_ADUIT_ITEM,
			// 	response,
			// 	id,
			// 	params: {
			// 		psize,
			// 		count: response.result.count,
			// 		page: response.result.page,
			// 	}
			// })
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//解禁
export function unBanAduit(id, act='delete') {
	return async (dispatch) => {
		try {
			const params = {
				id,
				act
			}
			const response = await load({
				url: '/wechatWall/wechat-wall-black-list/operate',
				data: params
			})
			// dispatch({
			// 	type: Constants.WALL_UNMESSAGE_ADUIT_ITEM,
			// 	response,
			// 	id,
			// 	params: {
			// 		psize,
			// 		count: response.result.count,
			// 		page: response.result.page,
			// 	}
			// })
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//修改消息审核主配置
export function  updateMessageAduitSetting({id, msg_auth, msg_sensitive}) {
		return async (dispatch) => {
		try {
			const params = {
				sid: id,
				msg_auth,
				msg_sensitive
			}
			const response = await load({
				url: '/wechatWall/wechat-wall-message/update-config',
				method: 'post',
				data: params
			})
			
			dispatch({
				type: Constants.UPDATE_WALL_MESSAGE_ADUIT_SETTING,
				response,
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//大屏幕控制
export function wallScreenCtrl(sid) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechatWall/wechat-wall-scene-config/index?sid='+sid,
			})

			dispatch({
				type: Constants.FETCH_WALL_SCREEN_CTRL,
				response
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//修改
export function updateWallScreenCtrl(sid, data, way) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-scene-config/operate?sid=${sid}&type=${way}`,
				data: data,
				method: 'post'
			})

			dispatch({
				type: Constants.UPDATE_WALL_SCREEN_CTRL,
				response,
				way
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//刷新抽奖人数
export function freshPeopleNum(sid) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `	/wechatWall/wechat-wall-scene-config/refresh-draw-num?sid=${sid}`,
			})

			dispatch({
				type: Constants.UPDATE_WALL_SCREEN_PNUM,
				response,
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//直播台
//发送消息
export function sendMessage(sid, message) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-live/send?sid=${sid}`,
				data: { message: message },
				method: 'post'
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//再次发送消息
export function sendMessageAgain(sid, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-live/send-again?sid=${sid}&id=${id}`,
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//获取消息列表
export function fetchMessageList({ id, page = 1, psize = 10 }) {
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
				sid: id
			}

			const response = await load({
				url: `/wechatWall/wechat-wall-live/index`,
				data: params
			})

			dispatch({
				type: Constants.FETCH_LIVE_MESSAGE_LIST,
				response,
				params: {
					psize,
					count: response.result.count,
					page: response.result.page,
				}
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//删除消息
export function delMessageList(sid, id) {
	return async (dispatch) => {
		try {

			const response = await load({
				url: `/wechatWall/wechat-wall-live/delete-message?sid=${sid}&id=${id}`,
			})

			dispatch({
				type: Constants.DELETE_LIVE_MESSAGE_LIST,
				response,
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//获取虚拟角色列表
export function getVirtualRoleList({id}) {
	return async (dispatch) => {
		try {
			const params = {
				sid: id
			}

			const response = await load({
				url: `/wechatWall/wechat-wall-virtual-role/index`,
				data: params
			})

			dispatch({
				type: Constants.FETCH_VIRTUAL_ROLE_LIST,
				response
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//添加/修改 虚拟角色
export function updateVirtualRole(act = "add", id, data) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-virtual-role/operate?act=${act}&sid=${id}`,
				data: data,
				method: 'post'
			})

			switch(act) {
				case 'add':
				dispatch({
					type: Constants.ADD_VIRTUAL_ROLE_LIST,
					response
				})
				break
				case 'update':
				dispatch({
					type: Constants.UPDATE_VIRTUAL_ROLE_LIST,
					response
				})
				break

			}
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//删除虚拟角色
export function delVirtualRole(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-virtual-role/operate?act=delete&id=${id}`,
			})
			dispatch({
				type: Constants.DELETE_VIRTUAL_ROLE_LIST,
				response
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//发送消息
export function sendVirtualMessage(data) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-virtual-role/send`,
				data: data,
				method: 'post'
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//已发送消息列表
export function getMessageList({id, page, psize = 10, type = 1, auth_status = 1}) {
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
				sid: id,
				type,
				auth_status
			}

			const response = await load({
				url: `/wechatWall/wechat-wall-message/index`,
				data: params
			})

			dispatch({
				type: Constants.FETCH_VIRTUAL_MESSAGE_LIST,
				response,
				params: {
					psize,
					count: response.result.count,
					page: response.result.page,
				}
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//敏感词设置列表
export function getWordList({ id, text, page, psize = 10 }) {
	return async (dispatch) => {
		try {
			const params = {
				page,
				text,
				'per-page': psize,
				sid: id
			}

			const response = await load({
				url: `/wechatWall/wechat-wall-sensitive/index`,
				data: params
			})

			dispatch({
				type: Constants.FETCH_WALL_WORD_LIST,
				response,
				params: {
					psize,
					count: response.result.count,
					page: response.result.page,
				}
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//添加敏感词
export function addWordList(data, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-sensitive/operate?act=add&sid=${id}`,
				data: {text: data},
				method:'post'
			})

			dispatch({
				type: Constants.ADD_WALL_WORD_LIST,
				response,
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//删除敏感词列表
export function delWordList(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-sensitive/operate?act=delete&id=${id}`,
			})

			dispatch({
				type: Constants.DELETE_WALL_WORD_LIST,
				response,
				id
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}

//批量删除敏感词列表
export function delWordsList(id, ids) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-sensitive/batch-delete?sid=${id}&act=delete`,
				data: {
					id: ids
				},
				method: 'post'
			})

			dispatch({
				type: Constants.DELETE_WALL_WORDS_LIST,
				response,
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	} 
}



