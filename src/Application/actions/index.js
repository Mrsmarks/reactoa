import load from '../utils/fetchApi'
import { hashHistory } from 'react-router'
import {
    FETCH_USERCONFIG_SUCCESS,
    FETCH_USERPUBLIC_LIST,
    APP_READY,
    APP_CRASH,
    LOGIN,
    LOGOUT
} from '../constants'

export function fetchUserPublicList() {
    return async (dispatch) => {
        try {
            const response = (await load({
                url: '/seletor/wechat/get-wechat-list'
            })).result.wechatAccount

            
            dispatch({
                type: FETCH_USERPUBLIC_LIST,
                response
            })
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export function changePublic(acid, acname) {
    return async (dispatch) => {
        try {
            const response = await load({
                url: '/home/reset-account',
                data: {
                    acid,
                    acname
                }
            })

            
            return Promise.resolve(response)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export function fetchUserConfig(uid) {
    return async (dispatch, getState) => {
        try {
            if (!getState().application.get('auth').size && !getState().application.get('routes').size) {
                const repsonse = (await load({
                    url: '/home/get-menu'
                })).result

                dispatch({
                    type: FETCH_USERCONFIG_SUCCESS,
                    auth: repsonse.authList,
                    routes: repsonse.menumain
                })
            }
        } catch (err) {
            return Promise.reject(err)
        }
    }
}


/**
 * 页面刷新后首次加载数据的ajax都完成了
 */
export function appReady() {
    return dispatch => {
        dispatch({
            type: APP_READY
        })
    }
}

/**
 * 页面刷新后首次加载数据的时候报错了
 */
export function appCrash(errormsg = '') {
    return dispatch => {
        dispatch({
            type: APP_CRASH,
            errormsg
        })
    }
}


export function login(username, password, captcha) {
    return async (dispatch) => {
        try {
            const ret = await load({
                url: '/admin/login',
                data: {
                    username,
                    password,
                    captcha
                },
                method: 'post'
            })
            const user = ret.result

            const repsonse = (await load({
                url: '/home/get-menu'
            })).result

            dispatch({
                type: FETCH_USERCONFIG_SUCCESS,
                auth: repsonse.authList,
                routes: repsonse.menumain
            })

            dispatch({
                type: LOGIN,
                user
            })
            return Promise.resolve(ret)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export function logout() {
    return async (dispatch) => {
        try {
            const ret = await load({
                url: '/admin/logout'
            })

            dispatch({
                type: LOGOUT
            })
            hashHistory.replace({
                pathname: '/login',
                state: {
                    message: ret.errormsg,
                    type: 'success'
                }
            })
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export function modifyPassword({ oldPass, newPass }) {
    return async (dispatch) => {
        try {
            const ret = await load({
                url: '/system/admin/update-user-password',
                data: {
                    oldPass,
                    newPass
                },
                method: 'post'
            })

            return Promise.resolve(ret)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export function uploadFile(file) {
    return async (dispatch) => {
        try {
            const ret = await load({
                url: '/upload/upload',
                data: {
                    file
                },
                method: 'post'
            })
            return Promise.resolve(ret)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export function uploadExcelFile(file, url) {
    return async (dispatch) => {
        try {
            const ret = await load({
                url: url,
                data: {
                    file
                },
                method: 'post'
            })
            return Promise.resolve(ret)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}