import load from 'Application/utils/fetchApi'
import * as Constants from '../constants'

//积分模块
//列表
export function fetchIntergralUserList({  page = 1, psize = 10, mobile, type, start_time, end_time }) {
	return async (dispatch) => {
		try {
			const params = { 
				 mobile,
				 type,
				 start_time,
				 end_time,
				 page,
				'per-page': psize
			}

			const response = await load({
				url: '/credit/credit-user/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/credit/get-credit-user-selector',
			})

			dispatch({
				type: Constants.FETCH_INTEGRAL_USER_LIST,
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

//查询单个用户积分记录
export function fetchSingerUserRecord({ userid }) {
	return async (dispatch) => {
		try {
			const params = { 
				userid
			}

			const response = await load({
				url: '/credit/credit-log/check',
				data: params,
			})


			dispatch({
				type: Constants.FETCH_SINGER_USER_RECORD,
				response,
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

//积分日志
//列表
export function fetchIntergralLogList({ page = 1, psize = 10, type, start_time, end_time }) {
	return async (dispatch) => {
		try {
			const params = { 
				 page,
				 'per-page': psize,
				 type,
				 start_time,
				 end_time
			}

			const response = await load({
				url: '/credit/credit-log/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/credit/get-credit-log-selector',
			})

			dispatch({
				type: Constants.FETCH_INTEGRAL_LOG_LIST,
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
