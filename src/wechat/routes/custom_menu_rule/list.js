import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import CustomMenuRuleComp from 'wechat/components/custom_menu_rule/list'
import autoLoading from 'Application/decorators/autoLoading'
import { 
	fetchCustomMenuRuleList,
	addCustomMenuRuleList,
	delCustomMenuRuleList,
	updateCustomMenuRuleList,
	fetchCityList,
	syncCustomMenuRule,
	delSyncCustomMenuRule
	 } from 'wechat/actions'


/**
 * 微信－个性化菜单规则－列表页路由
 */

@connect(
	({ wechatCustomMenuRule }) => ({ 
		content: wechatCustomMenuRule.get('content'),
		params: wechatCustomMenuRule.get('params'),
		select: wechatCustomMenuRule.get('select'),
		cityList: wechatCustomMenuRule.get('cityList'),
		pending: wechatCustomMenuRule.get('pending'),
		error: wechatCustomMenuRule.get('error')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCustomMenuRuleList, addCustomMenuRuleList, delCustomMenuRuleList, updateCustomMenuRuleList, fetchCityList, syncCustomMenuRule, delSyncCustomMenuRule }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false
	}

	static storeName = 'wechatCustomMenuRule'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCustomMenuRuleList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchCustomMenuRuleList() {
		return this.props.actions.fetchCustomMenuRuleList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addCustomMenuRuleList() {
		return this.props.actions.addCustomMenuRuleList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateCustomMenuRuleList() {
		return this.props.actions.updateCustomMenuRuleList(...arguments)
	}

	@autoLoading
	syncCustomMenuRule() {
		return this.props.actions.syncCustomMenuRule(...arguments)
	}

	@autoLoading
	delSyncCustomMenuRule() {
		return this.props.actions.delSyncCustomMenuRule(...arguments)
	}

	@autoLoading
	delCustomMenuRuleList() {
		return this.props.actions.delCustomMenuRuleList(...arguments)
	}

	fetchCityList() {
		return this.props.actions.fetchCityList(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children:
					<Spin spinning={this.props.pending}>
						<CustomMenuRuleComp
						{...this.props}
						{...this.state}
						actions={{
							fetchCustomMenuRuleList: ::this.fetchCustomMenuRuleList,
							addCustomMenuRuleList: ::this.addCustomMenuRuleList,
							updateCustomMenuRuleList: ::this.updateCustomMenuRuleList,
							delCustomMenuRuleList: ::this.delCustomMenuRuleList,
							fetchCityList: ::this.fetchCityList,
							syncCustomMenuRule: ::this.syncCustomMenuRule,
							delSyncCustomMenuRule: ::this.delSyncCustomMenuRule

						}} 
						></CustomMenuRuleComp>
					</Spin>
				}
			</div>
		)
	}
}