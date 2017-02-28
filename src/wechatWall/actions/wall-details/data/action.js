import load from 'Application/utils/fetchApi'
import * as Constants from 'wechatWall/constants'

//获取活动统计数据列表
export function fetchActivityDataById({id, nickname, page, psize = 10}) {

	return async (dispatch) => {
		try {
			
			const response = await load({
				url: '/wechatWall/wechat-wall-activity-user/index',
				data: {
					sid: id,
					'per-page': psize,
					page,
					nickname
				}
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_DATA_BYID,
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

//设置用户抽奖状态
export function setUserDrawStauts(uid) {

	return async (dispatch) => {
		try {
			
			const response = await load({
				url: '/wechatWall/wechat-wall-activity-user/update-status',
				data: {
					uid
				}
			})

			dispatch({
				type: Constants.SET_USER_DRAW_STATUS,
				response,
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//获取获奖情况数据
export function fetchDrawDataById({id, did, change_status, nickname, page, psize = 10}) {

	return async (dispatch) => {
		try {
			
			const response = await load({
				url: '/wechatWall/wechat-wall-draw-record/index',
				data: {
					did,
					sid: id,
					'per-page': psize,
					page,
					change_status,
					nickname
				}
			})

			const select = await load({
				url: '/seletor/wechat-wall/get-wechat-wall-draw-record-list-selector?sid='+id,
			})

			dispatch({
				type: Constants.FETCH_DRAW_DATA_BYID,
				response,
				select,
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

//导出获奖列表
export function exportPrizeList({id, did, nickname}) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechatWall/wechat-wall-draw-record/export',
				data: {
					sid: id,
					did,
					nickname
				}
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//确认兑奖
export function checkDraw(id) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: '/wechatWall/wechat-wall-draw-record/confirm-prize?id='+id,
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
} 

//批量确认兑奖功能
export function checkDrawList(id) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: '/wechatWall/wechat-wall-draw-record/batch-confirm',
				data:{
					id: id
				},
				method: 'post'
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//获取对对碰数据列表
export function fetchBumpList({page, psize = 10, id}) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: '/wechatWall/wechat-wall-mstching-record/index',
				data: {
					'per-page': psize,
					page,
                    sid: id
				}
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_BUMP_LIST,
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

//获取摇大奖活动数据
export function fetchShakePrizeList({id, shake_prize_id, prize_type, page, psize = 10}) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: '/wechatWall/wechat-wall-shake-prize-record/index',
				data: {
					'per-page': psize,
					page,
					sid:id,
					shake_prize_id,
					prize_type
				}
			})

			const select = await load({
				url: '/seletor/wechat-wall/get-shake-prize-list?sid='+id
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_SHAKEPRIZE_LIST,
				response,
				select,
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

//导出
export function exportShakePrizeList({id, shake_prize_id}) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: `/wechatWall/wechat-wall-shake-prize-record/export?sid=${id}&shake_prize_id=${shake_prize_id}`,
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//获取摇一摇活动数据
export function fetchShakeDataList({id, shake_id = '1', page, psize = 10}) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechatWall/wechat-wall-shake-record/index',
				data: {
					'per-page': psize,
					sid: id,
					page,
					shake_id
				}
			})

			const select = await load({
				url: '/seletor/wechat-wall/get-shake-list?sid='+id
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_SHAKE_LIST,
				response,
				select,
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

//导出
export function exportShakeDataList({id, shake_id}) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: `/wechatWall/wechat-wall-shake-record/export?sid=${id}&shake_id=${shake_id}`,
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//数钱列表
export function fetchMoneyList({id, money_id = '1', page, psize = 10}) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: '/wechatWall/wechat-wall-money-record/index',
				data: {
					'per-page': psize,
					sid: id,
					money_id,
					page,
				}
			})

			const select = await load({
				url: '/seletor/wechat-wall/get-money-list?sid='+id
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_MONEY_LIST,
				response,
				select,
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

//导出
export function exportMoneyList({id, money_id}) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: `/wechatWall/wechat-wall-money-record/export?sid=${id}&money_id=${money_id}`,
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//投票活动数据
export function fetchVoteList({ id, vote_id = '1' }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-vote-record/index?sid=${id}&vote_id=${vote_id}`,
			})

			const select = await load({
				url: '/seletor/wechat-wall/get-vote-list?sid='+id
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_VOTE_LIST,
				response,
				select,
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//查看投票人
export function fetchVotePeople(id, vote_detail_id ) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-vote-detail-record/index?sid=${id}&vote_detail_id=${vote_detail_id}`,
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_VOTE_PEOPLE,
				response,
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
