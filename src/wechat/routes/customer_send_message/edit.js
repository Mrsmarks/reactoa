import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CustomerMsgEdit from 'wechat/components/customer_send_message/edit'
import autoLoading from 'Application/decorators/autoLoading'
import { 
	fetchCustomerMsgSelect,
	fetchCustomerMsgById,
	saveCustomerMsgData
} from 'wechat/actions'
import {
	uploadFile
} from 'Application/actions'
/**
 * 微信－菜单管理－添加主菜单
 */
@connect(
	({ wechatCustomerSendMessage, application }) => ({ 
		selectData: wechatCustomerSendMessage.get('selectData'),
		editData: wechatCustomerSendMessage.get('editData'),
		assets_domain: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ 
			fetchCustomerMsgSelect,
			uploadFile,
			saveCustomerMsgData
		}, dispatch)
	})
)
export default class CustomerMsgEditRoute extends React.Component {
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCustomerMsgById(props.location.query.id)),
			redux.dispatch(fetchCustomerMsgSelect())
		])
	}

	state = {
		saveLoading: false
	}

	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading.bind(this, 'saveLoading')
	saveCustomerMsgData() {
		return this.props.actions.saveCustomerMsgData(...arguments)
	}

	render() {
		return (
			<CustomerMsgEdit
				{...this.props}
				{...this.state}
				actions={{
					uploadFile: ::this.uploadFile,
					saveCustomerMsgData: ::this.saveCustomerMsgData
				}}
			/>
		)
	}
}
