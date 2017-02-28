import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CustomerManagementComp from 'wechat/components/customer_management/list'
import { 
	fetchCustomerManagementList,
	customerManagementSwitch
} from 'wechat/actions'
import autoLoading from 'Application/decorators/autoLoading'
import Spin from 'antd/lib/spin'
/**
 * 微信－客服管理－列表页路由
 */
@connect(
	({ wechatCustomerManagement }) => ({ 
		content: wechatCustomerManagement.get('content'),
		wait: wechatCustomerManagement.get('wait'),
		params: wechatCustomerManagement.get('params'),
		pending: wechatCustomerManagement.get('pending'),
		error: wechatCustomerManagement.get('error')
	}),
	dispatch => ({
		actions: bindActionCreators({ 
			fetchCustomerManagementList,
			customerManagementSwitch
		}, dispatch)
	})
)
export default class CustomerMsgCompRoute extends React.Component {

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCustomerManagementList({ ...props.location.query }))
		])
	}

	static storeName = 'wechatCustomerManagement'
	
	state = {
		listLoading: false,
		updateLoading: false
	}


	@autoLoading.bind(this, 'listLoading')
	fetchCustomerManagementList() {
		return this.props.actions.fetchCustomerManagementList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	customerManagementSwitch() {
		return this.props.actions.customerManagementSwitch(...arguments)
	}
	
	render() {
		return (
			<Spin spinning={this.props.pending}>
				{this.props.children? this.props.children: 
				<CustomerManagementComp
					{...this.props}
					{...this.state}
					actions={{
						fetchCustomerManagementList: ::this.fetchCustomerManagementList,
						customerManagementSwitch: ::this.customerManagementSwitch
					}}
				/>}
			</Spin>
		)
	}
}