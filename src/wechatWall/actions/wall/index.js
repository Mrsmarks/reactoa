import load from 'Application/utils/fetchApi'
import * as Constants from 'wechatWall/constants'
// 微信墙

// 查询活动列表
export function fetchActivityList({ page = 1, psize = 10, type = '0', name = '' }) {

    return async (dispatch) => {
        try {
            const params = { 
                page,
                'per-page': psize,
                type,
                name
            }
            const response = await load({
                url: '/wechatWall/wechat-wall-scene/index',
                data: params
            })

            dispatch({
                type: Constants.FETCH_WALL_ACTIVITY_ALL,
                response,
                params: {
                    psize,
                    count: response.result.count,
                    page: response.result.page,
                    name
                },
                activityType: type
            })

            return Promise.resolve(response)

        } catch (err) {
            return Promise.reject(err)
        }
    }
}

// 编辑／添加／修改
export function editActivity(postData, act = 'add') {
    return async (dispatch) => {
        try {

            const response = await load({
                url: `/wechatWall/wechat-wall-scene/operate?act=${act}&id=${postData.id}`,
                data: postData,
                method: 'post'
            })

            switch (act) {
                case 'add':
                    dispatch({
                        type: Constants.SAVE_WALL_ACTIVITY,
                        response
                    })
                    break
                case 'delete':
                    dispatch({
                        type: Constants.DELETE_WALL_ACTIVITY,
                        id: postData.id
                    })
                case 'update':
                    dispatch({
                        type: Constants.UPDATE_WALL_ACTIVITY,
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

export function copyActivity(postData) {
    return async (dispatch) => {
        try {
            const response = await load({
                url: `/wechatWall/wechat-wall-scene/copy-activity`,
                data: postData
            })

            setTimeout(() => {
                location.reload()
            }, 1500)

            return Promise.resolve(response)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}