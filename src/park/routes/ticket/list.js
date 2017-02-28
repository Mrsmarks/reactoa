import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'park/components/ticket/list'
import { 
    fetchTicketList,
     } from 'park/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
    ({ parkTicket }) => ({ 
        content: parkTicket.get('content'),
        option: parkTicket.get('option'),
        params: parkTicket.get('params'),
        pending:  parkTicket.get('pending')
    }),
    dispatch => ({
        actions: bindActionCreators({ fetchTicketList }, dispatch)
    })
)

export default class GroupCompRoute extends React.Component {

    state = {
        loading: false,
    }
    static storeName = 'parkTicket'
    static fillStore(redux, props) {
        return Promise.all([
            redux.dispatch(fetchTicketList({ ...props.location.query }))
        ])
    }

    @autoLoading.bind(this, 'loading')
    fetchTicketList() {
        return this.props.actions.fetchTicketList(...arguments)
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
                        fetchTicketList: ::this.fetchTicketList,
                    }} 
                    >
                    </GroupComp>
                </Spin>
                }
            </div>
            
        )
    }
}