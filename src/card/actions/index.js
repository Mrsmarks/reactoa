import load from 'Application/utils/fetchApi'
import * as Constants from '../constants'

//微信墙照片管理
//列表
export function fetchSettingList({ page = 1, psize = 10, name }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 name
			}
			const response = await load({
				url: '/card/cards-config/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/card/get-cards-config-edit-selector',
			})

			console.log(response)

			dispatch({
				type: Constants.FETCH_CARD_SETTING_LIST,
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
export function fetchSettingEditSelect() {
	return async (dispatch) => {
		try {
			const option = await load({
				url: '/seletor/card/get-cards-config-edit-selector',
			})

			dispatch({
				type: Constants.FETCH_CARD_SETTING_EDIT_SELECT,
				option
			})

				return Promise.resolve(option)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//查
export function fetchSettingDetail({id, act='check'}) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/card/cards-config/operate',
					data: {
						id,
						act
					}
				})

				dispatch({
					type: Constants.FETCH_CARD_SETTING_DETAIL,
					response
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//增
export function addSettingList(obj) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/card/cards-config/operate?act=add',
					method: 'post',
					data: obj
				})

				dispatch({
					type: Constants.ADD_CARD_SETTING_LIST,
					response
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//删
export function delSettingList(id, act='delete') {
	return async (dispatch) => {

		try {	
			const params = {
				id: id,
				act: act
			}
			const response = await load({
				url: '/card/cards-config/operate',
				data: params
			})

			dispatch({
				type: Constants.DELETE_CARD_SETTING_LIST,
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
export function updateSettingList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/card/cards-config/operate?act=update&id='+id,
				method: 'post',
				data: obj
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_CARD_SETTING_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//贺卡类型
//列表
export function fetchTypeList({ page = 1, psize = 10, name }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 name
			}
			const response = await load({
				url: '/card/cards-type/index',
				data: params,
			})

			console.log(response)

			dispatch({
				type: Constants.FETCH_CARD_TYPE_LIST,
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

//修改置顶权限
export function updateTypeSticky(id) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/card/cards-type/update-stick',
					data: {id: id}
				})

				dispatch({
					type: Constants.UPDATE_CARD_TYPE_STICKY,
					response,
					id
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//获取权限数据
export function getTypeAuth(id) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/seletor/card/get-cards-type-auth-list-selector',
					data: id
				})

				dispatch({
					type: Constants.FETCH_CARD_TYPE_AUTH,
					response,
					id
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//修改权限
export function updateTypeAuth(id, cardsType) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: `/card/cards-type/update-permission?id=${id}&act=update`,
					data: {cardsType: cardsType},
					method: 'post'
				})

				dispatch({
					type: Constants.UPDATE_CARD_TYPE_AUTH,
					response,
					id
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}


//增
export function addTypeList(obj) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/card/cards-type/operate?act=add',
					method: 'post',
					data: obj
				})

				dispatch({
					type: Constants.ADD_CARD_TYPE_LIST,
					response
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//删
export function delTypeList(id, act='delete') {
	return async (dispatch) => {

		try {	
			const params = {
				id: id,
				act: act
			}
			const response = await load({
				url: '/card/cards-type/operate',
				data: params
			})

			dispatch({
				type: Constants.DELETE_CARD_TYPE_LIST,
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
export function updateTypeList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/card/cards-type/operate?act=update&id='+id,
				method: 'post',
				data: obj
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_CARD_TYPE_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//贺卡实例
//列表
export function fetchExampleList({ page = 1, psize = 10, type }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 type
			}
			const response = await load({
				url: '/card/cards-example/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/card/get-cards-example-edit-selector',
			})
			
			dispatch({
				type: Constants.FETCH_CARD_EXAMPLE_LIST,
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

//修改置顶权限
export function updateExampleSticky(id) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/card/cards-example/update-stick',
					data: {id: id}
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//获取权限数据
export function getExampleAuth(id) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/seletor/card/get-cards-example-auth-selector',
					data: id
				})

				dispatch({
					type: Constants.FETCH_CARD_EXAMPLE_AUTH,
					response,
					id
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//修改权限
export function updateExampleAuth(id, cardsExample) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: `/card/cards-example/update-permission?id=${id}&act=update`,
					data: {cardsExample: cardsExample},
					method: 'post'
				})

				dispatch({
					type: Constants.UPDATE_CARD_EXAMPLE_AUTH,
					response,
					id
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//查询编辑页下拉数据
export function fetchExampleEditSelect() {
	return async (dispatch) => {
		try {
			const option = await load({
				url: '/seletor/card/get-cards-example-edit-selector',
			})

			dispatch({
				type: Constants.FETCH_CARD_EXAMPLE_EDIT_SELECT,
				option
			})

				return Promise.resolve(option)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}



//增
export function addExampleList(obj) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/card/cards-example/operate?act=add',
					method: 'post',
					data: obj
				})

				dispatch({
					type: Constants.ADD_CARD_EXAMPLE_LIST,
					response
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//删
export function delExampleList(id, act='delete') {
	return async (dispatch) => {

		try {	
			const params = {
				id: id,
				act: act
			}
			const response = await load({
				url: '/card/cards-example/operate',
				data: params
			})

			dispatch({
				type: Constants.DELETE_CARD_EXAMPLE_LIST,
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
export function updateExampleList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/card/cards-example/operate?act=update&id='+id,
				method: 'post',
				data: obj
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_CARD_EXAMPLE_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//查看详情
export function fetchExampleDetail({id, act='check'}) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/card/cards-example/operate',
					data: {
						id,
						act
					}
				})

				dispatch({
					type: Constants.FETCH_CARD_EXAMPLE_DETAIL,
					response,
					id
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//贺卡祝福语
//列表
export function fetchBlessList({ page = 1, psize = 10, type }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				 type
			}
			const response = await load({
				url: '/card/cards-greeting/index',
				data: params,
			})

			const select = await load({
				url: '/seletor/card/get-cards-greeting-selector',
			})
			console.log(response)

			dispatch({
				type: Constants.FETCH_CARD_BLESS_LIST,
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

//修改置顶权限
export function updateBlessSticky(id) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/card/cards-greeting/update-stick',
					data: {id: id}
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//获取权限数据
export function getBlessAuth(id) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/seletor/card/get-cards-greeting-auth-selector',
					data: id
				})

				dispatch({
					type: Constants.FETCH_CARD_BLESS_AUTH,
					response,
					id
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//修改权限
export function updateBlessAuth(id, cardsGreeting) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: `/card/cards-greeting/update-permission?id=${id}&act=update`,
					data: {cardsGreeting: cardsGreeting},
					method: 'post'
				})

				dispatch({
					type: Constants.UPDATE_CARD_BLESS_AUTH,
					response,
					id
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}


//增
export function addBlessList(obj) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/card/cards-greeting/operate?act=add',
					method: 'post',
					data: obj
				})

				dispatch({
					type: Constants.ADD_CARD_BLESS_LIST,
					response
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//删
export function delBlessList(id, act='delete') {
	return async (dispatch) => {

		try {	
			const params = {
				id: id,
				act: act
			}
			const response = await load({
				url: '/card/cards-greeting/operate',
				data: params
			})

			dispatch({
				type: Constants.DELETE_CARD_BLESS_LIST,
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
export function updateBlessList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/card/cards-greeting/operate?act=update&id='+id,
				method: 'post',
				data: obj
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_CARD_BLESS_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//贺卡模板
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
				url: '/card/cards-template/index',
				data: params,
			})

			const select = await load({
				url: '/seletor/card/get-cards-template-selector',
			})
			console.log(response)

			dispatch({
				type: Constants.FETCH_CARD_TEMPLATE_LIST,
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
					url: '/card/cards-template/operate?act=add',
					method: 'post',
					data: obj
				})

				dispatch({
					type: Constants.ADD_CARD_TEMPLATE_LIST,
					response
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//删
export function delTemplateList(id, act='delete') {
	return async (dispatch) => {

		try {	
			const params = {
				id: id,
				act: act
			}
			const response = await load({
				url: '/card/cards-template/operate',
				data: params
			})

			dispatch({
				type: Constants.DELETE_CARD_TEMPLATE_LIST,
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
				url: '/card/cards-template/operate?act=update&id='+id,
				method: 'post',
				data: obj
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_CARD_TEMPLATE_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//分享列表
export function fetchShareList({ page = 1, psize = 10 }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
			}
			const response = await load({
				url: '/card/cards-share/index',
				data: params,
			})

			console.log(response)

			dispatch({
				type: Constants.FETCH_CARD_SHARE_LIST,
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

//贺卡列表
export function fetchCardList({ page = 1, psize = 10, type }) {

	return async (dispatch) => {
		try {
			const params = { 
				 page,
				'per-page': psize,
				type
			}
			const response = await load({
				url: '/card/cards-generate/index',
				data: params,
			})

			const select = await load({
				url: '/seletor/card/get-cards-generate-selector',
			})

			console.log(response)

			dispatch({
				type: Constants.FETCH_CARD_LIST,
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
export function addCardList(obj) {
	return async (dispatch) => {
		try {
				const response = await load({
					url: '/card/cards-generate/operate?act=add',
					method: 'post',
					data: obj
				})

				dispatch({
					type: Constants.ADD_CARD_LIST,
					response
				})

				return Promise.resolve(response)

			} catch (err) {
				return Promise.reject(err)
			}
	}
}

//删
export function delCardList(id, act='delete') {
	return async (dispatch) => {

		try {	
			const params = {
				id: id,
				act: act
			}
			const response = await load({
				url: '/card/cards-generate/operate',
				data: params
			})

			dispatch({
				type: Constants.DELETE_CARD_LIST,
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
export function updateCardList(obj, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: '/card/cards-generate/operate?act=update&id='+id,
				method: 'post',
				data: obj
			})
			console.log(response)
			dispatch({
				type: Constants.UPDATE_CARD_LIST,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}