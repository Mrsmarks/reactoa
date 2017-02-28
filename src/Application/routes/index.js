import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Immutable from 'immutable'
import { bindActionCreators } from 'redux'

import Spin from 'antd/lib/spin'

import { 
    fetchUserConfig,
    fetchUserPublicList,
    changePublic,
    logout,
    modifyPassword
} from '../actions'
import HeaderNav from '../components/nav/headerNav'
import InitLoading from '../components/initLoading'
import CrashPage from '../components/crashPage'

import autoLoading from '../decorators/autoLoading'

import 'antd/dist/antd.css'
import '../styles/global.scss'
import '../styles/simditor.css'

let listenEvt = false

/**
 * 顶部一级路由
 */

@connect(
    ({ application }) => ({
        appRoutes: application.get('routes'),
        ready: application.get('appReady'),
        crash: application.get('appCrash'),
        crashMsg: application.get('crashMsg'),
        user: application.get('user'),
        auth: application.get('auth'),
        logo: application.getIn(['user', 'logo']),
        publicList: application.get('publicList')
    }),
    dispatch => ({
        actions: bindActionCreators({ logout, modifyPassword, changePublic }, dispatch)
    })
)
export default class AppRoute extends React.Component {
    static fillStore(redux) {
        const uid = redux.getState().application.getIn(['user', 'uid'])
        return Promise.all([
            redux.dispatch(fetchUserConfig(uid)),
            redux.dispatch(fetchUserPublicList())
        ])
    }

    static propTypes = {
        appRoutes: PropTypes.instanceOf(Immutable.List).isRequired,
        location: PropTypes.object.isRequired
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired
    }

    state = {
        openKeys: [],
        selectedKeys: [],
        currentKey: null,
        key: '',

        modifyPwdLoading: false
    }

    static childContextTypes = {
        routes: PropTypes.array,
        location: PropTypes.object,

        logo: PropTypes.string,

        auth: PropTypes.object,

        sideNav: PropTypes.object
    }

    getChildContext() {
        return {
            routes: this.props.routes,
            location: this.props.location,

            auth: this.props.auth,

            logo: this.props.logo,

            sideNav: {
                updateSelectedKey: ::this.updateSelectedKey,
                updateOpenKeys: ::this.updateOpenKeys,
                updateState: ::this.updateState,
                key: this.state.key,
                openKeys: this.state.openKeys,
                selectedKeys: this.state.selectedKeys,
                currentKey: this.state.currentKey
            }
        }
    }


    @autoLoading.bind(this, 'modifyPwdLoading')
    modifyPassword() {
        return this.props.actions.modifyPassword(...arguments)
    }

    updateOpenKeys(openKeys) {
        this.setState({
            openKeys
        })
    }

    // 刷新页面后激活左侧按钮颜色
    walkByPath(routes, regexp) {
        let ret
        let deepKey = 0
        routes.some(item => {
            if (ret) {
                return true
            }
            if (regexp.test(item.path)) {
                ret = {
                    selectedKeys: item.key + '',
                    item
                }
            } else if (item.children) {
                deepKey = item.key
                ret = this.walkByPath(item.children, regexp)
                if (!ret) {
                    deepKey = 0
                }
            }
        })
        
        if(ret && ret.selectedKeys) {
            ret.openKeys = deepKey + ''
        }

        return ret
    } 

    // TODO 优化cb 最好把它去掉
    updateSelectedKey(activityKey, cb) {
        this.setState({
            selectedKeys: [activityKey]
        }, cb)

    }

    
    updateState(routeObject, pureRender, path) {
        const children = routeObject.children
        const pathname = (path || this.props.location.pathname).split('\/').slice(0, 3).join('/')
        const reg = new RegExp(pathname)
        const ret = this.walkByPath(children, reg)
        if (!ret) {
            return
        }
        const state = {
            openKeys: [ret.openKeys],
            selectedKeys: [ret.selectedKeys],
            currentKey: routeObject.key,
            routeObject,
            key: routeObject.key
        }
        if (pureRender) {
            setTimeout(() => {
                this.setState(state)
            }, 0)
        } else {
            this.setState(state)
        }
    }

    renderInitPage() {
        let ret = [
            <InitLoading 
                key="InitLoading"
                ready={this.props.ready}
            />
        ]
        if (this.props.crash) {
            ret = [
                <CrashPage 
                    key="CrashPage"
                    crashMsg={this.props.crashMsg}
                />
            ]
        }
        return ret
    }

    componentDidMount(nextProps) {
        // 防止下面的事件被重复监听，页面重载后listenEvt才会是false
        if (listenEvt) {
            return
        }

        // 监听路由地址，改变后更新sideNav 和 headerNav的按钮激活状态
        this.context.router.listen(function(next) {
            if ((next.action === 'POP' || next.state === 'POP') && this.state.routeObject) {
                if (this.state.routeObject.key != next.pathname.split('\/')[0]) {
                    this.updateState(this.state.routeObject, false, next.pathname)
                }
            }
        }.bind(this))
        listenEvt = true
    }

    render () {
        const { appRoutes } = this.props
        return (
            <div>
                {this.renderInitPage()}
                {
                    this.state.currentKey &&  
                     <HeaderNav 
                        routes={appRoutes} 
                        actions={{
                            logout: ::this.props.actions.logout,
                            changePublic: ::this.props.actions.changePublic,
                            modifyPassword: ::this.modifyPassword
                        }}
                        modifyPwdLoading={this.state.modifyPwdLoading}
                        user={this.props.user} 
                        publicList={this.props.publicList}/>
                }
                {  /*显示各大模块，微信，贺卡，微信墙等  */}
                {this.props.children &&
                    React.cloneElement(this.props.children, { appRoutes })}
            </div>
        )
    }

}
