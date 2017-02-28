import React, { PropTypes } from 'React'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import WhitelistComp from 'cardVoucher/components/whitelist/list'
import { fetchCardVoucherWhite, delCardVoucherWhite, getStatusSelectWhite } from 'cardVoucher/actions'
import { uploadExcelFile } from  'Application/actions'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统--
 * 
 */
 @connect(
	({ whitelist, application }) => ({ 
		content: whitelist.get('content'),
		params: whitelist.get('params'),
		pending:  whitelist.get('pending'),
		selectData: whitelist.get('selectData'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCardVoucherWhite, getStatusSelectWhite, delCardVoucherWhite, uploadExcelFile }, dispatch)
	})
)


export default class WhitelistCompRoute extends React.Component {
	state = {
		loading: false,
		delLoading: false,
		listLoading:false
	}

	static storeName = 'whitelist'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCardVoucherWhite({ ...props.location.query })),
			redux.dispatch(getStatusSelectWhite())
		])
	}

	@autoLoading.bind(this,'loading')
	fetchCardVoucherWhite(){
		return this.props.actions.fetchCardVoucherWhite(...arguments)
	}

	@autoLoading.bind(this,'delLoading')
	delCardVoucherWhite() {
		return this.props.actions.delCardVoucherWhite(...arguments)
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
					<WhitelistComp
						{...this.props}
						{...this.state}
						actions={{
							fetchCardVoucherWhite: ::this.fetchCardVoucherWhite,
							delCardVoucherWhite: ::this.delCardVoucherWhite,
							uploadExcelFile: ::this.uploadExcelFile
						}}
					>
					</WhitelistComp>
				</Spin>
			}
			</div>			
		)
	}
} 