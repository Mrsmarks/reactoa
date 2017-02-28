import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AddPicComp from 'cardVoucher/components/whitelist/add'
import { addCardVoucherWhite } from 'cardVoucher/actions'

import { fetchCardVoucherWhite } from  'Application/actions/index'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 
 * 白名单添加 
 */

 @connect(
    ({ whitelist }) => ({
        content: whitelist.get('content'),
        params: whitelist.get('params'),
        pending:  whitelist.get('pending'),
        selectData: whitelist.get('selectData'),
        info: whitelist.get('info')
    }),

    dispatch => ({
        actions: bindActionCreators({ addCardVoucherWhite, fetchCardVoucherWhite }, dispatch)
    })  
 )

 export default class addPicRoute extends React.Component {
    state ={
        loading: true,
        addLoading: false,
        listLoading:false,
        fileLoading: false
    }

    @autoLoading.bind(this, 'addLoading')
    addCardVoucherWhite() {
        return this.props.actions.addCardVoucherWhite(...arguments)
    }

    @autoLoading.bind(this, 'fileLoading')
    fetchCardVoucherWhite() {
        return this.props.actions.fetchCardVoucherWhite(...arguments)
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
                            addCardVoucherWhite: ::this.addCardVoucherWhite,
                            fetchCardVoucherWhite: ::this.fetchCardVoucherWhite
                        }}
                    >
                    </AddPicComp>
                </Spin>                 
            }
            </div>
        )
    }   
 }