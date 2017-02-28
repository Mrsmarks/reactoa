import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CustomerSendMessageComp from 'wechat/components/customer_send_message/list'
import { 
	fetchCustomerSendMessageList,
	fetchCustomerMsgSelect,
	sendCustomerMsg,
	deleteCustomerMsg
} from 'wechat/actions'
import autoLoading from 'Application/decorators/autoLoading'
import Spin from 'antd/lib/spin'
/**
 * 微信－客服发送消息－列表页路由
 */

@connect(
	({ wechatCustomerSendMessage }) => ({ 
		content: wechatCustomerSendMessage.get('content'),
		params: wechatCustomerSendMessage.get('params'),
		selectData: wechatCustomerSendMessage.get('selectData'),
		pending: wechatCustomerSendMessage.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ 
			fetchCustomerSendMessageList,
			fetchCustomerMsgSelect,
			sendCustomerMsg,
			deleteCustomerMsg
		}, dispatch)
	})
)

export default class CustomerMsgCompRoute extends React.Component {

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCustomerSendMessageList({ ...props.location.query })),
			redux.dispatch(fetchCustomerMsgSelect())
		])
	}

	state = {
		listLoading: false,
		modalLoading: false
	}

	@autoLoading.bind(this, 'listLoading')
	fetchCustomerMsgList() {
		return this.props.actions.fetchCustomerSendMessageList(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	sendCustomerMsg() {
		return this.props.actions.sendCustomerMsg(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	deleteCustomerMsg() {
		return this.props.actions.deleteCustomerMsg(...arguments)
	}

	render() {
		const wechatCustomerSendMessage = this.props.wechatCustomerSendMessage
		return (
			<Spin spinning={this.props.pending}>
				{this.props.children? this.props.children: 
				<CustomerSendMessageComp
					{...this.props}
					{...this.state}
					actions={{
						fetchCustomerMsgList: ::this.fetchCustomerMsgList,
						sendCustomerMsg: ::this.sendCustomerMsg,
						deleteCustomerMsg: ::this.deleteCustomerMsg
					}} 
				/>}
			</Spin>
		)
	}
}