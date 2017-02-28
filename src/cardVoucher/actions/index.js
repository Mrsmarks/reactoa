import load from 'Application/utils/fetchApi'
import * as Constants from '../constants'
import axios from 'axios'
/* 
 * 图片库
 *
 */
 //图片库列表
 export function fetchCardVoucherPhotos({ page, psize, available_state }){
	return async (dispatch) => {
		try {
			const params = {
				available_state,
				page,
				'per-page':	psize
			}

			const response = await load({
				url:'/wechat/wechat-photo/index',
				data: params
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_PHOTOS,
				response,
				params:{
					psize,
					count:response.result.count,
					page:response.result.page
				}
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	} 
}

//图片库 查看
export function checkCardVoucherPhotos({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-photo/operate?act=check&id=${id}`
			})

			dispatch({
				type: Constants.CHECK_CARD_VOUCHER_PHOTOS,
				response
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}

//图片库 新增
export function addCardVoucherPhotos(data) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-photo/operate?act=add`,
				data: data,
				method:'post'
			})

			dispatch({
				type: Constants.ADD_CARD_VOUCHER_PHOTOS,
				response
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
} 

//图片库 删除
export function delCardVoucherPhotos(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-photo/operate?act=delete&id=${id}`
			})

			dispatch({
				type: Constants.DEL_CARD_VOUCHER_PHOTOS,
				response,
				id
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}

//图片库 修改
export function updateCardVoucherPhotos(data, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-photo/operate?act=update&id=${id}`,
				method:'post',
				data
			})

			dispatch({
				type: Constants.UPDATE_CARD_VOUCHER_PHOTOS,
				response
			})

			return Promise.resolve(response)
		} catch(err) {
			return Promise.reject(err)
		}
	}
}

/* 
 * 门店系统
 *
 */
 //获取门店列表
 export function fetchStoreLists({ page=1, psize=10, available_state=-1 }) {
 	return async (dispatch) => {
 		try {
 			const params = {
 				available_state,
 				page,
 				"per-page":psize
 			}

 			const response = await load({
 				url:'/wechat/wechat-stores/index',
 				data:params
 			})

 			dispatch({
 				type:Constants.FETCH_STORE_LISTS,
 				response,
 				params:{
 					psize,
 					count:response.result.count,
 					page:response.result.page
 				}
 			})
 			return Promise.resolve(response)
 		} catch (err) {
 			return Promise.reject(err)
 		}
 	}
 }

  //门店列表下拉数据
 export function getStatusSelectList() {
 	return async (dispatch) => {
 		try {
 			const response = await load({
 				url:'/seletor/wechat/get-wechat-stores-list-selector'
 			})

 			dispatch({
 				type: Constants.GET_STATUS_SELECT_LIST,
 				response
 			})

 			return Promise.resolve(response)
 		} catch(err) {
 			return Promise.reject(err)
 		}
 	}
 }

  //新建门店
 export function addStore(data) {
 	return async (dispatch) => {
 		try {
 			const response = await load({
 				url:`/wechat/wechat-stores/operate?act=add`,
 				data: data,
 				method: 'post'
 			})

 			dispatch({
 				type: Constants.ADD_STORE,
 				response
 			})

 			return Promise.resolve(response)
 		} catch(err) {
 			return Promise.reject(err)
 		}
 	}
 }

  //获取门店类型 下拉列表
 export function getStoresEditSelect({ categoryId }) {
 	return async (dispatch) => {
 		try {
 			const response = await load({
 				url:`/seletor/wechat/get-wechat-stores-edit-selector?parent=${categoryId}`
 			})

 			dispatch({
 				type: Constants.GET_STORES_EDIT_SELECT,
 				response
 			})

 			return Promise.resolve(response)
	 	} catch(err){
	 		return Promise.reject(err)
	    }
    }
}


