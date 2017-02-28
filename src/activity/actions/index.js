import load from 'Application/utils/fetchApi'
import * as Constants from 'activity/constants'


//活动管理
//列表
export function fetchManagementList({ page = 1, psize = 10, type }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 type
			}
			const response = await load({
				url: '/activity/activity/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/activity/get-activity-list-selector',
			})

			console.log(response)

			dispatch({
				type: Constants.FETCH_ACTIVITY_MANAGEMENT_LIST,
				response,
				option,
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

//编辑页下拉数据
export function fetchManagementEditSelect() {
	return async (dispatch) => {
		try {
			const editSelect = await load({
				url: '/seletor/activity/get-activity-edit-selector',
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_EDIT_SELECT,
				editSelect
			})

				return Promise.resolve(editSelect)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//查看单个活动详情
export function fetchManagementDetail(id, act='check') {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/activity/activity/operate',
					data: {
						id: id,
						act: act
					}
				})

				dispatch({
					type: Constants.FETCH_ACTIVITY_MANAGEMENT_DETAIL,
					response
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//添加活动
export function addManagementList(obj) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/activity/activity/operate?act=add',
					method: 'post',
					data: obj
				})

				dispatch({
					type: Constants.ADD_ACTIVITY_MANAGEMENT_LIST,
					response
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//修改活动
export function updateManagementList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity/operate?act=update&id='+id,
				method: 'post',
				data: obj
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_ACTIVITY_MANAGEMENT_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//删除活动
export function delManagementList(id, aid, act='delete') {
	return async (dispatch) => {

		try {	
			const params = {
				id: id,
				act: act
			}
			const response = await load({
				url: '/activity/activity/operate',
				data: params
			})

			dispatch({
				type: Constants.DELETE_ACTIVITY_MANAGEMENT_LIST,
				response,
				id
			})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//获取活动配置列表
export function fetchSettingList({ page = 1, psize = 10, aid }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 aid
			}
			const response = await load({
				url: '/activity/activity-config/index',
				data: params,
			})

			const select = await load({
				url: '/seletor/activity/get-activity-config-edit-selector',
				data: {aid}
			})

			console.log(select)

			dispatch({
				type: Constants.FETCH_ACTIVITY_SETTING_LIST,
				response,
				select,
				aid,
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

//获取单个配置数据
export function fetchSettingDetail({aid, id, act='check'}) {
	return async (dispatch) => {
		try {
			const params = { 
				 aid,
				 id,
				 act
			}
			const response = await load({
				url: '/activity/activity-config/operate',
				data: params
			})

			console.log(response)

			dispatch({
				type: Constants.FETCH_ACTIVITY_SETTING_DETAIL,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//添加配置列表
export function addSettingList(obj, aid) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-config/operate?act=add&aid='+aid,
				data: obj,
				method:'post'
			})

			dispatch({
				type: Constants.ADD_ACTIVITY_SETTING_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}


//修改配置列表
export function updateSettingList(obj, id, aid) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/activity/activity-config/operate?act=update&id=${id}&aid=${aid}`,
				data: obj,
				method:'post'
			})

			dispatch({
				type: Constants.UPDATE_ACTIVITY_SETTING_LIST,
				response,
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//删除配置列表
export function delSettingList(id, aid, act='delete') {
	return async (dispatch) => {
		try {
			const params = {
				id: id,
				act: act,
				aid: aid
			}
			const response = await load({
				url: '/activity/activity-config/operate',
				data: params
			})

			dispatch({
				type: Constants.DELETE_ACTIVITY_SETTING_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//活动规则库
//列表
export function fetchRuleList({ page = 1, psize = 10 }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize
			}
			const response = await load({
				url: '/activity/activity-rule/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/activity/get-activity-rule-type-selector',
			})

			console.log(response)
			dispatch({
				type: Constants.FETCH_ACTIVITY_RULE_LIST,
				response,
				option,
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

//增
export function addRuleList(obj) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-rule/operate?act=add',
				data: obj,
				method:'post'
			})
			console.log(response)
			dispatch({
				type: Constants.ADD_ACTIVITY_RULE_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//删
export function delRuleList(id, act = 'delete') {
	return async (dispatch) => {
		try {
			const params ={
				id: id,
				act: act
			}
			const response = await load({
				url: '/activity/activity-rule/operate',
				data: params,
			})
			console.log(response)
			dispatch({
				type: Constants.DELETE_ACTIVITY_RULE_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//改
export function updateRuleList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-rule/operate?act=update&id='+id,
				data: obj,
				method: 'post'
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_ACTIVITY_RULE_LIST,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//获取下拉数据
export function fetchRuleEditSelect() {
	return async (dispatch) => {
		try {
			const option = await load({
				url: '/seletor/activity/get-activity-rule-type-selector',
			})

			dispatch({
				type: Constants.FETCH_RULE_EDIT_SELECT,
				option
			})

				return Promise.resolve(option)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//赞助方管理
//列表
export function fetchSupportList({ page = 1, psize = 10, name }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 name
			}
			const response = await load({
				url: '/activity/activity-sponsor/index',
				data: params,
			})

			console.log(response)
			dispatch({
				type: Constants.FETCH_ACTIVITY_SUPPORT_LIST,
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

//增
export function addSupportList(obj) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-sponsor/operate?act=add',
				data: obj,
				method:'post'
			})
			console.log(response)
			dispatch({
				type: Constants.ADD_ACTIVITY_SUPPORT_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//删
export function delSupportList(id, act = 'delete') {
	return async (dispatch) => {
		try {
			const params ={
				id: id,
				act: act
			}
			const response = await load({
				url: '/activity/activity-sponsor/operate',
				data: params,
			})
			console.log(response)
			dispatch({
				type: Constants.DELETE_ACTIVITY_SUPPORT_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//改
export function updateSupportList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-sponsor/operate?act=update&id='+id,
				data: obj,
				method: 'post'
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_ACTIVITY_SUPPORT_LIST,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//活动奖品
//列表
export function fetchPrizeList({ page = 1, psize = 10, aid }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 aid
			}
			const response = await load({
				url: '/activity/activity-prize/index',
				data: params,
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_PRIZE_LIST,
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

export function fetchPrizeSelect() {

	return async (dispatch) => {
		try {
			const select = await load({
				url: '/seletor/activity/get-activity-prize-edit-selector',
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_PRIZE_SELECT,
				select
			})

			return Promise.resolve(select)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//增
export function addPrizeList(obj) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-prize/operate?act=add',
				data: obj,
				method:'post'
			})
			console.log(response)
			dispatch({
				type: Constants.ADD_ACTIVITY_PRIZE_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//删
export function delPrizeList(id, act = 'delete') {
	return async (dispatch) => {
		try {
			const params ={
				id: id,
				act: act
			}
			const response = await load({
				url: '/activity/activity-prize/operate',
				data: params,
			})
			console.log(response)
			dispatch({
				type: Constants.DELETE_ACTIVITY_PRIZE_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
} 
//改
export function updatePrizeList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-prize/operate?act=update&id='+id,
				data: obj,
				method: 'post'
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_ACTIVITY_PRIZE_LIST,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//获取编辑下拉数据
export function fetchPrizeEditSelect() {
	return async (dispatch) => {
		try {
			const option = await load({
				url: '/seletor/activity/get-activity-prize-edit-selector',
			})

			dispatch({
				type: Constants.FETCH_PRIZE_EDIT_SELECT,
				option
			})

				return Promise.resolve(option)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}
//根据id获取奖品详情
export function getPrizeDetail({id, act='check'}) {
	return async (dispatch) => {
		try {
			const params = { 
				 id,
				 act
			}
			const response = await load({
				url: '/activity/activity-prize/operate',
				data: params
			})

			console.log(response)

			dispatch({
				type: Constants.FETCH_ACTIVITY_PRIZE_DETAIL,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//奖品规则库管理
//列表
export function fetchPrizeRuleList({ page = 1, psize = 10, aid }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 aid
			}
			const response = await load({
				url: '/activity/activity-prize-rule/index',
				data: params,
			})

			const select = await load({
				url: '/seletor/activity/get-activity-prize-rule-edit-selector',
			})

			console.log(response)
			dispatch({
				type: Constants.FETCH_ACTIVITY_PRIZERULE_LIST,
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

//编辑下拉数据
export function fetchPrizeRuleEditSelect() {
	return async (dispatch) => {
		try {
			const select = await load({
				url: '/seletor/activity/get-activity-prize-rule-edit-selector',
			})
			console.log(select)
			dispatch({
				type: Constants.FETCH_PRIZERULE_EDIT_SELECT,
				select
			})

				return Promise.resolve(select)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//增
export function addPrizeRuleList(obj) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-prize-rule/operate?act=add',
				data: obj,
				method:'post'
			})
			console.log(response)
			dispatch({
				type: Constants.ADD_ACTIVITY_PRIZERULE_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//删
export function delPrizeRuleList(id, act = 'delete') {
	return async (dispatch) => {
		try {
			const params ={
				id: id,
				act: act
			}
			const response = await load({
				url: '/activity/activity-prize-rule/operate',
				data: params,
			})
			console.log(response)
			dispatch({
				type: Constants.DELETE_ACTIVITY_PRIZERULE_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
} 
//改
export function updatePrizeRuleList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-prize-rule/operate?act=update&id='+id,
				data: obj,
				method: 'post'
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_ACTIVITY_PRIZERULE_LIST,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//活动兑换码
//列表
export function fetchCodeList({ page = 1, psize = 10, aid, pid }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 aid,
				 pid
			}
			const response = await load({
				url: '/activity/activity-redeem-code/index',
				data: params,
			})

			const select = await load({
				url: '/seletor/activity/get-activity-redeem-code-list-selector',
			})

			const option = await load({
				url: '/seletor/activity/get-activity-redeem-code-edit-selector',
			})
			dispatch({
				type: Constants.FETCH_ACTIVITY_CODE_LIST,
				response,
				select,
				option,
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

//增
export function addCodeList(obj) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-redeem-code/operate?act=add',
				data: obj,
				method:'post'
			})
			console.log(response)
			dispatch({
				type: Constants.ADD_ACTIVITY_CODE_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//删
export function delCodeList(id, act = 'delete') {
	return async (dispatch) => {
		try {
			const params ={
				id: id,
				act: act
			}
			const response = await load({
				url: '/activity/activity-redeem-code/operate',
				data: params,
			})
			console.log(response)
			dispatch({
				type: Constants.DELETE_ACTIVITY_CODE_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
} 
//改
export function updateCodeList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-redeem-code/operate?act=update&id='+id,
				data: obj,
				method: 'post'
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_ACTIVITY_CODE_LIST,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//活动模板
//列表
export function fetchTemplateList({ page = 1, psize = 10, type }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 type
			}
			const response = await load({
				url: '/activity/activity-template/index',
				data: params,
			})

			const select = await load({
				url: '/seletor/activity/get-activity-list-selector',
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_TEMPLATE_LIST,
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

//增
export function addTemplateList(obj) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-template/operate?act=add',
				data: obj,
				method:'post'
			})
			console.log(response)
			dispatch({
				type: Constants.ADD_ACTIVITY_TEMPLATE_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//删
export function delTemplateList(id, act = 'delete') {
	return async (dispatch) => {
		try {
			const params ={
				id: id,
				act: act
			}
			const response = await load({
				url: '/activity/activity-template/operate',
				data: params,
			})
			console.log(response)
			dispatch({
				type: Constants.DELETE_ACTIVITY_TEMPLATE_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
} 
//改
export function updateTemplateList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-template/operate?act=update&id='+id,
				data: obj,
				method: 'post'
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_ACTIVITY_TEMPLATE_LIST,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//活动路由
//列表
export function fetchRouteList({ page = 1, psize = 10, name }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 name
			}

			const response = await load({
				url: '/activity/activity-route/index',
				data: params,
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_ROUTE_LIST,
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

//查询编辑下拉数据
export function fetchRouteEditSelect() {
	return async (dispatch) => {
		try {
			const option = await load({
				url: '/seletor/activity/get-activity-route-edit-selector',
			})
			console.log(option)
			dispatch({
				type: Constants.FETCH_ROUTE_EDIT_SELECT,
				option
			})

				return Promise.resolve(option)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}


//查
export function checkRouteList({id, act='check'}) {
	return async (dispatch) => {
		try {
			const params = {
				id,
				act
			}
			const response = await load({
				url: '/activity/activity-route/operate',
				data: params
			})

			dispatch({
				type: Constants.CHECK_ACTIVITY_ROUTE_LIST,
				response,
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//增
export function addRouteList(obj) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-route/operate?act=add',
				data: obj,
				method:'post'
			})
			console.log(response)
			dispatch({
				type: Constants.ADD_ACTIVITY_ROUTE_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//删
export function delRouteList(id, act = 'delete') {
	return async (dispatch) => {
		try {
			const params ={
				id: id,
				act: act
			}
			const response = await load({
				url: '/activity/activity-route/operate',
				data: params,
			})
			console.log(response)
			dispatch({
				type: Constants.DELETE_ACTIVITY_ROUTE_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
} 
//改
export function updateRouteList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-route/operate?act=update&id='+id,
				data: obj,
				method: 'post'
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_ACTIVITY_ROUTE_LIST,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//黑名单
//列表
export function fetchBlackList({ page = 1, psize = 10, aid, type, value_num }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 aid,
				 type,
				 value_num
			}
			const response = await load({
				url: '/activity/activity-black-list/index',
				data: params,
			})

			const select = await load({
				url: '/seletor/activity/get-activity-black-edit-selector',
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_BLACK_LIST,
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

//增
export function addBlackList(obj) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-black-list/operate?act=add',
				data: obj,
				method:'post'
			})
			console.log(response)
			dispatch({
				type: Constants.ADD_ACTIVITY_BLACK_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//删
export function delBlackList(id, act = 'delete') {
	return async (dispatch) => {
		try {
			const params ={
				id: id,
				act: act
			}
			const response = await load({
				url: '/activity/activity-black-list/operate',
				data: params,
			})
			console.log(response)
			dispatch({
				type: Constants.DELETE_ACTIVITY_BLACK_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
} 
//改
export function updateBlackList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-black-list/operate?act=update&id='+id,
				data: obj,
				method: 'post'
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_ACTIVITY_BLACK_LIST,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//白名单
//列表
export function fetchWhiteList({ page = 1, psize = 10, aid, type, value_num }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 aid,
				 type,
				 value_num
			}
			const response = await load({
				url: '/activity/activity-white-list/index',
				data: params,
			})

			const select = await load({
				url: '/seletor/activity/get-activity-white-edit-selector',
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_WHITE_LIST,
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

//增
export function addWhiteList(obj) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-white-list/operate?act=add',
				data: obj,
				method:'post'
			})
			console.log(response)
			dispatch({
				type: Constants.ADD_ACTIVITY_WHITE_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//删
export function delWhiteList(id, act = 'delete') {
	return async (dispatch) => {
		try {
			const params ={
				id: id,
				act: act
			}
			const response = await load({
				url: '/activity/activity-white-list/operate',
				data: params,
			})
			console.log(response)
			dispatch({
				type: Constants.DELETE_ACTIVITY_WHITE_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
} 
//改
export function updateWhiteList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/activity/activity-white-list/operate?act=update&id='+id,
				data: obj,
				method: 'post'
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_ACTIVITY_WHITE_LIST,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//中奖名单
//列表
export function fetchUserPrizeList({ page = 1, psize = 10, aid, prize_id, start_time, end_time }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 aid,
				 prize_id,
				 start_time,
				 end_time
			}
			const response = await load({
				url: '/activity/activity-user-prize/index',
				data: params,
			})

			const select = await load({
				url: '/seletor/activity/get-activity-user-prize-list-selector',
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_USERPRIZE_LIST,
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

//导出中奖名单
export function exportUserPrizeList({ aid, prize_id, start_time, end_time }) {
	return async (dispatch) => {
		try {
			const params = { 
				 aid,
				 prize_id,
				 start_time,
				 end_time
			}
			const response = await load({
				url: '/activity/activity-user-prize/export',
				data: params,
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//分享日志
//列表
export function fetchShareLogList({ page = 1, psize = 10, aid }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 aid
			}
			const response = await load({
				url: '/activity/activity-share/index',
				data: params,
			})

			const select = await load({
				url: '/seletor/activity/get-activity-share-list-selector',
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_SHARELOG_LIST,
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

//统计信息
//参与日志
export function fetchStatsLogList({ page = 1, psize = 10, start_time, aid, end_time, mobile, name }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 aid,
				 start_time,
				 end_time,
				 mobile,
				 name
			}
			const response = await load({
				url: '/activity/activity-stats/partake-log',
				data: params,
			})

			const select = await load({
				url: '/seletor/activity/get-activity-stats-selector',
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_STATSLOG_LIST,
				response,
				select,
				params: {
					psize,
					count: response.result.count,
					page: response.result.page,aid
				}
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//参与活动数
export function fetchStatsNumList({ page = 1, psize = 10, start_time, aid, end_time, check_type }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 aid,
				 start_time,
				 end_time,
				 check_type
			}
			const response = await load({
				url: '/activity/activity-stats/partake-number',
				data: params,
			})

			const select = await load({
				url: '/seletor/activity/get-activity-stats-selector',
			})

			dispatch({
				type: Constants.FETCH_ACTIVITY_STATSNUM_LIST,
				response,
				select,
				params: {
					psize,
					count: response.result.count,
					page: response.result.page,aid
				}
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
