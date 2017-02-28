import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AddRedeemComp from 'cardVoucher/components/redeem/add'
import { addCardVoucherRedeem, fetchCardVoucherRedeem } from 'cardVoucher/actions'

import { uploadFile } from  'Application/actions/index'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 添加 
 */

 @connect(
    ({ redeemlist }) => ({
        content: redeemlist.get('content'),
        params: redeemlist.get('params'),
        pending:  redeemlist.get('pending'),
        selectData: redeemlist.get('selectData')
    }),

    dispatch => ({
        actions: bindActionCreators({ addCardVoucherRedeem, fetchCardVoucherRedeem }, dispatch)
    })  
 )

 export default class addRedeemRoute extends React.Component {
    state ={
        loading: true,
        addLoading: false,
        fileLoading: false,
        listLoading: false
    }

    @autoLoading.bind(this, 'addLoading')
    addCardVoucherRedeem() {
        return this.props.actions.addCardVoucherRedeem(...arguments)
    }

    @autoLoading.bind(this, 'fileLoading')
    fetchCardVoucherRedeem() {
        return this.props.actions.fetchCardVoucherRedeem(...arguments)
    }

    render() {
        return (
            <div>
            {this.props.children? this.props.children:
                <Spin spinning={this.props.pending}>
                    <AddRedeemComp
                        {...this.props}
                        {...this.state}
                        actions={{
                            addCardVoucherRedeem: ::this.addCardVoucherRedeem,
                            fetchCardVoucherRedeem: ::this.fetchCardVoucherRedeem
                        }}
                    >
                    </AddRedeemComp>
                </Spin>                 
            }
            </div>
        )
    }   
 }