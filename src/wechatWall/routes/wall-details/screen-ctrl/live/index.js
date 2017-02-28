import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'
import { 
	sendMessage,
	sendMessageAgain,
	fetchMessageList,
	delMessageList
	 } from 'wechatWall/actions/wall-details/screen-ctrl/action'
import LiveComp from 'wechatWall/components/wall-details/screen-ctrl/live/index'

/**
 * 微信墙－直播台－路由
 */

@connect(
	({ wallMessageList }) => ({ 
		content: wallMessageList.get('content'),
		params: wallMessageList.get('params'),
		pending:  wallMessageList.get('pending'),
	}),
	dispatch => ({
		actions: bindActionCreators({ sendMessage, sendMessageAgain, fetchMessageList, delMessageList }, dispatch)
	})
)

export default class GuestCompRoute extends React.Component {

	state = {
		loading: false,
		sendLoading: false
	}

	static storeName = 'wallMessageList'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchMessageList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchMessageList() {
		return this.props.actions.fetchMessageList(...arguments)
	}

	@autoLoading
	sendMessage() {
		return this.props.actions.sendMessage(...arguments)
	}

	@autoLoading
	sendMessageAgain() {
		return this.props.actions.sendMessageAgain(...arguments)
	}

	@autoLoading
	delMessageList() {
		return this.props.actions.delMessageList(...arguments)
	}


	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<LiveComp 
						{...this.props}
						{...this.state}
						actions={{
							fetchMessageList: ::this.fetchMessageList,
							sendMessage: ::this.sendMessage,
							sendMessageAgain: ::this.sendMessageAgain,
							delMessageList: ::this.delMessageList
						}}
					/>
				</Spin>
				}
			</div>
		)
	}
}