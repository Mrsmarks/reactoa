import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import CustomMenuComp from 'wechat/components/custom_menu/list'
import autoLoading from 'Application/decorators/autoLoading'
import { 
	fetchCustomMenuList,
	addCustomMenuList,
	delCustomMenuList,
	updateCustomMenuList
 } from 'wechat/actions'

/**
 * 微信－个性化菜单－列表页路由
 */

@connect(
	({ wechatCustomMenu }) => ({ 
		content: wechatCustomMenu.get('content'),
		params: wechatCustomMenu.get('params'),
		pending:  wechatCustomMenu.get('pending'),
		error: wechatCustomMenu.get('error')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCustomMenuList, addCustomMenuList, delCustomMenuList, updateCustomMenuList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false
	}
	static storeName = 'wechatCustomMenu'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCustomMenuList({ ...props.location.query }))
		])
	}
	@autoLoading.bind(this, 'loading')
	fetchCustomMenuList() {
		return this.props.actions.fetchCustomMenuList( ...arguments )
	}

	@autoLoading.bind(this, 'addLoading')
	addCustomMenuList() {
		return this.props.actions.addCustomMenuList( ...arguments )
	}

	@autoLoading.bind(this, 'updateLoading')
	updateCustomMenuList() {
		return this.props.actions.updateCustomMenuList( ...arguments )
	}

	@autoLoading
	delCustomMenuList() {
		return this.props.actions.delCustomMenuList( ...arguments )
	}

	render() {
		const wechatCustomMenu = this.props.wechatCustomMenu
		return (
			<div>
				{this.props.children? this.props.children:
				<Spin spinning={this.props.pending}>
					<CustomMenuComp
						{...this.props}
						{...this.state}
						actions={{
							fetchCustomMenuList: ::this.fetchCustomMenuList,
							addCustomMenuList: ::this.addCustomMenuList,
							updateCustomMenuList: ::this.updateCustomMenuList,
							delCustomMenuList: ::this.delCustomMenuList
						}} 
					></CustomMenuComp>
				</Spin>}
			</div>
		)
	}
}