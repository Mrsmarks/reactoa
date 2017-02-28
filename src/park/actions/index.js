import load from 'Application/utils/fetchApi'
import * as Constants from 'park/constants'

//宜停车模块
//优惠券
//列表
export function fetchTicketList({  page = 1, psize = 10, mobile, source, use_status }) {
	return async (dispatch) => {
		try {
			const params = { 
				 mobile,
				 source,
				 use_status,
				 page,
				'per-page': psize
			}

			const response = await load({
				url: '/ytc/ytc-coupon/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/ytc/ytc-coupon-selector',
			})

			dispatch({
				type: Constants.FETCH_PARK_TICKET_LIST,
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

//请求日志
//列表
export function fetchRequestLogList({ page = 1, psize = 10 }) {
	return async (dispatch) => {
		try {
			const params = { 
				 page,
				 'per-page': psize
			}

			const response = await load({
				url: '/ytc/ytc-request/index',
				data: params,
			})

			dispatch({
				type: Constants.FETCH_PARK_REQUEST_LIST,
				response,
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

//短信日志
//列表
export function fetchMessageLogList({ page = 1, psize = 10, mobile, use_status, response_code }) {
	return async (dispatch) => {
		try {
			const params = { 
				 page,
				 'per-page': psize,
				 mobile,
				 use_status,
				 response_code
			}

			const response = await load({
				url: '/ytc/ytc-send-msg/index',
				data: params
			})

			const option = await load({
				url: '/seletor/ytc/ytc-send-msg-selector',
			})

			dispatch({
				type: Constants.FETCH_PARK_MESSAGE_LIST,
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

//获取订单管理
//列表
export function fetchOrderList({ page = 1, psize = 10, mobile, orderid, deposit_status, action }) {
	return async (dispatch) => {
		try {
			const params = { 
				 page,
				 'per-page': psize,
				 mobile,
				 orderid,
				 deposit_status,
				 action
			}

			const response = await load({
				url: '/ytc/ytc-order/index',
				data: params
			})

			const option = await load({
				url: '/seletor/ytc/ytc-order-selector',
			})

			dispatch({
				type: Constants.FETCH_PARK_ORDER_LIST,
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