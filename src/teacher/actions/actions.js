import load from 'Application/utils/fetchApi'
import * as Constants from '../constants'

//尊师卡模块
//用户列表
export function fetchTeacherUserList({  page = 1, psize = 10, mobile, username, work_status }) {
	return async (dispatch) => {
		try {
			const params = { 
				 mobile,
				 username,
				 work_status,
				 page,
				'per-page': psize
			}

			const response = await load({
				url: '/zsk/zsk-user/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/zsk/zsk-user-selector',
			})

			dispatch({
				type: Constants.FETCH_TEACHER_USER_LIST,
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

//积分日志
//记录列表
export function fetchTeacherMessageList({ page = 1, psize = 10, mobile, username, work_status }) {
	return async (dispatch) => {
		try {
			const params = { 
				 page,
				 'per-page': psize,
				 mobile,
				 username,
				 work_status
			}

			const response = await load({
				url: '/zsk/zsk-send-message/index',
				data: params,
			})

			const option = await load({
				url: '/seletor/zsk/zsk-send-message-selector',
			})

			dispatch({
				type: Constants.FETCH_TEACHER_RECORD_LIST,
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
