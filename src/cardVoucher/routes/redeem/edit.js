import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import EditRedeemComp from 'cardVoucher/components/redeem/edit'
import { updateCardVoucherRedeem, checkCardVoucherRedeem, getStatusSelectPullR } from 'cardVoucher/actions'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 卡卷修改
 */

 @connect(
  ({ redeemlist,application }) => ({
    content: redeemlist.get('content'),
        params: redeemlist.get('params'),
        pending:  redeemlist.get('pending'),
        selectData: redeemlist.get('selectData'),
        info: redeemlist.get('info') 
  }),

  dispatch => ({
    actions: bindActionCreators({ updateCardVoucherRedeem, getStatusSelectPullR }, dispatch)
  })  
 )

 export default class editRedeemListRoute extends React.Component {
  state = {
    loading: true,
    fileLoading: false,
    updateLoading: false,
    checkLoading: false,
    listLoading: false
  }

    static storeName = 'redeemlist'
  static fillStore(redux, props) {
    return Promise.all([
      redux.dispatch(checkCardVoucherRedeem({ ...props.location.query })),
      redux.dispatch(getStatusSelectPullR())
    ])
  }

  @autoLoading.bind(this, 'updateLoading')
    fetchCardVoucherRedeem(){
        return this.props.actions.fetchCardVoucherRedeem(...arguments)
    }

  @autoLoading.bind(this, 'updateLoading')
  updateCardVoucherRedeem() {
    return this.props.actions.updateCardVoucherRedeem(...arguments)
  }

    render() {
      return (
        <div>
          {this.props.children? this.props.children:
          <Spin spinning={this.props.pending}>
            <EditRedeemComp
              {...this.props}
              {...this.state}
              actions={{
                updateCardVoucherRedeem: ::this.updateCardVoucherRedeem,
                fetchCardVoucherRedeem: ::this.fetchCardVoucherRedeem
              }}
            >
            </EditRedeemComp>
          </Spin>           
        }
        </div>
      )
    }   
 }