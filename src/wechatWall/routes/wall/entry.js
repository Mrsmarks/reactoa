import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import SideNav from 'Application/components/nav/sideNav'
import BreadNav from 'Application/components/nav/breadNav'

/**
 * 左侧二级路由
 */

export default class WallRoute extends React.Component {
    static propTypes = {
        appRoutes: PropTypes.any
    }


    render () {
        if(this.props.appRoutes.size === 0) {
            return null
        }

        let childRoutes = Object.assign({}, this.props.appRoutes.filter(item => item.name === '微信墙').get(0))

        const pathRegexp = /\/wall\/activity/
        if (childRoutes.children) {
            childRoutes.children = childRoutes.children.filter(item => {

                // 兼容匹配微信墙配置路由
                if (item.children) {
                    return item.children.some(item => pathRegexp.test(item.path))
                }

                return pathRegexp.test(item.path)
            })

        }
        return (
            <div>
                <SideNav 
                    route={childRoutes} 
                />
                <div className="breadNav">
                    <BreadNav/>
                </div>
                <div className="container">
                    {this.props.children}
                    
                </div>
            </div>
        )
    }

}