//查看门店
export function checkStore({ id, categoryId }) {
	return async (dispatch) => {
		try {
			const params = {
				act: 'check',
				id: id,
				categoryId		
			}
			const response = await load({
				url:'/wechat/wechat-stores/operate',
				data: params
			})

			dispatch({
				type: Constants.CHECK_STORE,
				response
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}

 //修改门店
 export function editStore({ id }) {
 	return async (dispatch) => {
 		try {
 			const response = await load({
 				url:`/wechat/wechat-stores/operate?act=update&id=${id}`
 			})

 			dispatch({
 				type: Constants.EDIT_STORE,
 				response
 			})

 			return Promise.resolve(response)
 		} catch(err) {
 			return Promise.reject(err)
 		}
 	}
 }

 //拉取所有门店
 export function syncStoreList() {
 	return async (dispatch) => {
 		try {
 			const response = await load({
 				url: '/wechat/wechat-stores/synch-stores-list?count=1'
 			})

 			dispatch({
 				type: Constants.SYNC_STORE_LIST,
 				response
 			})

 			return Promise.resolve(response)
 		} catch(err) {
 			return Promise.reject(err)
 		}
 	}
 }

 //同步门店
 export function syncStoreOne(id) {
 	return async (dispatch) => {
 		try {
 			const response = await load({
 				url: `/wechat/wechat-stores/synch?id=${id}`
 			})

 			dispatch({
 				type: Constants.SYNC_STORE_ONE,
 				response
 			})

 			return Promise.resolve(response)
 		} catch(err) {
 			return Promise.reject(err)
 		}
 	}
 }

 //删除门店
 export function deleteStore(id) {
 	return async (dispatch) => {
 		try{
			const response = await load({
 				url: `/wechat/wechat-stores/operate?act=delete&id=${id}`
 			})

 			dispatch({
 				type: Constants.DELETE_STORE,
 				response
 			})

 			return Promise.resolve(response)
 		} catch(err) {
 			return Promise.reject(err)
 		}
 	}
 }

/*
 * 获取所有行政区规划
 * KEY 必须
 * ID 缺省时则返回最顶级行政区
 * QQ API 
 * http://lbs.qq.com/webservice_v1/guide-region.html
 */
export function getTopDistricts() {
	return async (dispatch) => {
		try {
			const ret = await axios({
				method:'get',
				url:`http://apis.map.qq.com/ws/district/v1/getchildren?key=MT5BZ-3JI3R-3VDWE-WKNYK-NAPY2-DOBCA`
			})
			if(ret.status == '200'){
				dispatch({
					type:Constants.GET_TOP_DISTRICTS,
					data:ret.data
				})
				return Promise.resolve(ret)
			}else{
				return Promise.reject(ret)
			}
			
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function getTopDistrictsChild(id) {
	return async (dispatch) => {
		try {
			const ret = await axios({
				method:'get',
				url:`http://apis.map.qq.com/ws/district/v1/getchildren?key=MT5BZ-3JI3R-3VDWE-WKNYK-NAPY2-DOBCA&id=${id}`
			})
			if(ret.status == '200'){
				dispatch({
					type:Constants.GET_TOP_DISTRICTS_CHILD,
					data:ret.data
				})
				return Promise.resolve(ret)
			}else{
				return Promise.reject(ret)
			}
		} catch (err) {
			return Promise.reject(err)
		}
	}
}

/*
 *坐标定位具体位置
 */
 export function getDetailLocation(location) {
 	return async (dispatch) => {
 		try {
 			const ret = await axios({
 				url:`http://apis.map.qq.com/ws/geocoder/v1/?key=MT5BZ-3JI3R-3VDWE-WKNYK-NAPY2-DOBCA&location=${location}`
 			})

 			if(ret.status == '200') {
 				dispatch({
 					type: Constants.GET_DETAIL_LOCATION,
 					data: ret.data.result
 				})
 				return Promise.resolve(ret)
 			} else {
 				return Promise.reject(ret)
 			}
 		} catch (err) {
 			return Promise.reject(err)
 		}
 	}
 }

/*
 * 地图检索
 */
 export function searchMapBykeyword({ regionCity, keyWord, page = 1, psize = 10 }) {
 	return async (dispatch) => {
 		try {
 			// const params = {
 			// 	boundary: 'region('+regionCity+',0)',
 			// 	page_index:page,
 			// 	page_size:psize,
 			// 	keyword:keyWord,
 			// 	orderby:'_distance',
 			// 	key:'MT5BZ-3JI3R-3VDWE-WKNYK-NAPY2-DOBCA'
 			// }

 			const ret = await axios({
 				url: `http://apis.map.qq.com/ws/place/v1/search?key=MT5BZ-3JI3R-3VDWE-WKNYK-NAPY2-DOBCA&boundary=region(${regionCity},0)&page_index=${page}&page_size=${psize}&keyword=${keyWord}&orderby=_distance
 					`
 			})

 			if(ret.status == '200') {
 				dispatch({
 					type:Constants.SEARCH_MAP_BY_KEYWORD,
 					data:ret
 				})
 				return Promise.resolve(ret)
 			}else{
 				return Promise.reject(ret)
 			}
 		} catch (err) {
 			return Promise.reject(err)
 		}
 	}
 }

/*
	路由
	Howardxu
*/
 //路由列表
 export function fetchCardVoucherRoutes({ page=1, psize=10, name, route_white_list, card_white_list}){
	return async (dispatch) => {
		try {
			const params = {
				page,
				route_white_list,
				card_white_list,
				'per-page':	psize
			}

			const response = await load({
				url:'/wechat/wechat-cards-route/index',
				data: params
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_ROUTES,
				response,
				params:{
					psize,
					count:response.result.count,
					page:response.result.page
				}
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	} 
}
//路由 查看
export function checkCardVoucherRoute({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-route/operate?act=check&id=${id}`
			})

			dispatch({
				type: Constants.CHECK_CARD_VOUCHER_ROUTE,
				response
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}
//路由 新增
export function addCardVoucherRoute(data) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-cards-route/operate?act=add`,
				data: data,
				method:'post'
			})

			dispatch({
				type: Constants.ADD_CARD_VOUCHER_ROUTE,
				response
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
} 

//路由 删除
export function delCardVoucherRoute(id, act='delete') {	
	return async (dispatch) => {
		try {
			const params = { id: id, act: act }
			const response = (await load({
				url: '/wechat/wechat-cards-route/operate',
				data: params,
			}))
			dispatch({
				type: Constants.DEL_CARD_VOUCHER_ROUTE,
				response,
				id
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
		
	}
}

//路由 修改
export function updateCardVoucherRoute(data, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-route/operate?act=update&id=${id}`,
				method:'post',
				data
			})

			dispatch({
				type: Constants.UPDATE_CARD_VOUCHER_ROUTE,
				response
			})

			return Promise.resolve(response)
		} catch(err) {
			return Promise.reject(err)
		}
	}
}

/*
 获取列表 
 用于添加路由时选择卡券
*/
 export function fetchCardVoucherCardList({ page, psize, available_state }){
	return async (dispatch) => {
		try {
			const params = {
				available_state,
				page,
				'per-page':	psize
			}

			const response = await load({
				url:'/seletor/wechat/get-wechat-cards-route-edit-selector',
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_CARD_LIST,
				response 
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	} 
}


/* 
 * 白名单
 *
 */
 //白名单列表
 export function fetchCardVoucherWhite({ page=1, psize=10 }){
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page':	psize
			}

			const response = await load({
				url:'/wechat/wechat-cards-white-list/index',
				data: params
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_WHITE,
				response,
				params:{
					psize,
					count:response.result.count,
					page:response.result.page
				}
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	} 
}

//白名单 查看
export function checkCardVoucherWhite({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-white-list/operate?act=check&id=${id}`
			})

			dispatch({
				type: Constants.CHECK_CARD_VOUCHER_WHITE,
				response
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}

//白名单 新增
export function addCardVoucherWhite(data) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-photo/operate?act=add`,
				data: data,
				method:'post'
			})

			dispatch({
				type: Constants.ADD_CARD_VOUCHER_WHITE,
				response
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
} 

//白名单 删除
export function delCardVoucherWhite(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-cards-white-list/operate?act=delete&id=${id}`
			})

			dispatch({
				type: Constants.DEL_CARD_VOUCHER_WHITE,
				response,
				id
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}

//白名单 修改
export function updateCardVoucherWhite(data, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-white-list/operate?act=update&id=${id}`,
				method:'post',
				data
			})

			dispatch({
				type: Constants.UPDATE_CARD_VOUCHER_WHITE,
				response
			})

			return Promise.resolve(response)
		} catch(err) {
			return Promise.reject(err)
		}
	}
}
  //白名单列表下拉数据
 export function getStatusSelectWhite() {
 	return async (dispatch) => {
 		try {
 			const response = await load({
 				url:'/seletor/wechat/get-wechat-cards-white-list-selector'
 			})
 			dispatch({
 				type: Constants.GET_STATUS_SELECT_WHITE,
 				response
 			})

 			return Promise.resolve(response)
 		} catch(err) {
 			return Promise.reject(err)
 		}
 	}
 }

   //白名单编辑下拉数据
 export function getStatusSelectPull() {
 	return async (dispatch) => {
 		try {
 			const response = await load({
 				url:'/seletor/wechat/get-wechat-cards-white-list-edit-selector'
 			})

 			dispatch({
 				type: Constants.GET_STATUS_SELECT_PULL,
 				response
 			})

 			return Promise.resolve(response)
 		} catch(err) {
 			return Promise.reject(err)
 		}
 	}
 }
/*
	二维码
	Howardxu
*/
 //二维码列表
 export function fetchCardVoucherQrcodeList({ page=1, psize=10, name='' }){
	return async (dispatch) => {
		try {
			const params = {
				name,
				page,
				'per-page':	psize
			}

			const response = await load({
				url:'/wechat/wechat-cards-qrcode/index',
				data: params
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_QRCODES,
				response,
				params:{
					psize,
					count:response.result.count,
					page:response.result.page
				}
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	} 
}
//二维码 查看
export function checkCardVoucherQrcode({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-qrcode/operate?act=check&id=${id}`
			})

			dispatch({
				type: Constants.CHECK_CARD_VOUCHER_QRCODE,
				response
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}
//二维码 同步
export function generateCardVoucherQrcode(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-qrcode/generate-qrcode?id=${id}`
			})

			dispatch({
				type: Constants.GENERATE_CARD_VOUCHER_QRCODE,
				response
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}
//二维码 新增
export function addCardVoucherQrcode(data) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-cards-qrcode/operate?act=add`,
				data: data,
				method:'post'
			})

			dispatch({
				type: Constants.ADD_CARD_VOUCHER_QRCODE,
				response
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
} 

//二维码 删除
export function delCardVoucherQrcode(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-cards-qrcode/operate?act=delete&id=${id}`
			})

			dispatch({
				type: Constants.DEL_CARD_VOUCHER_QRCODE,
				response,
				id
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}

//二维码 修改
export function updateCardVoucherQrcode(data, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-qrcode/operate?act=update&id=${id}`,
				method:'post',
				data
			})

			dispatch({
				type: Constants.UPDATE_CARD_VOUCHER_QRCODE,
				response
			})

			return Promise.resolve(response)
		} catch(err) {
			return Promise.reject(err)
		}
	}
}
//获取场景列表
 export function fetchCardVoucherQrcodeSelector(tag=''){
	return async (dispatch) => {
		try {

			const response = await load({
				url:`/seletor/wechat/get-wechat-cards-qrcode-edit-selector?tag=${tag}`,
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_QRCODE_SELECTOR,
				response,
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	} 
}

/* 
 * 卡卷兑换码
 *
 */
 //卡卷兑换码列表
 export function fetchCardVoucherRedeem({ page=1, psize=10 }){
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page':	psize
			}

			const response = await load({
				url:'/wechat/wechat-cards-redeem-code/index',
				data: params
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_REDEEM,
				response,
				params:{
					psize,
					count:response.result.count,
					page:response.result.page
				}
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	} 
}

//卡卷兑换码 查看
export function checkCardVoucherRedeem({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-redeem-code/operate?act=check&id=${id}`
			})

			dispatch({
				type: Constants.CHECK_CARD_VOUCHER_REDEEM,
				response
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}

//卡卷兑换码 新增
export function addCardVoucherRedeem(data) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-cards-redeem-code/operate?act=add`,
				data: data,
				method:'post'
			})

			dispatch({
				type: Constants.ADD_CARD_VOUCHER_REDEEM,
				response
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
} 

//卡卷兑换码 删除
export function delCardVoucherRedeem(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-cards-redeem-code/operate?act=delete&id=${id}`
			})

			dispatch({
				type: Constants.DEL_CARD_VOUCHER_REDEEM,
				response,
				id
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}

//卡卷兑换码 编辑
export function updateCardVoucherRedeem(data, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-redeem-code/operate?act=update&id=${id}`,
				method:'post',
				data
			})

			dispatch({
				type: Constants.UPDATE_CARD_VOUCHER_REDEEM,
				response
			})

			return Promise.resolve(response)
		} catch(err) {
			return Promise.reject(err)
		}
	}
}
  //卡卷兑换码列表下拉数据
 export function getStatusSelectRedeem() {
 	return async (dispatch) => {
 		try {
 			const response = await load({
 				url:'/seletor/wechat/get-wechat-cards-redeem-code-list-selector'
 			})
 			dispatch({
 				type: Constants.GET_STATUS_SELECT_REDEEM,
 				response
 			})

 			return Promise.resolve(response)
 		} catch(err) {
 			return Promise.reject(err)
 		}
 	}
 }

   //卡卷兑换码编辑下拉数据
 export function getStatusSelectPullR() {
 	return async (dispatch) => {
 		try {
 			const response = await load({
 				url:'/seletor/wechat/get-wechat-cards-redeem-code-edit-selector'
 			})

 			dispatch({
 				type: Constants.GET_STATUS_SELECT_PULLR,
 				response
 			})

 			return Promise.resolve(response)
 		} catch(err) {
 			return Promise.reject(err)
 		}
 	}
 }

//卡券记录
//获取列表
 export function fetchCardVoucherRecordList({ page=1, psize=10,cards_status='' }){
	return async (dispatch) => {
		try {
			const params = {
				cards_status,
				page,
				'per-page':	psize
			}

			const response = await load({
				url:'/wechat/wechat-cards-record/index',
				data: params
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_RECORD,
				response,
				params:{
					psize,
					count:response.result.count,
					page:response.result.page
				}
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	} 
}
//卡券记录 查看
export function checkCardVoucherRecord({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-record/operate?act=check&id=${id}`
			})

			dispatch({
				type: Constants.CHECK_CARD_VOUCHER_RECORD,
				response
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}
//卡券记录
//获取场景列表
 export function fetchCardVoucherRecordSelector(){
	return async (dispatch) => {
		try {

			const response = await load({
				url:'	/seletor/wechat/get-wechat-cards-records-list-selector',
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_RECORD_SELECTOR,
				response,
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	} 
}

//卡券转赠记录
//获取列表
 export function fetchCardVoucherGiftingRecordList({ page=1, psize=10 }){
	return async (dispatch) => {
		try {
			const params = {
				page,
				'per-page':	psize
			}

			const response = await load({
				url:'/wechat/wechat-cards-gifting-record/index',
				data: params
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_GIFTING_RECORD,
				response,
				params:{
					psize,
					count:response.result.count,
					page:response.result.page
				}
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	} 
}
//卡券转赠记录 查看
export function checkCardVoucherGiftingRecord({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-gifting-record/operate?act=check&id=${id}`
			})

			dispatch({
				type: Constants.CHECK_CARD_VOUCHER_GIFTING_RECORD,
				response
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}
/*
	卡券货架
	Howardxu
*/
 //货架列表
 export function fetchCardVoucherShelvesList({ page=1, psize=10, name='' }){
	return async (dispatch) => {
		try {
			const params = {
				name,
				page,
				'per-page':	psize
			}

			const response = await load({
				url:'/wechat/wechat-cards-goods-shelves/index',
				data: params
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_SHELVES,
				response,
				params:{
					psize,
					count:response.result.count,
					page:response.result.page
				}
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	} 
}
//货架 查看
export function checkCardVoucherShelves({ id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-goods-shelves/operate?act=check&id=${id}`
			})

			dispatch({
				type: Constants.CHECK_CARD_VOUCHER_SHELVES,
				response
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}
//货架 同步
export function synchCardVoucherShelves(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-goods-shelves/synch?id=${id}`
			})

			dispatch({
				type: Constants.SYNCH_CARD_VOUCHER_SHELVES,
				response
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}
//货架 新增
export function addCardVoucherShelves(data) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-cards-goods-shelves/operate?act=add`,
				data: data,
				method:'post'
			})

			dispatch({
				type: Constants.ADD_CARD_VOUCHER_SHELVES,
				response
			})
			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
} 

//货架 删除
export function delCardVoucherShelves(id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechat/wechat-cards-goods-shelves/operate?act=delete&id=${id}`
			})

			dispatch({
				type: Constants.DEL_CARD_VOUCHER_SHELVES,
				response,
				id
			})

			return Promise.resolve(response)
		} catch(err){
			return Promise.reject(err)
		}
	}
}

//货架 修改
export function updateCardVoucherShelves(data, id) {
	return async (dispatch) => {
		try {
			const response = await load({
				url:`/wechat/wechat-cards-goods-shelves/operate?act=update&id=${id}`,
				method:'post',
				data
			})

			dispatch({
				type: Constants.UPDATE_CARD_VOUCHER_SHELVES,
				response
			})

			return Promise.resolve(response)
		} catch(err) {
			return Promise.reject(err)
		}
	}
}
//获取卡券货架列表下拉数据
 export function fetchCardVoucherShelvesListSelector(){
	return async (dispatch) => {
		try {

			const response = await load({
				url:'/seletor/wechat/get-wechat-cards-shelves-list-selector',
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_SHELVES_LIST_SELECTOR,
				response,
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	}
}
//获取卡券货架编辑下拉数据
 export function fetchCardVoucherShelvesEditSelector(){
	return async (dispatch) => {
		try {

			const response = await load({
				url:'/seletor/wechat/get-wechat-cards-shelves-edit-selector',
			})

			dispatch({
				type:Constants.FETCH_CARD_VOUCHER_SHELVES_Edit_SELECTOR,
				response,
			})

			return Promise.resolve(response)
		} catch (err){
			return Promise.reject(err)
		}
	} 
}
