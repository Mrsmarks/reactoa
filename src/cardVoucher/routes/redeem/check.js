import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CheckRedeemComp from 'cardVoucher/components/redeem/check'

import { checkCardVoucherRedeem } from 'cardVoucher/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 卡卷兑换查看 
 */

 @connect(
    ({ redeemlist,application }) => ({
      content: redeemlist.get('content'),
      params: redeemlist.get('params'),
      pending:  redeemlist.get('pending'),
      selectData: redeemlist.get('selectData'),
      info: redeemlist.get('info') 
    }),

    dispatch => ({
      actions: bindActionCreators({ checkCardVoucherRedeem }, dispatch)
    })  
 )

 export default class checkRedeemRoute extends React.Component {
    state = {
      loading: true,
      checkLoading: false,
      listLoading: false
    }

    static storeName = 'redeemlist'
    static fillStore(redux, props) {
      return Promise.all([
        redux.dispatch(checkCardVoucherRedeem({ ...props.location.query }))
      ])
  }

    render() {
      return (
        <Spin spinning={this.props.pending}>
          <CheckRedeemComp
            {...this.props}
            {...this.state}
          >
          </CheckRedeemComp>
        </Spin>           
      )
    }   
 }