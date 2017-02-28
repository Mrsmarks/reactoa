import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import EditWhiteComp from 'cardVoucher/components/whitelist/edit'
import { updateCardVoucherWhite, checkCardVoucherWhite, getStatusSelectPull } from 'cardVoucher/actions'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 卡卷修改
 */

 @connect(
  ({ whitelist,application }) => ({
    content: whitelist.get('content'),
        params: whitelist.get('params'),
        pending:  whitelist.get('pending'),
        selectData: whitelist.get('selectData'),
        info: whitelist.get('info')
  }),

  dispatch => ({
    actions: bindActionCreators({ updateCardVoucherWhite, getStatusSelectPull }, dispatch)
  })  
 )

 export default class editWhiteListRoute extends React.Component {
  state = {
    loading: true,
    fileLoading: false,
    updateLoading: false,
    checkLoading: false,
    listLoading: false
  }

    static storeName = 'whitelist'
  static fillStore(redux, props) {
    return Promise.all([
      redux.dispatch(checkCardVoucherWhite({ ...props.location.query })),
      redux.dispatch(getStatusSelectPull())
    ])
  }

  @autoLoading.bind(this, 'updateLoading')
  fetchCardVoucherWhite(){
      return this.props.actions.fetchCardVoucherWhite(...arguments)
  }

  @autoLoading.bind(this, 'updateLoading')
  updateCardVoucherWhite() {
    return this.props.actions.updateCardVoucherWhite(...arguments)
  }

    render() {
      return (
        <div>
          {this.props.children? this.props.children:
          <Spin spinning={this.props.pending}>
            <EditWhiteComp
              {...this.props}
              {...this.state}
              actions={{
                updateCardVoucherWhite: ::this.updateCardVoucherWhite,
                fetchCardVoucherWhite: ::this.fetchCardVoucherWhite
              }}
            >
            </EditWhiteComp>
          </Spin>           
        }
        </div>
      )
    }   
 }