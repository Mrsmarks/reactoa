import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'park/components/order/list'
import { 
    fetchOrderList,
     } from 'park/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
    ({ parkOrder }) => ({ 
        content: parkOrder.get('content'),
        option: parkOrder.get('option'),
        params: parkOrder.get('params'),
        pending:  parkOrder.get('pending')
    }),
    dispatch => ({
        actions: bindActionCreators({ fetchOrderList }, dispatch)
    })
)

export default class GroupCompRoute extends React.Component {

    state = {
        loading: false,
    }
    static storeName = 'parkOrder'
    static fillStore(redux, props) {
        return Promise.all([
            redux.dispatch(fetchOrderList({ ...props.location.query }))
        ])
    }

    @autoLoading.bind(this, 'loading')
    fetchOrderList() {
        return this.props.actions.fetchOrderList(...arguments)
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
                        fetchOrderList: ::this.fetchOrderList,
                    }} 
                    >
                    </GroupComp>
                </Spin>
                }
            </div>
            
        )
    }
}