import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'ytcard/components/log/list'
import { 
    fetchYtcardLogList,
     } from 'ytcard/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
    ({ ytCardLog }) => ({ 
        content: ytCardLog.get('content'),
        option: ytCardLog.get('option'),
        params: ytCardLog.get('params'),
        pending:  ytCardLog.get('pending')
    }),
    dispatch => ({
        actions: bindActionCreators({ fetchYtcardLogList }, dispatch)
    })
)

export default class GroupCompRoute extends React.Component {

    state = {
        loading: false,
    }

    static storeName = 'ytCardLog'
    
    static fillStore(redux, props) {
        return Promise.all([
            redux.dispatch(fetchYtcardLogList({ ...props.location.query }))
        ])
    }

    @autoLoading.bind(this, 'loading')
    fetchYtcardLogList() {
        return this.props.actions.fetchYtcardLogList(...arguments)
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
                        fetchYtcardLogList: ::this.fetchYtcardLogList,
                    }} 
                    >
                    </GroupComp>
                </Spin>
                }
            </div>
            
        )
    }
}