import load from 'Application/utils/fetchApi'
import * as Constants from 'wechatWall/constants'

//微信墙布局
//布局列表
export function settingLayoutList({ page = 1, psize = 10, id }) {

	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
			}
			const response = await load({
				url: '/wechatWall/wechat-wall-template-layout/index',
				data: params
			})
            
			dispatch({
				type: Constants.FETCH_WALL_SETTING_LAYOUT,
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

//添加  样式布局
export function addLayoutList(data) {

	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-template-layout/operate?act=add`,
				data: data,
				method: 'post'
			})
			dispatch({
				type: Constants.ADD_WALL_SETTING_LAYOUT,
				response,				
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 修改 样式布局
export function updateLayoutList(data, id) {

	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-template-layout/operate?act=update&id=${id}`,
				data: data,
				method: 'post'
			})
			dispatch({
				type: Constants.UPDATE_WALL_SETTING_LAYOUT,
				response,
				id,
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 删除 样式布局
export function delLayoutList(id) {

	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-template-layout/operate?act=delete&id=${id}`,
			})
			dispatch({
				type: Constants.DELETE_WALL_SETTING_LAYOUT,
				response,
				id
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//微信墙主题
//列表
export function settingThemeList({ page = 1, psize = 10}) {

	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
			}
			const response = await load({
				url: '/wechatWall/wechat-wall-template-style-type/index',
				data: params
			})
			dispatch({
				type: Constants.FETCH_WALL_SETTING_THEME,
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

//添加  
export function addThemeList(data) {

	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-template-style-type/operate?act=add`,
				data: data,
				method: 'post'
			})
			dispatch({
				type: Constants.ADD_WALL_SETTING_THEME,
				response,				
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 修改 
export function updateThemeList(data, id) {

	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-template-style-type/operate?act=update&id=${id}`,
				data: data,
				method: 'post'
			})
			dispatch({
				type: Constants.UPDATE_WALL_SETTING_THEME,
				response,
				id,
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 删除 
export function delThemeList(id) {

	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-template-style-type/operate?act=delete&id=${id}`,
			})
			dispatch({
				type: Constants.DELETE_WALL_SETTING_THEME,
				response,
				id
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 获取模板效果列表
export function getTemplateList({ page = 1, psize = 10, lid, stid }) {
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
				lid,
				stid
			}
			const response = await load({
				url: '/wechatWall/wechat-wall-screen-template/index',
				data: params
			})

			const select = await load({
				url: '/seletor/wechat-wall/get-wechat-wall-screen-template-list-selector'
			})

			dispatch({
				type: Constants.FETCH_WALL_SETTING_TEMPLATE,
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

// 添加，删除模板效果
export function updateTemplateList(act, data, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-screen-template/operate?act=${act}&id=${id}`,
				data: data,
				method: 'post'
			})

			switch(act) {
				case 'add':
				dispatch({
					type: Constants.ADD_WALL_SETTING_TEMPLATE,
					response,
				})
				break
				case 'update':
				dispatch({
					type: Constants.UPDATE_WALL_SETTING_TEMPLATE,
					response,
					id
				})
			}
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//获取编辑页下拉数据
export function getTemplateOption() {
	return async (dispatch) => {
		try {
			
			const option = await load({
				url: '/seletor/wechat-wall/get-wechat-wall-screen-template-edit-selector'
			})

			dispatch({
				type: Constants.GET_WALL_SETTING_EDIT_TEMPLATE,
				option,
			})
			return Promise.resolve(option)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//删除大屏幕效果
export function delTemplateList(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-screen-template/operate?act=delete&id=${id}`,
			})
			dispatch({
				type: Constants.DELETE_WALL_SETTING_TEMPLATE,
				response,
				id
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//查看单个模板详情
export function checkTemplateList({id}) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-screen-template/operate?act=check&id=${id}`,
			})
			dispatch({
				type: Constants.CHECK_WALL_SETTING_TEMPLATE,
				response,
				id
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//修改默认模板
export function updateDefaultTemp(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-screen-template/update-default?id=${id}`,
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//微信墙活动模板
export function fetchWallActivityTemp({ activity_type, screen_type, page, psize = 10 }) {
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
				activity_type,
				screen_type
			}
			const response = await load({
				url: '/wechatWall/wechat-wall-activity-template/index',
				data: params
			})

			const select = await load({
				url: '/seletor/wechat-wall/get-activity-template-list-selector'
			})

			dispatch({
				type: Constants.FETCH_WALL_ACTIVITY_TEMPLATE,
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
//添加，修改
export function updateWallActivityTemp(act, data, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-activity-template/operate?act=${act}&id=${id}`,
				data: data,
				method: 'post'
			})

			switch(act) {
				case 'add':
				dispatch({
					type: Constants.ADD_WALL_ACTIVITY_TEMPLATE,
					response,
				})
				break
				case 'update':
				dispatch({
					type: Constants.UPDATE_WALL_ACTIVITY_TEMPLATE,
					response,
					id
				})
			}
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
} 

//删除
export function delWallActivityTemp(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-activity-template/operate?act=delete&id=${id}`,
			})
			dispatch({
				type: Constants.DELETE_WALL_ACTIVITY_TEMPLATE,
				response,
				id
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//活动模板设置默认
export function updateDefaultActivityTemp(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-activity-template/update-default?id=${id}`,
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
