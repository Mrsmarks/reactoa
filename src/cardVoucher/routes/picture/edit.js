import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import EditPicComp from 'cardVoucher/components/picture/edit'

import { updateCardVoucherPhotos, checkCardVoucherPhotos } from 'cardVoucher/actions'

import { uploadFile } from  'Application/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 修改 
 */

 @connect(
 	({ cardVoucherPic,application }) => ({
 		pending:cardVoucherPic.get('pending'),
 		assetsUrl: application.getIn(['user', 'assets_domain']),
 		info: cardVoucherPic.get('info') 
 	}),

 	dispatch => ({
 		actions: bindActionCreators({ updateCardVoucherPhotos, uploadFile }, dispatch)
 	})	
 )

 export default class editPicRoute extends React.Component {
 	state = {
 		loading: false,
 		fileLoading: false,
 		updateLoading: false,
 		checkLoading: false
 	}

    static storeName = 'cardVoucherPic'
 	static fillStore(redux, props) {
 		return Promise.all([
 			redux.dispatch(checkCardVoucherPhotos({ ...props.location.query }))
 		])
 	}


 	@autoLoading.bind(this, 'fileLoading')
 	uploadFile() {
 		return this.props.actions.uploadFile(...arguments)
 	}

 	@autoLoading.bind(this, 'updateLoading')
 	updateCardVoucherPhotos() {
 		return this.props.actions.updateCardVoucherPhotos(...arguments)
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
							uploadFile: ::this.uploadFile,
							updateCardVoucherPhotos: ::this.updateCardVoucherPhotos
						}}
					>
					</EditPicComp>
				</Spin>   				
   			}
   			</div>
   		)
    } 	
 }


