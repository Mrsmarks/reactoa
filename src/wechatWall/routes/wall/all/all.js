import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchActivityList, editActivity, copyActivity } from 'wechatWall/actions/wall'

import autoLoading from 'Application/decorators/autoLoading'

import AllActivity from 'wechatWall/components/wall/activity/item'

/**
 * 微信墙－全部活动
 */

@connect(
    ({ wallActivity, application }) => ({ 
        content: wallActivity.getIn(['all', 'list']),
        params: wallActivity.getIn(['all', 'params']),
        now: wallActivity.get('now'),
        frontedDomain: application.getIn(['user', 'fronted_domain']),
    }),
    dispatch => ({
        actions: bindActionCreators({ fetchActivityList, editActivity, copyActivity }, dispatch)
    })
)
export default class ActivityListRoute extends React.Component {

    state = {
        loading: false,
        editLoading: false
    }
    // static storeName = 'wallPhotoManagement'
    static fillStore(redux, props) {
        return Promise.all([
            redux.dispatch(fetchActivityList({ ...props.location.query, type: 0 }))
        ])
    }

    @autoLoading.bind(this, 'editLoading')
    editActivity() {
        return this.props.actions.editActivity(...arguments)
    }

    @autoLoading.bind(this, 'copyActivity')
    copyActivity() {
        return this.props.actions.copyActivity(...arguments)
    }

    @autoLoading
    deleteActivity() {
        return this.props.actions.editActivity(...arguments)
    }

    @autoLoading
    fetchActivityList() {
        return this.props.actions.fetchActivityList(...arguments)
    }

    render() {
        return (
            <AllActivity
                {...this.props}
                {...this.state}
                pathname="/wall/activity-all/index"
                type="0"
                actions={{
                    fetchActivityList: ::this.fetchActivityList,
                    editActivity: ::this.editActivity,
                    deleteActivity: ::this.deleteActivity,
                    copyActivity: ::this.copyActivity
                }}
            />
        )
    }
}