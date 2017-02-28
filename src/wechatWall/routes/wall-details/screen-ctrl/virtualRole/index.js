import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
import { 
	getVirtualRoleList,
	updateVirtualRole,
	delVirtualRole,
	sendVirtualMessage,
	getMessageList
	 } from 'wechatWall/actions/wall-details/screen-ctrl/action'
import { uploadFile } from  'Application/actions'

import VirtualComp from 'wechatWall/components/wall-details/screen-ctrl/virtualRole/index'

/**
 * 微信墙－虚拟角色－路由
 */

@connect(
	({ wallDetailVirtual, application }) => ({ 
		content: wallDetailVirtual.get('content'),
		params: wallDetailVirtual.get('params'),
		pending:  wallDetailVirtual.get('pending'),
		option: wallDetailVirtual.get('option'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ getVirtualRoleList, updateVirtualRole, delVirtualRole, sendVirtualMessage, getMessageList, uploadFile }, dispatch)
	})
)

export default class GuestCompRoute extends React.Component {

	state = {
		loading: false,
		messageList: false,
		updateLoading: false,
		uploadLoading: false
	}
	static storeName = 'wallDetailVirtual'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(getVirtualRoleList({ ...props.location.query })),
			// redux.dispatch(MessageAduitList({ ...props.location.query })),
		])
	}

	@autoLoading.bind(this, 'loading')
	getVirtualRoleList() {
		return this.props.actions.getVirtualRoleList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateVirtualRole() {
		return this.props.actions.updateVirtualRole(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	delVirtualRole() {
		return this.props.actions.delVirtualRole(...arguments)
	}

	@autoLoading
	sendVirtualMessage() {
		return this.props.actions.sendVirtualMessage(...arguments)
	}

	@autoLoading.bind(this, 'uploadLoading')
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading.bind(this, 'messageList')
	getMessageList() {
		return this.props.actions.getMessageList(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<VirtualComp 
						{...this.props}
						{...this.state}
						actions={{
							getVirtualRoleList: ::this.getVirtualRoleList,
							updateVirtualRole: ::this.updateVirtualRole,
							delVirtualRole: ::this.delVirtualRole,
							sendVirtualMessage: ::this.sendVirtualMessage,
							getMessageList: ::this.getMessageList,
							uploadFile: ::this.uploadFile
						}}
					/>
				</Spin>
				}
			</div>
		)
	}
}