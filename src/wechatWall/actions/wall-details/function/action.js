import load from 'Application/utils/fetchApi'
import * as Constants from 'wechatWall/constants'

import { uploadFile } from 'Application/actions'

// 根据ID查询活动
export function fetchActivityById({ id }) {

	return async (dispatch) => {
		try {
			
			const response = await load({
				url: '/wechatWall/wechat-wall-scene/check-detail',
				data: {
					id
				}
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_BYID,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 查询弹幕
export function fetchMsgreview({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechatWall/wechat-wall-barrage/index',
				data: {
					sid: id
				}
			})

			dispatch({
				type: Constants.FETCH_WALL_MSGREVIEW,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 修改弹幕
export function updateMsgreview(data, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-barrage/operate?act=update&sid=${id}`,
				method: 'post',
				data
			})

			dispatch({
				type: Constants.UPDATE_WALL_MSGREVIEW,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 嘉宾墙－获取列表
export function fetchGuestList({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-guest/index?sid=${id}`
			})
			dispatch({
				type: Constants.FETCH_WALL_GUEST_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 添加嘉宾 / 修改嘉宾
export function editGuest(data, act, sid, id) {
	return async (dispatch) => {
		try {

			const response = await load({
				url: `/wechatWall/wechat-wall-guest/operate?act=${act}&sid=${sid}&id=${id}`,
				method: 'post',
				data
			})

			switch(act) {
				case 'update':
					dispatch({
						type: Constants.UPDATE_WALL_GUEST,
						response,
						id
					})
					break
				case 'add':
					dispatch({
						type: Constants.ADD_WALL_GUEST,
						response
					})
					break
				case 'delete':
					dispatch({
						type: Constants.DELETE_WALL_GUEST,
						id
					})
			}

			

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 对嘉宾排序
export function sortGuest(data, sid) {
	return async (dispatch) => {
		try {

			const response = await load({
				url: `/wechatWall/wechat-wall-guest/change-sort?sid=${sid}`,
				method: 'post',
				data: {
					sort: data
				}
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}


// 图片墙－添加图片
export function addPhoto(data, sid) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-photo/operate?act=add&sid=${sid}`,
				data,
				method: 'post'
			})

			dispatch({
				type: Constants.ADD_WALL_PHOTO,
				response
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 删除图片
export function deletePhoto(sid, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-photo/operate?act=delete&sid=${sid}&id=${id}`
			})

			dispatch({
				type: Constants.DELETE_WALL_PHOTO,
				id
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
// 保存图片来源
export function savePhotoOrigin(type, sid) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-photo/save?sid=${sid}`,
				method: 'post',
				data: {
					photo_source: type
				}
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function fetchPhotoList({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-photo/index?sid=${id}`
			})

			dispatch({
				type: Constants.FETCH_PHOTO_LIST,
				response
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 奖项－查询列表
export function fetchPrizeList({ page = 1, psize = 100, id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-draw/index?page=${page}&per-page=${psize}&sid=${id}`
			})

			dispatch({
				type: Constants.FETCH_WALL_PRIZE,
				response
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 奖项 添加／修改
export function editPrize({ postData = {}, sid, act, id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-draw/operate?sid=${sid}&act=${act}&id=${id}`,
				method: 'post',
				data: postData
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.ADD_WALL_PRIZE,
						response
					})
					break
				case 'delete':
					dispatch({
						type: Constants.DELETE_WALL_PRIZE,
						id
					})
					break
				case 'update':
					dispatch({
						type: Constants.UPDATE_WALL_PRIZE,
						response,
						id
					})
					break
			}
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 奖项－修改密码
export function updatePassword(password, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-draw/update-config?&sid=${id}`,
				method: 'post',
				data: {
					password
				}
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
// 奖项－下拉数据
export function fetchWallPrizeSelectData(sid) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/seletor/wechat-wall/get-wechat-wall-draw-edit?sid=${sid}`
			})

			dispatch({
				type: Constants.FETCH_WALL_PRIZE_SELECT,
				response
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 摇一摇 获取列表
export function fetchShakeList({ id, page = 1, psize = 100 }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-shake/index?sid=${id}&page=${page}&psize=${psize}`
			})

			dispatch({
				type: Constants.FETCH_WALL_SHAKE_LIST,
				response
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function updateShakeConfig(postData, sid) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-shake/update-config?sid=${sid}`,
				method: 'post',
				data: postData
			})

			dispatch({
				type: Constants.UPDATE_WALL_SHAKE_CONFIG,
				postData
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 摇一摇－删除
export function editShake(postData, act, id, sid) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-shake/operate?act=${act}&id=${id}&sid=${sid}`,
				method: 'post',
				data: postData
			})

			switch(act) {
				case 'delete':
					dispatch({
						type: Constants.DELETE_WALL_SHAKE,
						id
					})
					break
				case 'add':
					dispatch({
						type: Constants.ADD_WALL_SHAKE,
						response
					})
				case 'update':
					dispatch({
						type: Constants.UPDATE_WALL_SHAKE,
						id,
						response
					})
			}

			

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 对对碰 － 查询
export function fetchMstchingInfo({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-mstching/index?sid=${id}`
			})

			dispatch({
				type: Constants.FETCH_WALL_MSTCHING_INFO,
				response
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 对对碰 - 修改
export function updateMstching(postData, sid) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-mstching/operate?act=update&sid=${sid}`,
				method: 'post',
				data: postData
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function updateMstchingStatus(status, sid) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-mstching/close-mstching?sid=${sid}`,
				method: 'post',
				data: {
					mstching_status: status
				}
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 数钱－查询信息
export function fetchWallMoneyInfo({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-money/index?sid=${id}`
			})

			dispatch({
				type: Constants.FETCH_WALL_MONEY_INFO,
				response
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function saveMoneyInfo({ postData, act, sid, id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-money/operate?act=${act}&sid=${sid}&id=${id}`,
				data: postData,
				method: 'post'
			})
			switch(act) {
				case 'add':
					dispatch({
						type: Constants.ADD_MONEY_INFO,
						response
					})
					break
				case 'update':
					dispatch({
						type: Constants.UPDATE_MONEY_INFO,
						response,
						id
					})
					break
				case 'delete':
					dispatch({
						type: Constants.DELETE_MONEY_INFO,
						id
					})
					break
			}

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 投票－获取投票列表
export function fetchVoteList({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-vote/index?sid=${id}`
			})

			dispatch({
				type: Constants.FETCH_WALL_VOTE_LIST,
				response
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function editVote({ postData, act, sid, id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-vote/operate?act=${act}&sid=${sid}&id=${id}`,
				method: 'post',
				data: postData
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.SAVE_WALL_VOTE,
						response
					})
					break
				case 'update':
					dispatch({
						type: Constants.UPDATE_WALL_VOTE,
						response,
						id
					})
					break
				case 'delete':
					dispatch({
						type: Constants.DELETE_WALL_VOTE,
						id
					})
					break
			}

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 摇大奖－获取列表数据
export function fetchShakePrizeList({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-shake-prize/index?sid=${id}`
			})

			dispatch({
				type: Constants.FETCH_SHAKE_RPIZE_LIST,
				response
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 摇大奖－设置配置信息
export function updateShakePrizeConfig({ sid, repeat }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-shake-prize/update-config?sid=${sid}&repeat=${+repeat}`
			})

			dispatch({
				type: Constants.UPDATE_SHAKE_PRIZE_CONFIG,
				repeat: +repeat
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 摇大奖 添加修改删除
export function saveShakePrize({ sid, postData, act, id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-shake-prize/operate?act=${act}&sid=${sid}&id=${id}`,
				method: 'post',
				data: postData
			})

			switch (act) {
				case 'add':
					dispatch({
						type: Constants.SAVE_WALL_SHAKE_PRIZE,
						response
					})
					break
				case 'update':
					dispatch({
						type: Constants.UPDATE_WALL_SHAKE_PRIZE,
						response,
						id
					})
					break
				case 'delete':
					dispatch({
						type: Constants.DELETE_WALL_SHAKE_PRIZE,
						id
					})
					break
			}

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
