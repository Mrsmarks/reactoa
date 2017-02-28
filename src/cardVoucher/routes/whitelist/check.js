import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CheckWhiteComp from 'cardVoucher/components/whitelist/check'

import { checkCardVoucherWhite } from 'cardVoucher/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 白名单查看 
 */

 @connect(
    ({ whitelist,application }) => ({
      content: whitelist.get('content'),
      params: whitelist.get('params'),
      pending:  whitelist.get('pending'),
      selectData: whitelist.get('selectData'),
      info: whitelist.get('info') 
    }),

    dispatch => ({
      actions: bindActionCreators({ checkCardVoucherWhite }, dispatch)
    })  
 )

 export default class checkWhiteRoute extends React.Component {
    state = {
      loading: true,
      checkLoading: false,
      listLoading: false
    }

    static storeName = 'whitelist'
    static fillStore(redux, props) {
      return Promise.all([
        redux.dispatch(checkCardVoucherWhite({ ...props.location.query }))
      ])
  }

    render() {
      return (
        <Spin spinning={this.props.pending}>
          <CheckWhiteComp
            {...this.props}
            {...this.state}
          >
          </CheckWhiteComp>
        </Spin>           
      )
    }   
 }