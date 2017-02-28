import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import EditPicComp from 'cardVoucher/components/route/edit'

import { checkCardVoucherRoute, updateCardVoucherRoute, fetchCardVoucherCardList } from 'cardVoucher/actions'


import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 修改 
 */

 @connect(
 	({ cardVoucherRoute,application }) => ({
    pending:cardVoucherRoute.get('pending'),
    info: cardVoucherRoute.get('info'),
    cardList:cardVoucherRoute.get('cardList')
 	}),

 	dispatch => ({
 		actions: bindActionCreators({checkCardVoucherRoute, fetchCardVoucherCardList, updateCardVoucherRoute }, dispatch)
 	})	
 )

 export default class editPicRoute extends React.Component {
 	state = {
 		loading: true,
 		fileLoading: false,
 		updateLoading: false,
 		checkLoading: false
 	}

    static storeName = 'cardVoucherRoute'
      static fillStore(redux, props) {
        return Promise.all([
            redux.dispatch(checkCardVoucherRoute({ ...props.location.query })),
            redux.dispatch(fetchCardVoucherCardList({ page:'',psize:'' }))
        ])
    }

  fetchCardVoucherCardList(){
      return this.props.actions.fetchCardVoucherCardList(...arguments)
  }
 	@autoLoading.bind(this, 'updateLoading')
 	updateCardVoucherRoute() {
 		return this.props.actions.updateCardVoucherRoute(...arguments)
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
							updateCardVoucherRoute: ::this.updateCardVoucherRoute,
              fetchCardVoucherCardList: ::this.fetchCardVoucherCardList
						}}
					>
					</EditPicComp>
				</Spin>   				
   			}
   			</div>
   		)
    } 	
 }


