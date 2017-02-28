import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CheckPicComp from 'cardVoucher/components/picture/check'

import { checkCardVoucherPhotos } from 'cardVoucher/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 修改 
 */

 @connect(
 	({ cardVoucherPic,application }) => ({
 		acname:cardVoucherPic.get('acname'),
 		pending:cardVoucherPic.get('pending'),
 		assetsUrl: application.getIn(['user', 'assets_domain']),
 		info: cardVoucherPic.get('info') 
 	}),

 	dispatch => ({
 		actions: bindActionCreators({ }, dispatch)
 	})	
 )

 export default class checkPicRoute extends React.Component {
 	state = {
 		loading: true,
 		checkLoading: false
 	}

    static storeName = 'cardVoucherPic'
 	static fillStore(redux, props) {
 		return Promise.all([
 			redux.dispatch(checkCardVoucherPhotos({ ...props.location.query }))
 		])
 	}

    render() {
   		return (
   			<div>
   			{this.props.children? this.props.children:
				<Spin spinning={this.props.pending}>
					<CheckPicComp
						{...this.props}
						{...this.state}
					>
					</CheckPicComp>
				</Spin>   				
   			}
   			</div>
   		)
    } 	
 }


