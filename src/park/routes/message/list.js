import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'park/components/message/list'
import { 
    fetchMessageLogList,
     } from 'park/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
    ({ parkMessage }) => ({ 
        content: parkMessage.get('content'),
        option: parkMessage.get('option'),
        params: parkMessage.get('params'),
        pending:  parkMessage.get('pending')
    }),
    dispatch => ({
        actions: bindActionCreators({ fetchMessageLogList }, dispatch)
    })
)

export default class GroupCompRoute extends React.Component {

    state = {
        loading: false,
    }
    static storeName = 'parkMessage'
    static fillStore(redux, props) {
        return Promise.all([
            redux.dispatch(fetchMessageLogList({ ...props.location.query }))
        ])
    }

    @autoLoading.bind(this, 'loading')
    fetchMessageLogList() {
        return this.props.actions.fetchMessageLogList(...arguments)
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
                        fetchMessageLogList: ::this.fetchMessageLogList,
                    }} 
                    >
                    </GroupComp>
                </Spin>
                }
            </div>
            
        )
    }
}