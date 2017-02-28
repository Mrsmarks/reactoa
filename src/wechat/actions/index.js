import load from 'Application/utils/fetchApi'
import * as Constants from '../constants'
// 公众号
// 列表
export function fetchPublicList({ page = 1, psize = 10 }) {

	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize
			}
			const response = await load({
				url: '/wechat/wechat-account/index',
				data: params
			})
			dispatch({
				type: Constants.FETCH_WECHAT_PUBLIC_LIST,
				response,
				// url相关参数
				params: {
					psize,
					count: response.result.count,
					page: response.result.page,
				}
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//获取当前id公众号数据
export function fetchInfoById({id, act='check'}) {

	return async (dispatch) => {
		try {
			const params = {
				id,
				act
			}
			const response = await load({
				url: '/wechat/wechat-account/operate',
				data: params
			})
			dispatch({
				type: Constants.FETCH_INFO_BY_ID,
				response
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//
//获取下拉数据
export function getSelectList() {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/seletor/wechat/get-wechat-edit-selector'
			})
			dispatch({
				type: Constants.FETCH_WECHAT_PUBLIC_SELECT,
				response
			})

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//添加
export function addPublicList(obj) {
	return async (dispatch) => {
		try {
			const params = obj
			const response = await load({
				url: '/wechat/wechat-account/operate?act=add',
				data: params,
				method: 'post'
			})
			dispatch({
				type: Constants.ADD_WECHAT_PUBLIC_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//修改
export function updatePublicList(obj, id) {
	return async (dispatch) => {
		try {
			const params = obj
			const response = await load({
				url: '/wechat/wechat-account/operate?act=update&id='+id,
				data: params,
				method: 'post'
			})
			dispatch({
				type: Constants.UPDATE_WECHAT_PUBLIC_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//删除
export function delPublicItem(id, act='delete') {
	return async (dispatch) => {
		try {
			const params = { id: id, act: act }
			const response = (await load({
				url: '/wechat/wechat-account/operate',
				data: params,
			}))
			dispatch({
				type: Constants.DELETE_WECHAT_PUBLIC_LIST,
				response,
				id
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
		
	}
}


export function updateItemPrint(checked) {
	return async (dispatch) => {
		try {
			const params = { checked }
			const response = (await load({
				url: '/webchat/public/editPrint',
				data: params
			})).content
			dispatch({
				type: Constants.UPDATE_ITEM_PRINT,
				response
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//菜单管理
// 获取默认菜单管理列表
export function fetchMenuList({ page = 1, psize = 10, name }) {
	return async (dispatch) => {
		try{
			const params = { 
				page,
				'per-page': psize ,
				name
			}
			const response = await load({
				url: '/wechat/wechat-menu/index',
				data: params
			})

			const select = await load({
				url: '/seletor/wechat/get-wechat-menu-edit-selector',
			})

			dispatch({
				type: Constants.FETCH_WECHAT_MENU_LIST,
				response,
				select,
				params: {
						psize,
						count: response.result.count,
						page: response.result.page,
				}
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}

//修改菜单排序
export function updateMenuSort(id, type) {
	return async (dispatch) => {
		try{
			const params = { 
				id,
				type
			}
			const response = await load({
				url: '/wechat/wechat-menu/change-sort',
				data: params
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
	}
}
//增
export function addMenuList(obj) {
	return async (dispatch) => {
		try{
			const response = await load({
				url: '/wechat/wechat-menu/operate?act=add',
				data: obj,
				method: 'post'
			})

			dispatch({
				type: Constants.ADD_WECHAT_MENU_LIST,
				response
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//删
export function delMenuList(id, act='delete') {
	return async (dispatch) => {
		try{
			const params = {
				id: id,
				act: act
			}
			const response = await load({
				url: '/wechat/wechat-menu/operate',
				data: params
			})

			dispatch({
				type: Constants.DELETE_WECHAT_MENU_LIST,
				response,
				id,
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//改
export function updateMenuList(obj, id) {
	return async (dispatch) => {
		try{
			const params = obj
			const response = await load({
				url: '/wechat/wechat-menu/operate?act=update&id='+id,
				data: params,
				method: 'post'
			})

			dispatch({
				type: Constants.UPDATE_WECHAT_MENU_LIST,
				response,
				id
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//查
export function checkMenuList(id, parent_id, act='check') {
	return async (dispatch) => {
		try{
			const params = {
				id: id,
				parent_id: parent_id,
				act: act
			}
			const response = await load({
				url: '/wechat/wechat-menu/operate',
				data: params
			})

			dispatch({
				type: Constants.CHECK_WECHAT_MENU_LIST,
				response
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//修改菜单启用状态
export function updateMenuStauts(id) {
	return async (dispatch) => {
		try{
			const params = {id: id}
			const response = await load({
				url: '/wechat/wechat-menu/update-is-enable',
				data: params
			})

			dispatch({
				type: Constants.UPDATE_WECHAT_MENU_STATUS,
				response
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//同步主菜单
export function syncPrimaryMenu() {
	return async (dispatch) => {
		try{
			const response = await load({
				url: '/wechat/wechat-menu/synch-wechat-menu'
			})

			dispatch({
				type: Constants.SYNC_WECHAT_MENU_STATUS,
				response
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}

//个性化菜单
 export function fetchCustomMenuList({ page = 1, psize = 10, name }) {

	return async (dispatch) => {
		try {
			const params = { 
				page, 
				'per-page': psize ,
				name
			}
			const response = (await load({
				url: '/wechat/wechat-personal-menu/index',
				data: params
			}))
			dispatch({
				type: Constants.FETCH_WECHAT_CUSTOMMENU_LIST,
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
export function addCustomMenuList(obj) {
	return async (dispatch) => {
		try{
			const response = await load({
				url: '/wechat/wechat-personal-menu/operate?act=add',
				data: obj,
				method: 'post'
			})

			dispatch({
				type: Constants.ADD_WECHAT_CUSTOMMENU_LIST,
				response
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//删
export function delCustomMenuList(id, act='delete') {
	return async (dispatch) => {
		try{
			const params = {
				id: id,
				act: act
			}
			const response = await load({
				url: '/wechat/wechat-personal-menu/operate',
				data: params
			})

			dispatch({
				type: Constants.DELETE_WECHAT_CUSTOMMENU_LIST,
				response,
				id
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//改
export function updateCustomMenuList(obj, id) {
	return async (dispatch) => {
		try{
			const params = obj
			const response = await load({
				url: '/wechat/wechat-personal-menu/operate?act=update&id='+id,
				data: params,
				method: 'post'
			})

			dispatch({
				type: Constants.UPDATE_WECHAT_CUSTOMMENU_LIST,
				response,
				id
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}

//添加菜单包
 export function fetchMenuPackageList({menuId, name}) {
	return async (dispatch) => {
		try {
			const params = {
				menuId,
				name
			}
			const response = (await load({
				url: '/wechat/wechat-personal-menu/index-menu',
				data: params
			}))

			const select = (await load({
				url: '/seletor/wechat/get-wechat-person-menu-edit-selector'
			}))
			dispatch({
				type: Constants.FETCH_WECHAT_CUSTOMMENUPKG_LIST,
				response,
				select
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//增
export function addMenuPackageList(obj, parentKey, menuId, act='add') {
	return async (dispatch) => {
		try{
			const response = await load({
				url: `/wechat/wechat-personal-menu/create-menu?act=${act}&menuId=${menuId}&parentKey=${parentKey}`,
				data: obj,
				method: 'post'
			})

			dispatch({
				type: Constants.ADD_WECHAT_CUSTOMMENUPKG_LIST,
				response
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//删
export function delMenuPackageList(menuId, parentKey, childKey, act='delete') {
	return async (dispatch) => {
		try{
			const params = {
				menuId: menuId,
				parentKey: parentKey,
				childKey: childKey,
				act: act
			}
			const response = await load({
				url: '/wechat/wechat-personal-menu/create-menu',
				data: params
			})
			dispatch({
				type: Constants.DELETE_WECHAT_CUSTOMMENUPKG_LIST,
				response,
				menuId
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//改
export function updateMenuPackageList(obj, menuId, parentKey, childKey, act='update') {
	return async (dispatch) => {
		try{
			const params = obj
			const response = await load({
				url: `/wechat/wechat-personal-menu/create-menu?act=${act}&menuId=${menuId}&parentKey=${parentKey}&childKey=${childKey}`,
				data: params,
				method: 'post'
			})

			dispatch({
				type: Constants.UPDATE_WECHAT_CUSTOMMENUPKG_LIST,
				response,
				menuId
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}

//修改菜单包启用状态
export function updateMenuPackageStatus(menuId, parentKey, childKey) {
	return async (dispatch) => {
		try{
			const params = {
				menuId: menuId,
				parentKey: parentKey,
				childKey: childKey
			}
			const response = await load({
				url: '/wechat/wechat-personal-menu/update-enabled-type',
				data: params
			})

			dispatch({
				type: Constants.UPDATE_WECHAT_CUSTOMMENUPKG_STATUS,
				response
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}

//修改菜单包顺序
export function updateMenuPackageSort(menuId, parentKey, childKey, type) {
	return async (dispatch) => {
		try{
			const params = {
				menuId: menuId,
				sortKeyword: `${parentKey}-${childKey}`,
				type: type
			}
			const response = await load({
				url: '/wechat/wechat-personal-menu/change-sort',
				data: params
			})

			dispatch({
				type: Constants.UPDATE_WECHAT_CUSTOMMENUPKG_SORT,
				response
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}

//个性化菜单规则
 export function fetchCustomMenuRuleList({ page = 1, psize = 10, name}) {

	return async (dispatch) => {
		try {
			const params = { 
				page,
				name,
				'per-page': psize 
			}
			const response = (await load({
				url: '/wechat/wechat-menu-rule/index',
				data: params
			}))

			const select = (await load({
				url: '/seletor/wechat/get-wechat-rule-edit-selector'
			}))
			dispatch({
				type: Constants.FETCH_WECHAT_CUSTOMMENURULE_LIST,
				response,
				select,
				params: {
					psize,
					count: response.result.count,
					page: response.result.page
				}
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function fetchCityList(id) {
	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/seletor/get-city-list',
				data: { province: id }
			}))
			dispatch({
				type: Constants.FETCH_CITY_LIST,
				response
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//增
export function addCustomMenuRuleList(obj) {
	return async (dispatch) => {
		try{
			const response = await load({
				url: '/wechat/wechat-menu-rule/operate?act=add',
				data: obj,
				method: 'post'
			})

			dispatch({
				type: Constants.ADD_WECHAT_CUSTOMMENURULE_LIST,
				response
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//删
export function delCustomMenuRuleList(id, act='delete') {
	return async (dispatch) => {
		try{
			const params = {
				id: id,
				act: act
			}
			const response = await load({
				url: '/wechat/wechat-menu-rule/operate',
				data: params
			})

			dispatch({
				type: Constants.DELETE_WECHAT_CUSTOMMENURULE_LIST,
				response,
				id
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//改
export function updateCustomMenuRuleList(obj, id) {
	return async (dispatch) => {
		try{
			const params = obj
			const response = await load({
				url: '/wechat/wechat-menu-rule/operate?act=update&id='+id,
				data: params,
				method: 'post'
			})

			dispatch({
				type: Constants.UPDATE_WECHAT_CUSTOMMENURULE_LIST,
				response
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}

//同步菜单规则
export function syncCustomMenuRule(id) {
	return async (dispatch) => {
		try{
			const params = {id: id}
			const response = await load({
				url: '/wechat/wechat-menu-rule/sync-menu',
				data: params
			})

			dispatch({
				type: Constants.SYNC_WECHAT_CUSTOMMENURULE_LIST,
				response,
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}

//删除同步菜单规则
export function delSyncCustomMenuRule(id, menuid) {
	return async (dispatch) => {
		try{
			const params = {
				id: id,
				menuid: menuid
			}
			const response = await load({
				url: '/wechat/wechat-menu-rule/delete-menu',
				data: params,
			})
			dispatch({
				type: Constants.DELETE_WECHAT_CUSTOMMENURULE_LIST,
				response,
				id
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}



export function updateItemStatus(checked, cb) {
	return async (dispatch) => {
		const params = { checked }
		const response = (await load({
				url: '/webchat/menu/editStatus',
				data: params
			})).content

		cb && cb(1) 

		dispatch({
			type: Constants.UPDATE_MENU_ITEM_STATUS,
			response,
		})
	}	
}

//回复管理
export function fetchReplyList({ page = 1, psize = 10, type, name, mstching_type }) {

	return async (dispatch) => {
		try {
			const params = { 
				page,
				type, 
				name,
				'per-page':psize,
                mstching_type
			}
			const response = (await load({
				url: '/wechat/wechat-reply/index',
				data: params
			}))

			const select = (await load({
				url: '/seletor/wechat/get-wechat-reply-list-selector',
			}))

			const editSelect = (await load({
				url: '/seletor/wechat/get-wechat-reply-edit-selector'
			}))

			dispatch({
				type: Constants.FETCH_WECHAT_REPLY_LIST,
				response,
				select,
				editSelect,
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
//查
export function fetchReplyById({id, act='check'}) {
	return async (dispatch) => {
		try {
			const params = {
				id,
				act
			}
			const response = (await load({
				url: '/wechat/wechat-reply/operate',
				data: params
			}))
			dispatch({
				type: Constants.FETCH_WECHAT_REPLY_BYID,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//增
export function addReplyList(params) {

	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/wechat/wechat-reply/operate?act=add',
				data: params,
				method: 'post'
			}))
			dispatch({
				type: Constants.ADD_WECHAT_REPLY_LIST,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//删
export function delReplyList(id, act='delete') {

	return async (dispatch) => {
		try {
			const params ={
				id: id,
				act: act
			}
			const response = (await load({
				url: '/wechat/wechat-reply/operate',
				data: params
			}))
			dispatch({
				type: Constants.DELETE_WECHAT_REPLY_LIST,
				response,
				id: id
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//改
export function updateReplyList(params, id) {

	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/wechat/wechat-reply/operate?act=update&id='+id,
				data: params,
				method: 'post'
			}))
			dispatch({
				type: Constants.UPDATE_WECHAT_REPLY_LIST,
				response,
				id: id
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//微信分组
//列表
export function fetchGroupList({ page = 1, psize = 10, name, type }) {

	return async (dispatch) => {
		try {
			const params = { 
				page, 
				'per-page': psize,
				name,
				type 
			}
			const response = (await load({
				url: '/wechat/wechat-group/index',
				data: params
			}))

			const select = (await load({
				url: '/seletor/wechat/get-wechat-group-selector'
			}))
			dispatch({
				type: Constants.FETCH_WECHAT_GROUP_LIST,
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
//修改用户分组信息
export function updateWechatGroup(userid, wechatUserMove) {

	return async (dispatch) => {
		try {
			
			const response = (await load({
				url: `/wechat/wechat-user/move-user?id=${userid}`,
				method: 'post',
				data: {wechatUserMove: wechatUserMove}
			}))
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//修改用户虚拟分组信息
export function updateVirtualGroup(userid, wechatUserMove) {

	return async (dispatch) => {
		try {
			
			const response = (await load({
				url: `/wechat/wechat-user/move-user-virtual?id=${userid}`,
				method: 'post',
				data: {wechatUserMove: wechatUserMove}
			}))
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//拉取微信分组
export function getWechatGroup() {

	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/wechat/wechat-group/get-wechat-group',
			}))
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//批量取消标签
export function cancelWechatUser({ids, openids, gid}) {
	return async (dispatch) => {
		try {
			var params = {
				ids,
				openids,
				groupid: gid
			}
			const response = (await load({
				url: '/wechat/wechat-user/remove-many-users',
				data: params,
				method: 'post'
			}))
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//增
export function addGroupList(params) {

	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/wechat/wechat-group/operate?act=add',
				data: params,
				method: 'post'
			}))

			dispatch({
				type: Constants.ADD_WECHAT_GROUP_LIST,
				response
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//改
export function updateGroupList(params, id) {

	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/wechat/wechat-group/operate?act=update&id='+id,
				data: params,
				method: 'post'
			}))

			dispatch({
				type: Constants.UPDATE_WECHAT_GROUP_LIST,
				response,
				id
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//删
export function delGroupList(id, act='delete') {

	return async (dispatch) => {
		try {
			const params ={
				id: id,
				act: act
			}
			const response = (await load({
				url: '/wechat/wechat-group/operate',
				data: params
			}))

			dispatch({
				type: Constants.DELETE_WECHAT_GROUP_LIST,
				response,
				id: id
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//查看用户分组列表
export function fetchUserGroupList({ page = 1, psize = 10, group_id, gid }) {

	return async (dispatch) => {
		try {
			const params = { 
				page, 
				group_id,
				gid,
				'per-page': psize 
			}
			const response = (await load({
				url: '/wechat/wechat-user/wechat-group-user',
				data: params
			}))

			const select = (await load({
				url: '/seletor/wechat/get-wechat-group-edit-selector'
			}))

			dispatch({
				type: Constants.FETCH_WECHAT_USERGROUP_LIST,
				response,
				select,
				gid,
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

//微信用户
//列表
export function fetchUserList({ page = 1, psize = 10, nickname = '', groupid = '', virtual_groupid = '' }) {

	return async (dispatch) => {
		try {
			const params = { 
				page, 
				nickname,
				groupid,
				virtual_groupid,
			   'per-page': psize 
			}
			const response = (await load({
				url: '/wechat/wechat-user/index',
				data: params
			}))

			const select = (await load({
				url: '/seletor/wechat/get-wechat-user-list-selector',
				data: params
			}))

			dispatch({
				type: Constants.FETCH_WECHAT_USER_LIST,
				response,
				select,
				params:{
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


//批量拉取微信用户
export function pullWechatUser({ ids, openids, gid }) {
	return async (dispatch) => {
		try {
			const params = { 
				ids,
				openids,
				groupid: gid
			}
			const response = (await load({
				url: '/wechat/wechat-user/move-many-users',
				data: params,
				method: 'post'
			}))
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//查看单个用户
export function fetchSingerUser({id, act = 'check'}) {

	return async (dispatch) => {
		try {
			const params = { 
				id: id, 
				act: act
			}
			const response = (await load({
				url: '/wechat/wechat-user/operate',
				data: params
			}))

			const option = (await load({
				url: '/seletor/wechat/get-wechat-user-edit-selector'
			}))
			dispatch({
				type: Constants.FETCH_WECHAT_SINGER_USER,
				id,
				response,
				option
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//渠道
export function fetchChannelList({ page = 1, psize = 10, name = '' }) {

	return async (dispatch) => {
		try {
			const params = { page, psize }
			const response = (await load({
				url: '/wechat/wechat-channel/index',
				data: { 
					name,
					page, 
					'per-page': psize
				}
			})).result
			dispatch({
				type: Constants.FETCH_WECHAT_CHANNEL_LIST,
				response,
				psize,
				name
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 编辑渠道
export function editChannel({ remark, name, act = 'add', id = 0 }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-channel/operate?act=${act}&id=${id}`,
				data: { 
					name,
					remark
				},
				method: 'post'
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.SAVE_WECHAT_CHANNEL,
						response: response.result
					})
					break
				case 'update':
					dispatch({
						type: Constants.UPDATE_WECHAT_CHANNEL,
						response: {
							id,
							...response.result
						}
					})
					break
				case 'delete':
					dispatch({
						type: Constants.DELETE_WECHAT_CHANNEL,
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


//微信场景
export function fetchSceneList({ page = 1, psize = 10, name = '' }) {

	return async (dispatch) => {
		try {
			const params = { page, psize }
			const response = (await load({
				url: '/wechat/wechat-scene/index',
				data: { 
					name,
					page, 
					'per-page': psize
				}
			})).result
			dispatch({
				type: Constants.FETCH_WECHAT_SCENE_LIST,
				response,
				psize,
				name
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 编辑微信场景
export function editScene({ remark, name, act = 'add', id = 0 }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-scene/operate?act=${act}&id=${id}`,
				data: { 
					name,
					remark
				},
				method: 'post'
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.SAVE_WECHAT_SCENE,
						response: response.result
					})
					break
				case 'update':
					dispatch({
						type: Constants.UPDATE_WECHAT_SCENE,
						response: {
							id,
							...response.result
						}
					})
					break
				case 'delete':
					dispatch({
						type: Constants.DELETE_WECHAT_SCENE,
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


//微信位置
export function fetchPositionList({ page = 1, psize = 10, name = '' }) {

	return async (dispatch) => {
		try {
			const params = { page, psize }
			const response = (await load({
				url: '/wechat/wechat-position/index',
				data: { 
					name,
					page, 
					'per-page': psize
				}
			})).result
			dispatch({
				type: Constants.FETCH_WECHAT_POSITION_LIST,
				response,
				psize,
				name
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 编辑微信位置
export function editPosition({ remark, name, act = 'add', id = 0 }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-position/operate?act=${act}&id=${id}`,
				data: { 
					name,
					remark
				},
				method: 'post'
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.SAVE_WECHAT_POSITION,
						response: response.result
					})
					break
				case 'update':
					dispatch({
						type: Constants.UPDATE_WECHAT_POSITION,
						response: {
							id,
							...response.result
						}
					})
					break
				case 'delete':
					dispatch({
						type: Constants.DELETE_WECHAT_POSITION,
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

// 获取微信二维码下拉数据
export function fetchQRCodeSelect() {
	return async (dispatch) => {
		try {
			const selectData = (await load({
				url: '/seletor/wechat/get-wechat-qrcode-edit-selector'
			})).result

			dispatch({
				type: Constants.FETCH_WECHAT_QRCODE_SELECT,
				selectData
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//微信二维码
export function fetchQRCodeList({ page = 1, psize = 10, name = '' }) {

	return async (dispatch) => {
		try {
			const params = { page, psize }
			const response = (await load({
				url: '/wechat/wechat-qrcode/index',
				data: { 
					name,
					page, 
					'per-page': psize
				}
			})).result
			dispatch({
				type: Constants.FETCH_WECHAT_QRCODE_LIST,
				response,
				psize,
				name
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 编辑微信二维码
export function editQRCode({ action_name, channel, expire_seconds, name, position, scene, virtual_groupid, wechat_groupid, act = 'add', id = 0 }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-qrcode/operate?act=${act}&id=${id}`,
				data: { 
					action_name, channel, expire_seconds, name, position, scene, virtual_groupid, wechat_groupid
				},
				method: 'post'
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.SAVE_WECHAT_QRCODE,
						response: response.result
					})
					break
				case 'update':
					dispatch({
						type: Constants.UPDATE_WECHAT_QRCODE,
						response: {
							id,
							...response.result
						}
					})
					break
				case 'delete':
					dispatch({
						type: Constants.DELETE_WECHAT_QRCODE,
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

//多媒体素材
export function fetchMediaList({ page = 1, psize = 10, name, type, media_type }) {

	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-media-material/index',
				data: {
					type,
					media_type,
					page,
					name,
					'per-page': psize
				}
			})

			dispatch({
				type: Constants.FETCH_WECHAT_MEDIA_LIST,
				response,
				params: {
					type,
					media_type,
					page: response.result.page,
					count: response.result.count,
					name,
					psize
				}
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
// 多媒体素材列表－下拉数据
export function fetchMediaListSelect() {
	return async (dispatch, getState) => {
		try {
			if (getState().wechatMedia.get('selectDataLoad')) {
				return
			}
			const response = (await load({
				url: '/seletor/wechat/get-wechat-media-material-list-selector'
			})).result

			dispatch({
				type: Constants.FETCH_WECHAT_MEDIA_SELECT,
				response
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 多媒体素材列表－删除
export function removeMedia(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-media-material/operate',
				data: {
					id,
					act: 'delete'
				}
			})

			dispatch({
				type: Constants.DELETE_WECHAT_MEDIA,
				id
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
// 根据ID查询多媒体素材详情
export function fetchWechatMediaById({ id }) {
	return async (dispatch) => {
		try {
			let response = {}
			if (id) {
				response = (await load({
					url: '/wechat/wechat-media-material/operate',
					data: {
						id,
						act: 'check'
					}
				})).result
			}

			dispatch({
				type: Constants.FETCH_WECHAT_MEDIA_BYID,
				response
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 新增／修改多媒体素材
export function saveWechatMedia({ postData, act = 'add', id = 0 }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-media-material/operate?act=${act}&id=${id}`,
				data: postData,
				method: 'post'
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.SAVE_WECHAT_MEDIA,
						response: response.result
					})
					break
				case 'update':
					dispatch({
						type: Constants.UPDATE_WECHAT_MEDIA,
						id,
						name: postData.name
					})
					break
			}

			
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}


//图文素材
export function fetchPictureList({ name = '', media_type = '', page = 1, psize = 10 }) {

	return async (dispatch) => {
		try {
			const params = { page, psize }
			const response = (await load({
				url: '/wechat/wechat-txt-material/index',
				data: {
					name,
					media_type,
					page,
					'per-page': psize
				}
			})).result

			dispatch({
				type: Constants.FETCH_WECHAT_PICTURE_LIST,
				response,
				params: {
					count: response.count,
					page: response.page,
					psize
				}
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
// 保存／添加图文素材
export function saveMaterial({ postData, act = 'add', id = 0 }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-txt-material/operate?act=${act}&id=${id}`,
				data: postData,
				method: 'post'
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.SAVE_WECHAT_PICTURE,
						response
					})
					break
				case 'update':
					break
			}
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 删除图文素材
export function removePictureMaterial(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-txt-material/operate',
				data: {
					id,
					act: 'delete'
				}
			})

			dispatch({
				type: Constants.DELETE_WECHAT_PICTURE_MATERIAL,
				id
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
// 根据ID查询图文详情
export function fetchPictureMaterialById({ id = 0 }) {
	return async (dispatch) => {
		try {
			let response = {}
			if (id) {
				response = (await load({
					url: '/wechat/wechat-txt-material/operate',
					data: {
						id,
						act: 'check'
					}
				})).result
			}

			dispatch({
				type: Constants.FETCH_WECHAT_PICTURE_BYID,
				response
			})

		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//获取图文内容信息
export function getPictureMessage(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-txt-material/check-my-txt-info',
				data: {
					media_id: id
				}
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
// 同步图文素材
export function synchPicture(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-txt-material/synch',
				data: {
					id
				}
			})
			dispatch({
				type: Constants.UPDATE_WECHAT_MEDIA_ID,
				id,
				mediaId: response.result
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
// 获取图文素材总数
export function getPictureCount(type) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-media-material/get-material-count',
				data: {
					type
				}
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//微信群发
export function fetchSendGroupList({ name, msgtype, type, send_status, page = 1, psize = 10 }) {

	return async (dispatch) => {
		try {
			const params = {name, msgtype, type, send_status, page, 'per-page': psize}
			const response = (await load({
				url: `/wechat/wechat-mass/index`,
				data: params,
			})).result

			dispatch({
				type: Constants.FETCH_WECHAT_SENDGROUP_LIST,
				response,
				params: {
					name, msgtype, type, send_status, page, psize
				}
			})


		} catch (err) {
			return Promise.reject(err) 
		}
	}
} 

//微信群发 - 获取首页下拉数据
export function fetchSendGroupListSelect() {

	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/seletor/wechat/get-wechat-mass-list-selector'
			})).result

			dispatch({
				type: Constants.FETCH_WECHAT_SENDGROUP_LIST_SELECT,
				contentSelect: response
			})


		} catch (err) {
			return Promise.reject(err)
		}
	}
} 

//微信群发 - 获取弹窗下拉数据
export function fetchSendGroupModalSelect() {

	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/seletor/wechat/get-wechat-mass-edit-selector'
			})).result
			dispatch({
				type: Constants.FETCH_WECHAT_SENDGROUP_MODAL_SELECT,
				modalSelect: response
			})


		} catch (err) {
			return Promise.reject(err)
		}
	}
} 

//微信群发 - 添加／修改群发
export function saveSendGroupData(postData, act = 'add', id = 0) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-mass/operate?act=${act}&id=${id}`,
				data: postData,
				method: 'post'
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.SAVE_WECHAT_SENDGROUP_DATA,
						response: response.result
					})
					break;
				case 'update':
					dispatch({
						type: Constants.UPDATE_WECHAT_SENDGROUP_DATA,
						response: response.result,
						id
					})
					break;
			}

			

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
// 删除群发
export function removeSendGroup(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-mass/operate?act=delete&id=${id}`
			})

			dispatch({
				type: Constants.DELETE_WECHAT_SENDGROUP_DATA,
				id
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 修改群发列表的审核状态
export function updateAudit(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-mass/update-audit-type',
				data: {
					id
				}
			})
			dispatch({
				type: Constants.UPDATE_WECHAT_SENDGROUP_AUDIT,
				id,
				auditType: response.result.res
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 微信群发 － 预览
export function sendPreview(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-mass/preview-mass',
				data: {
					id
				}
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}


// 微信群发 － 发送
export function sendGroupMsg(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-mass/send-message',
				data: {
					id
				}
			})

			if (response.errorcode == 0) {
				dispatch({
					type: Constants.UPDATE_WECHAT_MASS_STATUS,
					id
				})
			}  

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 微信群发 － 查看微信返回信息
export function fetchReturnMsg(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-mass/check-wechat-return-info',
				data: {
					msg_id: id
				}
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

/**
 * 微信统计
 */

//微信统计（用户分析）
export function fetchUserAnalysisList({ page = 1, psize = 10, start_time, end_time, type }) {

	return async (dispatch) => {
		try {
			const params = { 
				page, 
				'per-page': psize,
				start_time,
				end_time,
				type
			}
			const response = (await load({
				url: '/wechat/wechat-stats-user-analysis/index',
				data: params
			}))
			dispatch({
				type: Constants.FETCH_WECHAT_STATISTICAL_USER_LIST,
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

//用户分析导出数据
export function fetchUserAnalysisExport({obj}) {

	return async (dispatch) => {
		try {
			const params = obj
			const response = (await load({
				url: '/wechat/wechat-stats-user-analysis/export',
				data: params
			}))
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//微信统计（图文分析）
export function fetchPictureAnalysisList({ page = 1, psize = 10, start_time, end_time, type }) {

	return async (dispatch) => {
		try {
			const params = { 
				page, 
				'per-page': psize,
				start_time,
				end_time,
				type
			}
			const response = (await load({
				url: '/wechat/wechat-stats-txt-analysis/index',
				data: params
			}))
			dispatch({
				type: Constants.FETCH_WECHAT_STATISTICAL_PICTURE_LIST,
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

//查看图文明细
export function fetchPictureAnalysisDetail({ page = 1, psize = 10, the_time, start_time, end_time }) {

	return async (dispatch) => {
		try {
			const params = { 
				page, 
				'per-page': psize,
				start_time,
				end_time,
				the_time,
			}
			const response = (await load({
				url: '/wechat/wechat-stats-txt-analysis-detail/index',
				data: params
			}))
			dispatch({
				type: Constants.FETCH_WECHAT_STATISTICAL_PICTURE_DETAIL,
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

//微信统计（消息分析）
export function fetchMessageAnalysisList({ page = 1, psize = 10, start_time, end_time, type }) {

	return async (dispatch) => {
		try {
			const params = { 
				page, 
				'per-page': psize,
				start_time,
				end_time,
				type
			}
			const response = (await load({
				url: '/wechat/wechat-stats-message-analysis/index',
				data: params
			}))
			dispatch({
				type: Constants.FETCH_WECHAT_STATISTICAL_MESSAGE_LIST,
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

//微信统计（查看用户回复消息详情）
export function fetchMessageAnalysisDetail({ page = 1, psize = 10, start_time, end_time, type }) {

	return async (dispatch) => {
		try {
			const params = { 
				page, 
				'per-page': psize,
				start_time,
				end_time,
				type
			}
			const response = (await load({
				url: '/wechat/wechat-user-message/index',
				data: params
			}))
			const select = (await load({
				url:'/seletor/wechat/get-wechat-user-message-list-selector'
			}))
			dispatch({
				type: Constants.FETCH_WECHAT_STATISTICAL_MESSAGE_DETAIL,
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

//微信统计（接口分析）
export function fetchInterfaceAnalysisList({ page = 1, psize = 10, start_time, end_time, type }) {

	return async (dispatch) => {
		try {
			const params = { 
				page, 
				'per-page': psize,
				start_time,
				end_time,
				type
			}
			const response = (await load({
				url: '/wechat/wechat-stats-interface-analysis/index',
				data: params
			}))

			dispatch({
				type: Constants.FETCH_WECHAT_STATISTICAL_INTERFACE_LIST,
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

//微信客服
 export function fetchCustomerList({ page = 1, psize = 10, name }) {

	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-customer-service-account/index',
				data: {
					page,
					'per-page': psize,
					name
				}
			})

			dispatch({
				type: Constants.FETCH_WECHAT_CUSTOMER_LIST,
				response,
				params: {
					name,
					psize,
					count: response.result.count,
					page: response.result.page
				}
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 添加／修改客服
export function addCustomer({ postData, act = 'add', id = 0 }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-customer-service-account/operate?act=${act}&id=${id}`,
				data: postData,
				method: 'post'
			})
			switch(act) {
				case 'add':
					dispatch({
						type: Constants.ADD_WECHAT_CUSTOMER,
						response: response.result
					})
					break
				case 'update':
					dispatch({
						type: Constants.UPDATE_WECHAT_CUSTOMER,
						response: response.result,
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
//删除客服
export function removeCustomer(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-customer-service-account/operate',
				data: {
					id,
					act: 'delete'
				}
			})

			dispatch({
				type: Constants.DELETE_WECHAT_CUSTOMER,
				id
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function synchCustomer() {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-customer-service-account/synch-kf-info'
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//客服列表
export function fetchCustomerManagementList() {
	return async (dispatch) => {
		try {
			var response = await load({
				url: '/wechat/wechat-customer-service-panel/index',
			})
			var wait = !response.result.list.length? {count: 0, list: []}: response.result.wait
			dispatch({
				type: Constants.FETCH_WECHAT_CUSTOMERMANAGEMENT_LIST,
				response,
				wait,
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//客服转接
export function customerManagementSwitch({account, openid, text}) {
	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/wechat/wechat-customer-service-panel/switch-user',
				data: {
					account,
					openid,
					text
				},
				method: 'post'
			}))
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//客服统计
 export function fetchCustomerStatisticalList({ page = 1, psize = 10, name, start_time, end_time }) {

	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/wechat/wechat-customer-service-message-stats/index',
				data: {
					page,
					'per-page': psize,
					name,
					start_time,
					end_time
				}
			}))

			dispatch({
				type: Constants.FETCH_WECHAT_CUSTOMERSTATISTICAL_LIST,
				response,
				params: {
					count: response.result.count,
					page,
					psize,
					name,
					start_time,
					end_time
				}
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//客服发送信息
 export function fetchCustomerSendMessageList({ page = 1, psize = 10, name, msgtype, usertype }) {

	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-customer-service-send-message/index',
				data: {
					page,
					'per-page': psize,
					name,
					msgtype,
					usertype
				}
			})

			dispatch({
				type: Constants.FETCH_WECHAT_CUSTOMERSENDMESSAGE_LIST,
				response,
				params: {
					page: response.result.page,
					count: response.result.count,
					psize,
					name,
					msgtype,
					usertype
				}
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//客服发送信息- 获取列表页的下拉数据
export function fetchCustomerMsgSelect() {

	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/seletor/wechat/get-wechat-customer-service-send-message-edit-selector'
			})).result

			dispatch({
				type: Constants.FETCH_WECHAT_CUSTOMER_MSG_SELECT,
				response
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function fetchCustomerMsgById(id) {
	return async (dispatch) => {
		try {
			let response = {}
			if (id) {
				response = (await load({
					url: '/wechat/wechat-customer-service-send-message/operate',
					data: { id, act: 'check' }
				})).result
			}

			dispatch({
				type: Constants.FETCH_WECHAT_CUSTOMER_BYID,
				response
			})

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//客服发送信息- 发送按钮
export function sendCustomerMsg(id) {

	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-customer-service-send-message/send-message',
				data: {
					id
				}
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//客服发送信息- 删除
export function deleteCustomerMsg(id) {

	return async (dispatch) => {
		try {
			const response = await load({
				url: '/wechat/wechat-customer-service-send-message/operate',
				data: {
					id,
					act: 'delete'
				}
			})

			dispatch({
				type: Constants.DELETE_WECHAT_CUSTOMER_MSG,
				id
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}


export function saveCustomerMsgData({ postData, act = 'add', id = 0 }) {
	return	async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-customer-service-send-message/operate?act=${act}&id=${id}`,
				data: postData,
				method: 'post'
			})
			switch(act) {
				case 'add':
					dispatch({
						type: Constants.SAVE_WECHAT_CUSTOMER_MSG,
						response: response.result
					})
					break
				case 'update':
					
					break
			}

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//错误日志
export function fetchErrorLogList({page = 1, psize = 10, start_time, end_time}) {
	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/wechat/wechat-runtime-log/index',
				data: {
					page,
					'per-page': psize,
					start_time,
					end_time
				}
			}))
			
			dispatch({
				type: Constants.FETCH_WECHAT_ERRORLOG_LIST,
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

// 查询群发预览人
export function searchPreview({ value }) {
    return async dispatch => {
        try {
            const response = await load({
                url: `/seletor/wechat/get-wechat-user?name=${value}`
            })
            dispatch({
                type: Constants.FETCH_SENDGROUP_PREVIEW,
                allUser: response.result.allUser
            })
            return Promise.resolve(response)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export const removeSearchPreview = () => dispatch => {
    dispatch({
        type: Constants.DELETE_SENDGROUP_PREVIEW
    })
}

