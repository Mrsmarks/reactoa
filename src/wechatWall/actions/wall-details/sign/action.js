import load from 'Application/utils/fetchApi'
import * as Constants from 'wechatWall/constants'

export function fetchSignSetting({ id, psize = 10, page = 1 }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-sign/index?sid=${id}`
			})


			if (response.result.white_list_status == 1) {
				fetchWhiteList({ sid: id, psize, page })(dispatch)
			}

			dispatch({
				type: Constants.FETCH_WALL_SIGN_SETTING,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}


export function updateSignSetting({ postData, sid }) {

	return async (dispatch) => {
		try {
			
			const response = await load({
				url: `/wechatWall/wechat-wall-sign/operate?sid=${sid}`,
				method: 'post',
				data: postData
			})

			dispatch({
				type: Constants.UPDATE_WALL_SIGN_SETTING,
				response
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function fetchWhiteList({ sid, psize = 10, page = 1 }) {
	psize = 5

	return async (dispatch) => {
		try {
			
			const response = await load({
				url: `/wechatWall/wechat-wall-sign-white-list/index?sid=${sid}&page=${page}&per-page=${psize}`
			})

			dispatch({
				type: Constants.FETCH_WALL_WHITE_LIST,
				response,
				psize
			})

			return Promise.resolve(response)

		} catch (err) {
			return Promise.reject(err)
		}
	}
}

export function editWhiteName({ postData, sid, act, id }) {
	return async (dispatch) => {
		try {
			const response = await load({
				url: `/wechatWall/wechat-wall-sign-white-list/operate?sid=${sid}&act=${act}&id=${id}`,
				method: 'post',
				data: postData
			})

			switch(act) {
				case 'add':
					dispatch({
						type: Constants.ADD_WALL_WHITE_NAME,
						response
					})
					break
				case 'delete':
					dispatch({
						type: Constants.DELETE_WALL_WHITE_NAME,
						id
					})
					break
				case 'update':
					dispatch({
						type: Constants.UPDATE_WALL_WHITE_NAME,
						id,
						response
					})
					break

			}

			return Promise.resolve(response)
		} catch (err) {
			return Promise.reject(err)
		}
	}
}
