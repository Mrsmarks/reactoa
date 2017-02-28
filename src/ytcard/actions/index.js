import load from 'Application/utils/fetchApi'
import * as Constants from 'ytcard/constants'

//粤通卡日志模块
//列表
export function fetchYtcardLogList({ type, page, psize = 10 }) {
	return async (dispatch) => {
		try {
			const params = { 
				 type,
				 page,
				'per-page': psize
			}

			const response = await load({
				url: '/ytk/ytk-request/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/ytk/ytk-request-selector',
			})

			dispatch({
				type: Constants.FETCH_YTCARD_LOG_LIST,
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

//粤通卡订单模块
//列表
export function fetchYtcardOrderList({ discount_status, page, psize = 10 }) {
	return async (dispatch) => {
		try {
			const params = { 
				 discount_status,
				 page,
				'per-page': psize
			}

			const response = await load({
				url: '/ytk/ytk-recharge/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/ytk/ytk-order-selector',
			})

			dispatch({
				type: Constants.FETCH_YTCARD_ORDER_LIST,
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