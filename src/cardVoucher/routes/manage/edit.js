import React, { PropTypes } from 'React'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ManageEditComp from 'cardVoucher/components/manage/edit'
import { fetchCardVoucherPhotos, delCardVoucherPhotos } from 'cardVoucher/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统--卡券管理路由
 */
//  @connect(
//     ({ cardVoucherManage, application }) => ({ 
//         assetsUrl: application.getIn(['user', 'assets_domain'])
//     }),
//     dispatch => ({
//         actions: bindActionCreators({ fetchCardVoucherPhotos, delCardVoucherPhotos }, dispatch)
//     })
// )
export default class ManageEditCompRoute extends React.Component {
    state = {
        loading: false,
        delLoading: false
    }

    static storeName = 'cardVoucherManage'
    static fillStore(redux, props) {
        return Promise.all([
            redux.dispatch(fetchCardVoucherPhotos({ page:1,psize:10 }))
        ])
    }

    @autoLoading.bind(this,'loading')
    fetchCardVoucherPhotos(){
        return this.props.actions.fetchCardVoucherPhotos(...arguments)
    }

    @autoLoading.bind(this,'delLoading')
    delCardVoucherPhotos() {
        return this.props.actions.delCardVoucherPhotos(...arguments)
    }

    render(){
        return(
            <div>
            {this.props.children? this.props.children:
                <Spin spinning={false && this.props.pending}>
                    <ManageEditComp
                        {...this.props}
                        {...this.state}
                        actions={{
                            fetchCardVoucherPhotos: ::this.fetchCardVoucherPhotos,
                            delCardVoucherPhotos: ::this.delCardVoucherPhotos
                        }}
                    >
                    </ManageEditComp>
                </Spin>
            }
            </div>          
        )
    }
} 