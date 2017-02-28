import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CheckPicComp from 'cardVoucher/components/route/check'

import { checkCardVoucherRoute, fetchCardVoucherCardList } from 'cardVoucher/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 查看 
 */

 @connect(
   	({ cardVoucherRoute,application }) => ({
   		name:cardVoucherRoute.get('name'),
   		pending:cardVoucherRoute.get('pending'),
   		assetsUrl: application.getIn(['user', 'assets_domain']),
   		info: cardVoucherRoute.get('info'),
      cardList:cardVoucherRoute.get('cardList'),
   	}),

   	dispatch => ({
   		actions: bindActionCreators({checkCardVoucherRoute, fetchCardVoucherCardList }, dispatch)
   	})	
 )

 export default class checkPicRoute extends React.Component {
    state = {
   		loading: true,
   		checkLoading: false
    }

    static storeName = 'cardVoucherRoute'
 	  static fillStore(redux, props) {
   		return Promise.all([
        redux.dispatch(checkCardVoucherRoute({ ...props.location.query })),
   			redux.dispatch(fetchCardVoucherCardList({ page:'',psize:'' }))
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


