import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'ytcard/components/order/list'
import { 
    fetchYtcardOrderList,
     } from 'ytcard/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
    ({ ytCardOrder }) => ({ 
        content: ytCardOrder.get('content'),
        option: ytCardOrder.get('option'),
        params: ytCardOrder.get('params'),
        pending:  ytCardOrder.get('pending')
    }),
    dispatch => ({
        actions: bindActionCreators({ fetchYtcardOrderList }, dispatch)
    })
)

export default class GroupCompRoute extends React.Component {

    state = {
        loading: false,
    }
    static storeName = 'ytCardOrder'
    static fillStore(redux, props) {
        return Promise.all([
            redux.dispatch(fetchYtcardOrderList({ ...props.location.query }))
        ])
    }

    @autoLoading.bind(this, 'loading')
    fetchYtcardOrderList() {
        return this.props.actions.fetchYtcardOrderList(...arguments)
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
                        fetchYtcardOrderList: ::this.fetchYtcardOrderList,
                    }} 
                    >
                    </GroupComp>
                </Spin>
                }
            </div>
            
        )
    }
}