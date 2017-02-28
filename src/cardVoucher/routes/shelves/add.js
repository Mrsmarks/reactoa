import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AddPicComp from 'cardVoucher/components/shelves/add'
import { addCardVoucherQrcode, fetchCardVoucherQrcodeSelector } from 'cardVoucher/actions/index'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 添加 
 */
console.log(addCardVoucherQrcode)
 @connect(
 	({ cardVoucherQrcode,application }) => ({
        select:cardVoucherQrcode.get('select'),
        pending:cardVoucherQrcode.get('pending')
 	}),

 	dispatch => ({
 		actions: bindActionCreators({addCardVoucherQrcode, fetchCardVoucherQrcodeSelector }, dispatch)
 	})	
 )

 export default class addPicRoute extends React.Component {
 	state ={
 		loading: false,
 		addLoading: false,
 		fileLoading: false
 	}
    static fillStore(redux, props) {
        return Promise.all([
            redux.dispatch(fetchCardVoucherQrcodeSelector())
        ])
    }
    @autoLoading.bind(this, 'addLoading')
    fetchCardVoucherQrcodeSelector(){
        return this.props.actions.fetchCardVoucherQrcodeSelector(...arguments)
    }
    addCardVoucherQrcode() {
        return this.props.actions.addCardVoucherQrcode(...arguments)
    }
    render() {
   		return (
   			<div>
				<Spin spinning={this.props.pending}>
					<AddPicComp
						{...this.props}
						{...this.state}
						actions={{
                            addCardVoucherQrcode: ::this.addCardVoucherQrcode,
							fetchCardVoucherQrcodeSelector: ::this.fetchCardVoucherQrcodeSelector
						}}
					>
					</AddPicComp>
				</Spin>   				
   			</div>
   		)
    } 	
 }


