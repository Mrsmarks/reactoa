import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'
import { 
	MessageAduitList, 
	BlackNameList,
	passAduit,
	unPassAduit,
	unMessageAduit,
	aduitItems,
	unBanAduit,
	updateMessageAduitSetting } from 'wechatWall/actions/wall-details/screen-ctrl/action'
import MessageAduitComp from 'wechatWall/components/wall-details/screen-ctrl/messageAduit/index'

/**
 * 微信墙－大屏幕控制－路由
 */

@connect(
	({ wallDetailMessageAduit, application }) => ({ 
		option: wallDetailMessageAduit.get('option'),
		aduitList: wallDetailMessageAduit.getIn(['content', 'aduit', 'list']),
		msg_auth: wallDetailMessageAduit.get('msg_auth'),
		msg_sensitive: wallDetailMessageAduit.get('msg_sensitive'),
		aduitParams: wallDetailMessageAduit.getIn(['content', 'aduit', 'params']),
		wallList: wallDetailMessageAduit.getIn(['content', 'wall', 'list']),
		wallParams: wallDetailMessageAduit.getIn(['content', 'wall', 'params']),
		wallSelect: wallDetailMessageAduit.getIn(['content', 'wall', 'select']),
		unpassList: wallDetailMessageAduit.getIn(['content', 'unpass', 'list']),
		unpassSelect: wallDetailMessageAduit.getIn(['content', 'unpass', 'select']),
		unpassParams: wallDetailMessageAduit.getIn(['content', 'unpass', 'params']),
		nameList: wallDetailMessageAduit.getIn(['content', 'nameList', 'list']),
		nameParams: wallDetailMessageAduit.getIn(['content', 'nameList', 'params']),
		pending:  wallDetailMessageAduit.get('pending'),
		listType: wallDetailMessageAduit.get('listType'),
		assetsUrl: application.getIn(['user', 'assets_domain']),
	}), 
	dispatch => ({
		actions: bindActionCreators({ MessageAduitList, BlackNameList, passAduit, unPassAduit, unMessageAduit, unBanAduit, aduitItems, updateMessageAduitSetting }, dispatch)
	})
)

export default class GuestCompRoute extends React.Component {

	state = {
		auditLoading: false,
		nameListLoading: false,
		updateLoading: false
	}
	static storeName = 'wallDetailMessageAduit'
	static fillStore(redux, props) {
		const id = props.location.query.id
		const item = props.location.query.item || 'aduit'
		var auth_status = ''
		switch(item) {
			case 'aduit':
			auth_status = 0
			break
			case 'wall': 
			auth_status = 1
			break
			case 'unpass':
			auth_status = 2
			break
			defalut:
			auth_status = 0
		}
		const func = item != 'nameList'? MessageAduitList({id, item, auth_status}): BlackNameList({id, item})
		return Promise.all([
			redux.dispatch(func)
		])
	}

	@autoLoading.bind(this, 'auditLoading')
	MessageAduitList() {
		return this.props.actions.MessageAduitList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateMessageAduitSetting() {
		return this.props.actions.updateMessageAduitSetting(...arguments)
	}

	@autoLoading.bind(this, 'nameListLoading')
	BlackNameList() {
		return this.props.actions.BlackNameList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	passAduit() {
		return this.props.actions.passAduit(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	aduitItems() {
		return this.props.actions.aduitItems(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	unPassAduit() {
		return this.props.actions.unPassAduit(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	unMessageAduit() {
		return this.props.actions.unMessageAduit(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	unBanAduit() {
		return this.props.actions.unBanAduit(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
					<Spin spinning={this.props.pending}>
						<MessageAduitComp 
							{...this.props}
							{...this.state}
							actions={{
								MessageAduitList: ::this.MessageAduitList,
								BlackNameList: ::this.BlackNameList,
								passAduit: ::this.passAduit,
								unPassAduit: ::this.unPassAduit,
								unMessageAduit: ::this.unMessageAduit,
								unBanAduit: ::this.unBanAduit,
								aduitItems: ::this.aduitItems,
								updateMessageAduitSetting: ::this.updateMessageAduitSetting
							}}
						/>
					</Spin>
				}
			</div>
		)
	}
}