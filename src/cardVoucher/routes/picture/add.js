import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AddPicComp from 'cardVoucher/components/picture/add'
import { addCardVoucherPhotos } from 'cardVoucher/actions/index'

import { uploadFile } from  'Application/actions/index'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 添加 
 */

 @connect(
 	({ cardVoucherPic,application }) => ({
 		acname:cardVoucherPic.get('acname'),
 		pending:cardVoucherPic.get('pending'),
 		assetsUrl: application.getIn(['user', 'assets_domain'])
 	}),

 	dispatch => ({
 		actions: bindActionCreators({ addCardVoucherPhotos, uploadFile }, dispatch)
 	})	
 )

 export default class addPicRoute extends React.Component {
 	state ={
 		loading: true,
 		addLoading: false,
 		fileLoading: false
 	}

 	@autoLoading.bind(this, 'addLoading')
 	addCardVoucherPhotos() {
 		return this.props.actions.addCardVoucherPhotos(...arguments)
 	}

 	@autoLoading.bind(this, 'fileLoading')
 	uploadFile() {
 		return this.props.actions.uploadFile(...arguments)
 	}

    render() {
   		return (
   			<div>
   			{this.props.children? this.props.children:
				<Spin spinning={this.props.pending}>
					<AddPicComp
						{...this.props}
						{...this.state}
						actions={{
							addCardVoucherPhotos: ::this.addCardVoucherPhotos,
							uploadFile: ::this.uploadFile
						}}
					>
					</AddPicComp>
				</Spin>   				
   			}
   			</div>
   		)
    } 	
 }


