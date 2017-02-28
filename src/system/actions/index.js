import load from 'Application/utils/fetchApi'
import * as Constants from '../constants'

//企业管理
//列表
export function fetchManagementList({ page = 1, psize = 10, name = '', contact = '' }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 name,
				 contact
			}
			const response = await load({
				url: '/system/company/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/system/get-company-selector',
			})

			dispatch({
				type: Constants.FETCH_SYSTEM_MANAGEMENT_LIST,
				response,
				option,
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
//查
export function checkManagementDetail({id, act='check'}) {
	return async (dispatch) => {
		try{
			const params = {
				id,
				act
			}
			const response = await load({
				url: '/system/company/operate',
				data: params,
			})
			dispatch({
				type: Constants.CHECK_SYSTEM_MANAGEMENT_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		}catch(err) {
			return Promise.reject(err)
		}
	}
}
//增
export function addManagementList(obj) {
	return async (dispatch) => {
		try{
			const response = await load({
				url: '/system/company/operate?act=add',
				data: obj,
				method: 'post'
			})

			dispatch({
				type: Constants.ADD_SYSTEM_MANAGEMENT_LIST,
				response
			})

			return Promise.resolve(response)

		}catch(err) {
			return Promise.reject(err)
		}
	}
}
//删
export function delManagementList(id, act='delete') {
	return async (dispatch) => {
		try{
			const params ={
				id: id,
				act: act
			}
			const response = await load({
				url: '/system/company/operate',
				data: params,
			})

			dispatch({
				type: Constants.DELETE_SYSTEM_MANAGEMENT_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		}catch(err) {
			return Promise.reject(err)
		}
	}
}
//改
export function updateManagementList(obj, id) {
	return async (dispatch) => {
		try{
			const response = await load({
				url: '/system/company/operate?act=update&id='+id,
				data: obj,
				method: 'post'
			})

			dispatch({
				type: Constants.UPDATE_SYSTEM_MANAGEMENT_LIST,
				response
			})
			return Promise.resolve(response)

		}catch(err) {
			return Promise.reject(err)
		}
	}
}
//管理员

//查询
export function fetchAdminList({page = 1, psize = 10, name, organization, parentid}) {

	return async (dispatch) => {
		try {
			const params = { 
				 page, 
				'per-page': psize,
				name,
				organization,
				parentid
			}
			const response = await load({
				url: '/system/admin/index',
				data: params
			})

			const select = await load({
				url: '/seletor/system/get-auth-package-list-by-cpid',
			})

			const option = await load({
				url: '/seletor/system/get-all-list-for-check'
			})

			dispatch({
				type: Constants.FETCH_SYSTEM_ADMIN_LIST,
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

//添加
export function addAdminItem(data) {
	return async (dispatch) => {
		try{
			const response = await load({
				url: '/system/admin/operate?act=add',
				data: data,
				method: 'post'
			})

			dispatch({
				type: Constants.ADD_SYSTEM_ADMIN_ITEM,
				response
			})

			return Promise.resolve(response)

		}catch(err) {
			return Promise.reject(err)
		}
	}
}

//删除
export function fetchDelAdminItem(id, act = 'delete') {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/system/admin/operate',
				data: {
					id: id,
					act: act
				}
			})

			dispatch({
				type: Constants.DELETE_SYSTEM_ADMIN_ITEM,
				response,
				id
			})
            console.log(response)
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//编辑
export function editAdminItem(data, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/system/admin/operate?act=update&id=' + id,
				data: data,
				method: 'post'
			})

			dispatch({
				type: Constants.UPDATE_SYSTEM_ADMIN_ITEM,
				response,
				id
			})

			return Promise.resolve(response)


		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//获取微信权限分组信息
export function fetchGroupRoleList({id, act = 'check'}) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/system/admin/check-auth',
				data: {
					id
				}
			})
			dispatch({
				type: Constants.FETCH_ADMIN_GROUP_LIST,
				response,
				id
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//修改微信权限分组信息
export function updateGroupRoleList(wechat_account_auth, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/system/admin/update-auth?id=${id}`,
				data: {
					wechat_account_auth: wechat_account_auth
				},
				method: 'post'
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}


//菜单管理 - 初始化专用action
export function initMenuListPage(menuId) {

	return async (dispatch) => {
		try {
			const menuList = (await load({
				url: '/seletor/system/menu-list'
			})).result

			let id = menuId || menuList[0].id

			let menuDetails = (await load({
				url: '/system/system-menu/index',
				data: {
					id
				}
			})).result.list[0]
			
			// 防止路由参数中的ID值不存在
			if (!menuDetails) {
				id = menuList[0].id
				menuDetails = (await load({
					url: '/system/system-menu/index',
					data: {
						id
					}
				})).result.list[0]
			}
			dispatch({
				type: Constants.FETCH_MENU_LIST_PAGE,
				menuList,
				menuDetails,
				currentKey: id
			})

			//return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//菜单管理 － 获取菜单列表
export function fetchMenuList(id) {
	return async (dispatch) => {
		try {
			const menuDetails = (await load({
				url: '/system/system-menu/index',
				data: {
					id
				}
			})).result.list[0]
			dispatch({
				type: Constants.FETCH_SYSTEM_MENU_LIST,
				menuDetails
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 修改/添加/删除（按钮）
export function editMenu(data, act = 'add', id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/system/system-menu/operate?act=${act}${id ? '&id=' + id : ''}`,
				data,
				method: 'post'
			})

			// 添加的是1级主菜单
			if (act === 'add' && !data.parent_id) {
				dispatch({
					type: Constants.UPDATE_SYSTEM_MENU_LIST,
					data,
					response
				})
			}

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 查询菜单类型
export function fetchMenuType() {
	return async (dispatch, getState) => {
		try {
			const response = await load({
				url: '/seletor/system/get-menu-selector'
			})
			dispatch({
				type: Constants.FETCH_SYSTEM_MENU_TYPE,
				response
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 保存菜单
// export function editMenu(data) {
// 	return async (dispatch) => {
// 		try {
// 			const response = await load({
// 				url: '/system/system-menu/operate?act=add',
// 				data: {
// 					...data
// 				},
// 				method: 'post'
// 			})
// 			dispatch({
// 				type: Constants.CREATE_SYSTEM_MENU,
// 				response
// 			})
// 			return Promise.resolve()
// 		} catch (err) {
// 			return Promise.reject(err)
// 		}
// 	}
// }

//角色管理
export function fetchRoleList({ page = 1, psize = 10, name = '' }) {

	return async (dispatch) => {
		try {
			const params = { 
				page, 
				name,
				'per-page': psize
			}
			const response = (await load({
				url: '/system/system-role/index',
				data: params
			})).result

			dispatch({
				type: Constants.FETCH_SYSTEM_ROLE_LIST,
				response,
				// url相关参数
				params: {
					name,
					psize,
					count: response.count,
					page: response.page,
				}
			})

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 获取角色管理编辑弹窗的相关数据
export function fetchCompAndAuthList() {
	return async (dispatch) => {
		try {
			
			const response = (await load({
				url: '/seletor/system/get-role-selector',
			})).result

			dispatch({
				type: Constants.FETCH_SYSTEM_ROLE_MODAL_DATA,
				response
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 保存／删除／修改角色信息
export function editRole(data, act = 'add', id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/system/system-role/operate?act=${act}&id=${id}`,
				data,
				method: 'post'
			})

			switch (act) {
				case 'delete':
					dispatch({
						type: Constants.DELETE_SYSTEM_ROLE,
						id
					})
					break
				case 'add':
					dispatch({
						type: Constants.ADD_SYSTEM_ROLE,
						response: response.result
					})
					break
			}

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//获取权限包首页列表
export function fetchAuthList({ page = 1, psize = 10, name = '' }) {

	return async (dispatch) => {
		try {
			const params = { 
				page, 
				name,
				'per-page': psize
			}
			const response = await load({
				url: '/system/system-auth-package/index',
				data: params
			})

			dispatch({
				type: Constants.FETCH_SYSTEM_AUTH_LIST,
				response,
				params: {
					page,
					psize,
					count: response.result.count
				}
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 删除权限包
export function removeAuthPackage(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/system/system-auth-package/operate?act=delete&id=${id}`
			})

			dispatch({
				type: Constants.DELETE_SYSTEM_AUTH_PACKAGE,
				id
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 添加/修改 权限包
export function editAuthPackage(data, act = 'add', id) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: `/system/system-auth-package/operate?act=${act}&id=${id}`,
				data,
				method: 'post'
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.ADD_SYSTEM_AUTH_PACKAGE,
						response: response.result
					})
					break

				case 'update':
					dispatch({
						type: Constants.UPDATE_SYSTEM_AUTH_PACKAGE,
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

// 获取权限包编辑页数据(权限和权限包数据)
export function fetchAuthEditData({ id }) {
	return async (dispatch) => {
		try {
			// 先保存ID，防止和路由组件的componentWillMount冲突
			dispatch({
				type: Constants.FETCH_SYSTEM_AUTH_EDIT_DATA,
				editId: id
			})
			const response = (await load({
				url: '/seletor/system/get-auth-package-selector',
				data: {
					id
				}
			})).result

			let authDetails = {}
			if (id) {
				// 查询详情信息
				authDetails = (await load({
					url: '/system/system-auth-package/operate',
					data: {
						act: 'check',
						id
					}
				})).result
			}

			dispatch({
				type: Constants.FETCH_SYSTEM_AUTH_EDIT_DATA,
				...response,
				authDetails,
				editId: id
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 获取权限包编辑页数据（详情）
export function fetchAuthPackageById({ id }) {
	return async (dispatch) => {
		try {
			

			dispatch({
				type: Constants.FETCH_SYSTEM_AUTH_PACKAGE_BYID,
				...response,
				editId: id
			})
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//获取系统配置数据
export function fetchSystemData() {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/system/system/system-config',
			})
			
			dispatch({
				type: Constants.FETCH_SYSTEM_SETTING_DATA,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//保存系统配置数据
export function updateSystemData(data) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/system/system/system-config?act=update',
				data: data,
				method: 'post'
			})
			dispatch({
				type: Constants.UPDATE_SYSTEM_SETTING_DATA,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//帮助
//帮助列表
export function fetchHelpList({page = 1, psize = 10, name = ''}) {
	return async (dispatch) => {
		try {
			const params = { 
				 page,
				 name,
				'per-page': psize
			}

			const response = await load({
				url: '/system/system-help-document/index',
				data: params
			})

			dispatch({
				type: Constants.FETCH_SYSTEM_HELP_LIST,
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

//添加帮助
export function addHelpNode({name, remark, type, parent_id, parent_name}) {
	return async (dispatch) => {
		try {
			const params = {name, remark, type, parent_id, parent_name}
			const response = await load({
				url: '/system/system-help-document/operate?act=add',
				data: params,
				method: 'post'
			})

			dispatch({
				type: Constants.ADD_SYSTEM_HELP_NODE,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//删除帮助
export function delHelpNode(id, act = 'delete') {
	return async (dispatch) => {
		try {
			const params = { id: id, act: act}
			const response = await load({
				url: '/system/system-help-document/operate',
				data: params,
			})

			dispatch({
				type: Constants.DEL_SYSTEM_HELP_NODE,
				response,
				id
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//修改帮助
export function updateHelpNode(id, data) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/system/system-help-document/operate?act=update&id='+id,
				data: data,
				method: 'post'
			})

			dispatch({
				type: Constants.UPDATE_SYSTEM_HELP_NODE,
				response,
				id
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}


// 查询部门列表
export function fetchDepartmentList({ name = '', page = 1, psize = 10 }) {
	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/system/department/index',
				data: {
					name,
					page,
					'per-page': psize
				}
			})).result
			dispatch({
				type: Constants.FETCH_SYSTEM_DEPARTMENT_LIST,
				response,
				params: {
					name,
					page,
					psize,
					count: response.count
				}
			})

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//查看部门微信分组权限
export function fetchDepartmentGroupRoleList({id, dpid, act = 'check'}) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/seletor/system/get-admin-group-selector',
				data: {
					id,
					dpid
				}
			})
			dispatch({
				type: Constants.FETCH_DEPARTMENT_GROUP_LIST,
				response,
				id,
				dpid
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//修改部门微信分组权限
export function updateDepartmentGroupRoleList(Account, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/system/department/wechat-group-auth?id=${id}&act=update`,
				data: {
					Account: Account
				},
				method: 'post'
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 根据ID查询部门
export function fetchDepartmentById({ id = 0 }) {
	return async (dispatch) => {
		try {
			dispatch({
				type: Constants.FETCH_SYSTEM_DEPARTMENT_BYID,
				deptId: id
			})

			let response = {}
			if (id) {
				response = (await load({
					url: '/system/department/operate',
					data: {
						id,
						act: 'check'
					}
				})).result
			}
			
			dispatch({
				type: Constants.FETCH_SYSTEM_DEPARTMENT_BYID,
				response
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function fetchDepartmentSelector() {
	return async (dispatch) => {
		try {
			const response = (await load({
				url: '/seletor/system/get-department-selector'
			})).result
			
			dispatch({
				type: Constants.FETCH_SYSTEM_DEPARTMENT_SELECTOR,
				response
			})

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function editDepartment({ data, act = 'add', id = 0 }) {
	return async (dispatch, getState) => {
		try {
			const response = await load({
				url: `/system/department/operate?act=${act}&id=${id}`,
				data: {
					...data
				},
				method: 'post'
			})

			// TODO reducer还没更新
			
			switch(act) {
				case 'add':
					dispatch({
						type: Constants.SAVE_SYSTEM_DEPARTMENT,
						response: response.result
					})
					break
				case 'update':
					dispatch({
						type: Constants.UPDATE_SYSTEM_DEPARTMENT,
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

export function deleteDepartment(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/system/department/operate?act=delete&id=${id}`
			})

			dispatch({
				type: Constants.DELETE_SYSTEM_DEPARTMENT,
				deptId: id
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//网点管理
//列表
export function fetchNetWorkList({page = 1, psize = 10, name = ''}) {
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
				name
			}
			const response = await load({
				url: '/system/network/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/system/get-network-selector'
			})
			dispatch({
				type: Constants.FETCH_NET_WORK_LIST,
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
export function addNetWorkList(obj) {
	return async (dispatch) => {
		try{
			const response = await load({
				url: '/system/network/operate?act=add',
				data: obj,
				method: 'post'
			})
			dispatch({
				type: Constants.ADD_NET_WORK_LIST,
				response
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}

//删
export function delNetWorkList(id, act = 'delete') {
	return async (dispatch) => {
		try {
			const params = { id: id, act: act}
			const response = await load({
				url: '/system/network/operate',
				data: params,
			})
			dispatch({
				type: Constants.DELETE_NET_WORK_LIST,
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
export function updateNetWorkList(id, data) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/system/network/operate?act=update&id='+id,
				data: data,
				method: 'post'
			})
			dispatch({
				type: Constants.UPDATE_NET_WORK_LIST,
				response,
				id
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//状态码模块
//列表
export function fetchStatusCodeList({page = 1, psize = 10, code = ''}) {
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
				code
			}
			const response = await load({
				url: '/system/wechat-code/index',
				data: params,
			})

			dispatch({
				type: Constants.FETCH_STATUS_CODE_LIST,
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
export function addStatusCodeList(obj) {
	return async (dispatch) => {
		try{
			const response = await load({
				url: '/system/wechat-code/operate?act=add',
				data: obj,
				method: 'post'
			})
			dispatch({
				type: Constants.ADD_STATUS_CODE_LIST,
				response
			})
			return Promise.resolve(response)
		}catch (err) {
			return Promise.reject(err)
		}
		
	}
}
//改
export function updateStatusCodeList(id, data) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/system/wechat-code/operate?act=update&id='+id,
				data: data,
				method: 'post'
			})
			console.log(data)
			dispatch({
				type: Constants.UPDATE_STATUS_CODE_LIST,
				response,
				id
			})
			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//系统操作日志
export function fetchSystemLog({ page = 1, psize = 10, name = '', start_time = '', end_time = '' }) {
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
				name,
				start_time,
				end_time
			}
			const response = await load({
				url: '/system/system-operate-log/index',
				data: params,
			})

			dispatch({
				type: Constants.FETCH_SYSTEM_LOG_LIST,
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

//第三方key
export function fetchSystemKey({ page = 1, psize = 10, type = '', name = ''}) {
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
				name,
				type
			}
			const response = await load({
				url: '/system/third-party-key/index',
				data: params,
			})

			const select = await load({
				url: '/seletor/system/get-portal-company-list-and-third-party-key-type-selector', 
			})

			dispatch({
				type: Constants.FETCH_SYSTEM_KEY_LIST,
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

//根据企业id获取公众号列表
export function fetchAcidByCid(id) {
	return async (dispatch) => {
		try {
			const params = {
				id
			}
			const response = await load({
				url: '/seletor/system/get-account-list-of-portal-company',
				data: params,
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 删除
export function delSystemKey(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/system/third-party-key/operate?act=delete&id=${id}`
			})

			dispatch({
				type: Constants.DELETE_SYSTEM_KEY_LIST,
				id
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

// 添加/修改
export function updateSystemKey(data, act = 'add', id) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: `/system/third-party-key/operate?act=${act}&id=${id}`,
				data,
				method: 'post'
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.ADD_SYSTEM_KEY_LIST,
						response: response
					})
					break

				case 'update':
					dispatch({
						type: Constants.UPDATE_SYSTEM_KEY_LIST,
						response: response,
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

//机构管理
//列表
export function fetchSystemOrganization({ page = 1, psize = 10, enable = '', oid = '', name = '', parentid = ''}) {
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
				name,
				oid,
				parentid,
				enable
			}
			const response = await load({
				url: '/system/system-organization/index',
				data: params,
			})

			const select = await load({
				url: `/seletor/system/get-organization-list-selector`
			})

			dispatch({
				type: Constants.FETCH_SYSTEM_ORGANIZATION_LIST,
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

//机构编码获取机构详情
export function getOrganizationDetail(institu_code) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/system/system-organization/get-info-by-institu-code?institu_code=${institu_code}`
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}


//添加/修改 机构编码
export function updateSystemOrganization(data, act = 'add', id) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: `/system/system-organization/operate?act=${act}&id=${id}`,
				data,
				method: 'post'
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.ADD_SYSTEM_ORGANIZATION_LIST,
						response: response
					})
					break

				case 'update':
					dispatch({
						type: Constants.UPDATE_SYSTEM_ORGANIZATION_LIST,
						response: response,
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

//删除机构编码
export function delSystemOrganization(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/system/system-organization/operate?act=delete&id=${id}`
			})

			dispatch({
				type: Constants.DELETE_SYSTEM_ORGANIZATION_LIST,
				id
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//系统群组管理
//列表
export function fetchSystemGroup({ page = 1, psize = 10, name = ''}) {
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page': psize,
				name
			}
			const response = await load({
				url: '/system/admin-group/index',
				data: params,
			})

			dispatch({
				type: Constants.FETCH_SYSTEM_GROUP_LIST,
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

//添加 修改
export function updateSystemGroup(data, act = 'add', id) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: `/system/admin-group/operate?act=${act}&id=${id}`,
				data,
				method: 'post'
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.ADD_SYSTEM_GROUP_LIST,
						response: response
					})
					break

				case 'update':
					dispatch({
						type: Constants.UPDATE_SYSTEM_GROUP_LIST,
						response: response,
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
export function delSystemGroup(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/system/admin-group/operate?act=delete&id=${id}`
			})

			dispatch({
				type: Constants.DELETE_SYSTEM_GROUP_LIST,
				id
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
//查看分组
export function checkSystemGroup() {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/seletor/system/get-account-group-by-cpid`
			})
			dispatch({
				type: Constants.CHECK_SYSTEM_GROUP_LIST,
				response
			})

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//查看群组详情
export function getSystemGroup({id, act = 'check'}) {
	return async (dispatch) => {
		try {
			
			const response = await load({
				url: `/system/admin-group/operate?act=${act}&id=${id}`,
				method: 'post'
			})

			dispatch({
				type: Constants.GET_SYSTEM_GROUP_LIST,
				response: response
			})
					
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}



