import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/prize_rule/list'
import { 
	fetchPrizeRuleList,
	addPrizeRuleList,
	delPrizeRuleList,
	updatePrizeRuleList,
	fetchPrizeRuleEditSelect
	 } from 'activity/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityPrizeRule }) => ({ 
		content: activityPrizeRule.get('content'),
		params: activityPrizeRule.get('params'),
		pending:  activityPrizeRule.get('pending'),
		select: activityPrizeRule.get('select')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchPrizeRuleList, addPrizeRuleList, delPrizeRuleList, updatePrizeRuleList, fetchPrizeRuleEditSelect }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
		selectLoading: false
	}
	static storeName = 'activityPrizeRule'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchPrizeRuleList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchPrizeRuleList() {
		return this.props.actions.fetchPrizeRuleList(...arguments)
	}

	@autoLoading
	delPrizeRuleList() {
		return this.props.actions.delPrizeRuleList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addPrizeRuleList() {
		return this.props.actions.addPrizeRuleList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updatePrizeRuleList() {
		return this.props.actions.updatePrizeRuleList(...arguments)
	}

	@autoLoading.bind(this, 'loading')
	fetchPrizeRuleEditSelect() {
		return this.props.actions.fetchPrizeRuleEditSelect(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<GroupComp
					{...this.props}
					{...this.state}
					actions={{
						fetchPrizeRuleList: ::this.fetchPrizeRuleList,
						delPrizeRuleList: ::this.delPrizeRuleList,
						addPrizeRuleList: ::this.addPrizeRuleList,
						updatePrizeRuleList: ::this.updatePrizeRuleList,
						fetchPrizeRuleEditSelect: ::this.fetchPrizeRuleEditSelect
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
		)
	}
}