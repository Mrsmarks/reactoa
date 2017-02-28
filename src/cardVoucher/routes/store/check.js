import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CheckStorComp from 'cardVoucher/components/store/check'

import { checkStore } from 'cardVoucher/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 门店系统
 * 查看 门店路由
 */

  @connect(
 	({ storeLists, application }) => ({
 		pending: storeLists.get('pending'),
 		assetsUrl: application.getIn(['user', 'assets_domain']),
 		checkInfos: storeLists.get('checkInfos')
 	}),

 	dispatch => ({
 		actions: bindActionCreators({}, dispatch)
 	})
 )

 export default class checkStoreRoute extends React.Component {
 	state =	{
 		loading:false
 	}

 	static storeName = 'storeLists'
 	static fillStore(redux, props) {
 		return Promise.all([
 			redux.dispatch(checkStore({ ...props.location.query })) 			
 		])
 	}


 	render () {
 		return (
 			<div>
 			{
 				this.props.children? this.props.children:
 				<Spin spinning={this.props.pending}> 
 					<CheckStorComp
 						{...this.props}
 						{...this.state}
 					>
 					</CheckStorComp>
 				</Spin>
 			}
 			</div>
 		)
 	}

 }