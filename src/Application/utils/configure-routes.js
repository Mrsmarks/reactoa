import React from 'react'
import { Route, Router, Redirect } from 'react-router'
import Application from 'Application/routes'
import Login from 'Application/routes/login'
import { appReady, appCrash } from '../actions'
import fillStore from './fillStore'
const allPromise = []
let hasReject = false

function walk(routes, cb) {
    cb(routes)
    if (routes.childRoutes) {
        routes.childRoutes.forEach(route => walk(route, cb))
    }
    return routes
}

function deletePromise(promise, store) {
    allPromise.some((item, index) => {
        if (item === promise) {
            allPromise.splice(index, 1)
            if (!allPromise.length) {
                // bugfix 登录后路由跳转后无法清楚loading页面
                if (!hasReject) {
                    store.dispatch(appReady())
                }
                hasReject = false
            }
            return true
        }
    })
}
export default (store, { root, redirect }) => {
    const routes = {
        childRoutes: [{
            path: '/',
            component: Application,
            childRoutes: [root]
        }, {
            path: '/login',
            component: Login
        }, ...redirect]
    }

    function fill(store, nextState, component) {
        const promise = fillStore(store, nextState, component)
        if (promise) {
            allPromise.push(promise)
            promise
                .then(x => {
                    deletePromise(promise, store)
                })
                .catch(x => {
                    hasReject = true
                    deletePromise(promise, store)
                    const name = (component.WrappedComponent || component).storeName
                    if (name) {
                        // let errorData = {
                        //  request: {}
                        // }
                        // if (x instanceof Error) {

                        // } else if (x.request) {
                        //  errorData.request = x.request.data
                        // }


                        store.dispatch({
                            type: name,
                            error: {
                                request: x.request ? x.request.data : {},
                                errormsg: x.err ? x.err.errormsg : ''
                            }
                        })
                    }
                    if (process.env.NODE_ENV === 'development') {
                        console.trace()
                        throw x
                    }
                    
                    // 处理异常情况
                    // 页面加载完成后的处理
                    if (store.getState().application.get('appReady') === true) {
                        let msg = ''
                        if (x instanceof Error) {
                            // js报错
                            msg = x.message
                        } else if (x.err) {
                            // 接口报错
                            msg = x.err.errormsg
                        } else {
                            msg = '未知错误（错误码10000）'
                        }
                        message.error(msg, 3)
                    } else {
                        // 页面加载中的处理
                        
                        // 未登录不能触发appCrash
                        if (x.status !== 401) {
                            if (x.err) {
                                // 没有公众号，非系统异常，因此可以进入页面
                                if (x.err.errorcode === 10204) {
                                    store.dispatch(appReady())
                                } else {
                                    store.dispatch(appCrash(x.err.errormsg))
                                }
                            } else {
                                store.dispatch(appCrash())
                            }
                            
                        }


                    }
                })
        }
    }
    return walk(routes, route => {

        if (route.ignore) {
            return
        }

        route.onEnter = (nextState, transition) => {
            if (route.component) {
                fill(store, nextState, route.component)
            }/* else if (route.getComponent) {
                route.routeWillReceivedComponent = component => {
                    if (route.fill) {
                        return
                    }
                    route.fill = true
                    route.component = component
                    fill(store, nextState, component)
                }
            }*/
        }

        route.onChange = (prevState, nextState, replace, callback) => {

            const nextPath = nextState.location.pathname
            nextState.routes.map(item => {
                if (item.path === nextPath) {
                    item.search = nextState.location.search
                    // 
                }
                return item
            })
            callback()
        }

    })

}