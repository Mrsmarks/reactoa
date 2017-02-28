import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AddPicComp from 'cardVoucher/components/route/add'
import { addCardVoucherRoute, fetchCardVoucherCardList } from 'cardVoucher/actions/index'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 添加 
 */

 @connect(
 	({ cardVoucherRoute,application }) => ({
 		pending:cardVoucherRoute.get('pending'),
 		assetsUrl: application.getIn(['user', 'assets_domain']),
        content:cardVoucherRoute.get('cardList'),
        params: cardVoucherRoute.get('params')
 	}),

 	dispatch => ({
 		actions: bindActionCreators({addCardVoucherRoute, fetchCardVoucherCardList }, dispatch)
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
            redux.dispatch(fetchCardVoucherCardList({ page:1,psize:10 }))
        ])
    }
    @autoLoading.bind(this, 'addLoading')
    fetchCardVoucherCardList(){
        return this.props.actions.fetchCardVoucherCardList(...arguments)
    }
    addCardVoucherRoute() {
        return this.props.actions.addCardVoucherRoute(...arguments)
    }
    render() {
   		return (
   			<div>
				<Spin spinning={this.props.pending}>
					<AddPicComp
						{...this.props}
						{...this.state}
						actions={{
                            addCardVoucherRoute: ::this.addCardVoucherRoute,
							fetchCardVoucherCardList: ::this.fetchCardVoucherCardList
						}}
					>
					</AddPicComp>
				</Spin>   				
   			</div>
   		)
    } 	
 }


