import React, { PropTypes } from 'React'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import RedeemlistComp from 'cardVoucher/components/redeem/list'
import { fetchCardVoucherRedeem, delCardVoucherRedeem, getStatusSelectRedeem } from 'cardVoucher/actions'
import { uploadExcelFile } from  'Application/actions'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统--
 * 
 */
 @connect(
	({ redeemlist, application }) => ({ 
		content: redeemlist.get('content'),
		params: redeemlist.get('params'),
		pending:  redeemlist.get('pending'),
		selectData: redeemlist.get('selectData'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCardVoucherRedeem, getStatusSelectRedeem, delCardVoucherRedeem, uploadExcelFile }, dispatch)
	})
)


export default class RedeemCompRoute extends React.Component {
	state = {
		loading: false,
		delLoading: false,
		listLoading: false
	}

	static storeName = 'redeemlist'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCardVoucherRedeem({  ...props.location.query })),
			redux.dispatch(getStatusSelectRedeem())
		])
	}

	@autoLoading.bind(this,'loading')
	fetchCardVoucherRedeem(){
		return this.props.actions.fetchCardVoucherRedeem(...arguments)
	}

	@autoLoading.bind(this,'delLoading')
	delCardVoucherRedeem() {
		return this.props.actions.delCardVoucherRedeem(...arguments)
	}

	@autoLoading.bind(this, 'fileLoading')
	uploadExcelFile() {
		return this.props.actions.uploadExcelFile(...arguments)
	}

	render(){
		return(
			<div>
			{this.props.children? this.props.children:
				<Spin spinning={this.props.pending}>
					<RedeemlistComp
						{...this.props}
						{...this.state}
						actions={{
							fetchCardVoucherRedeem: ::this.fetchCardVoucherRedeem,
							delCardVoucherRedeem: ::this.delCardVoucherRedeem,
							uploadExcelFile: ::this.uploadExcelFile
						}}
					>
					</RedeemlistComp>
				</Spin>
			}
			</div>			
		)
	}
} 