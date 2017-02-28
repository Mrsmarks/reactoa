import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'park/components/request/list'
import { 
    fetchRequestLogList,
     } from 'park/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
    ({ parkRequest }) => ({ 
        content: parkRequest.get('content'),
        params: parkRequest.get('params'),
        pending:  parkRequest.get('pending')
    }),
    dispatch => ({
        actions: bindActionCreators({ fetchRequestLogList }, dispatch)
    })
)

export default class GroupCompRoute extends React.Component {

    state = {
        loading: false,
    }
    static storeName = 'parkRequest'
    static fillStore(redux, props) {
        return Promise.all([
            redux.dispatch(fetchRequestLogList({ ...props.location.query }))
        ])
    }

    @autoLoading.bind(this, 'loading')
    fetchRequestLogList() {
        return this.props.actions.fetchRequestLogList(...arguments)
    }


    render() {
        return (
            <div>
                {this.props.children? this.props.children: 
                <Spin spinning={this.props.pending}>
                    <GroupComp
                    {...this.props}
                    {...this.state}
                    actions={{
                        fetchRequestLogList: ::this.fetchRequestLogList,
                    }} 
                    >
                    </GroupComp>
                </Spin>
                }
            </div>
            
        )
    }
}