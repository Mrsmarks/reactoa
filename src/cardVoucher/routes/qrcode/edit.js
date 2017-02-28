import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import EditPicComp from 'cardVoucher/components/qrcode/edit'

import { checkCardVoucherQrcode, updateCardVoucherQrcode, fetchCardVoucherQrcodeSelector } from 'cardVoucher/actions'


import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 修改 
 */

 @connect(
 	({ cardVoucherQrcode,application }) => ({
      pending:cardVoucherQrcode.get('pending'),
      info: cardVoucherQrcode.get('info'),
      select: cardVoucherQrcode.get('select')
 	}),

 	dispatch => ({
 		actions: bindActionCreators({checkCardVoucherQrcode, fetchCardVoucherQrcodeSelector,updateCardVoucherQrcode }, dispatch)
 	})	
 )

 export default class editPicRoute extends React.Component {
 	state = {
 		loading: true,
 		fileLoading: false,
 		updateLoading: false,
 		checkLoading: false
 	}

    static storeName = 'cardVoucherQrcode'
      static fillStore(redux, props) {
        return Promise.all([
            redux.dispatch(checkCardVoucherQrcode({ ...props.location.query })),
            redux.dispatch(fetchCardVoucherQrcodeSelector())
        ])
    }

 	@autoLoading.bind(this, 'updateLoading')
    fetchCardVoucherQrcodeSelector(){
        return this.props.actions.fetchCardVoucherQrcodeSelector(...arguments)
    }
 	updateCardVoucherQrcode() {
 		return this.props.actions.updateCardVoucherQrcode(...arguments)
 	}

    render() {
   		return (
   			<div>
   			{this.props.children? this.props.children:
				<Spin spinning={this.props.pending}>
					<EditPicComp
						{...this.props}
						{...this.state}
						actions={{
							updateCardVoucherQrcode: ::this.updateCardVoucherQrcode,
              fetchCardVoucherQrcodeSelector: ::this.fetchCardVoucherQrcodeSelector
						}}
					>
					</EditPicComp>
				</Spin>   				
   			}
   			</div>
   		)
    } 	
 }


