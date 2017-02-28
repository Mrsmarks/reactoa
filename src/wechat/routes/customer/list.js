import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CustomerComp from 'wechat/components/customer/list'
import { fetchCustomerList, addCustomer, synchCustomer, removeCustomer } from 'wechat/actions'
import { uploadFile } from 'Application/actions'
import autoLoading from 'Application/decorators/autoLoading'
import Spin from 'antd/lib/spin'

/**
 * 微信－微信客服－列表页路由
 */

@connect(
	({ wechatCustomer, application }) => ({ 
		content: wechatCustomer.get('content'),
		params: wechatCustomer.get('params'),
		pending: wechatCustomer.get('pending'),
		wechat_account: application.get('publicList').filter(item => item.get('check') === 1).get(0).get('wechat_account'),
		assets_domain: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCustomerList, uploadFile, addCustomer, synchCustomer, removeCustomer }, dispatch)
	})
)

export default class CustomerCompRoute extends React.Component {

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCustomerList({ ...props.location.query }))
		])
	}

	state = {
		modalLoading: false,
		listLoading: false,
		synchLoading: false
	}

	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	fetchCustomerList() {
		return this.props.actions.fetchCustomerList(...arguments)
	}

	@autoLoading.bind(this, 'modalLoading')
	addCustomer() {
		return this.props.actions.addCustomer(...arguments)
	}

	
	@autoLoading.bind(this, 'synchLoading')
	synchCustomer() {
		return this.props.actions.synchCustomer(...arguments)
	}

	@autoLoading
	removeCustomer() {
		return this.props.actions.removeCustomer(...arguments)
	}

	render() {
		return (
			<Spin spinning={this.props.pending}>
				<CustomerComp
					{...this.props}
					{...this.state}
					actions={{
						uploadFile: ::this.uploadFile,
						addCustomer: ::this.addCustomer,
						fetchCustomerList: ::this.fetchCustomerList,
						synchCustomer: ::this.synchCustomer,
						removeCustomer: ::this.removeCustomer
					}} 
				/>
			</Spin>
		)
	}
}