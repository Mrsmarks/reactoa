import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CheckPicComp from 'cardVoucher/components/qrcode/check'

import { checkCardVoucherQrcode, fetchCardVoucherQrcodeSelector } from 'cardVoucher/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 查看 
 */

 @connect(
   	({ cardVoucherQrcode,application }) => ({
   		pending:cardVoucherQrcode.get('pending'),
   		info: cardVoucherQrcode.get('info'),
      select: cardVoucherQrcode.get('select')
   	}),

   	dispatch => ({
   		actions: bindActionCreators({checkCardVoucherQrcode, fetchCardVoucherQrcodeSelector }, dispatch)
   	})	
 )

 export default class checkPicRoute extends React.Component {
    state = {
   		loading: true,
   		checkLoading: false
    }

    static storeName = 'cardVoucherQrcode'
 	  static fillStore(redux, props) {
   		return Promise.all([
        redux.dispatch(checkCardVoucherQrcode({ ...props.location.query })),
   			redux.dispatch(fetchCardVoucherQrcodeSelector())
   		])
 	}

    render() {
   		return (
				<Spin spinning={this.props.pending}>
					<CheckPicComp
						{...this.props}
						{...this.state}
					>
					</CheckPicComp>
				</Spin>   				
   		)
    } 	
 }


