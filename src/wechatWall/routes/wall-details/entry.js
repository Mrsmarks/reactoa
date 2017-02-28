import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import SideNav from 'Application/components/nav/sideNav'
import BreadNav from 'Application/components/nav/breadNav'

/**
 * 左侧二级路由
 */

export default class WallDetailsRoute extends React.Component {
    static propTypes = {
        appRoutes: PropTypes.any
    }

    static contextTypes = {
        location: PropTypes.object.isRequired
    }

    static childContextTypes = {
        getSid: PropTypes.func
    }

    getChildContext() {
        return {
            getSid: () => {
                return this.context.location.query.id
            }
        }
    }

    // static childContextTypes = {
    //  onButtonClick: PropTypes.func
    // }

    // getChildContext() {
    //  return {
    //      onButtonClick: 
    //  }
    // }

    walkData(children) {
        return children.map(item => {
            if (item.path) {
                item.query = {
                    wallName: this.context.location.query.wallName,
                    id: this.context.location.query.id,
                    uniqueId: this.context.location.query.uniqueId
                }
            }

            if (item.children) {
                item.children = this.walkData(item.children)
            }

            return item
        })
    }

    render () {
        if(this.props.appRoutes.size === 0) {
            return null
        }
        const childRoutes = Object.assign({}, this.props.appRoutes.filter(item => item.name === '微信墙').get(0))
        if (childRoutes.children) {
            childRoutes.children = childRoutes.children.filter(item => {
                
                if (item.children) {
                    return item.children.some(item => !/\/wall\/activity/.test(item.path))
                }

                return !/\/wall\/activity/.test(item.path)
            })
            // 为每一个菜单添加query属性
            // 左侧菜单不要乱添加query属性
            childRoutes.children = this.walkData(childRoutes.children)
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
