import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/rule/list'
import { 
	fetchRuleList,
	addRuleList,
	updateRuleList,
	delRuleList,
	fetchRuleEditSelect
	 } from 'activity/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityRule }) => ({ 
		content: activityRule.get('content'),
		params: activityRule.get('params'),
		pending:  activityRule.get('pending'),
		option: activityRule.get('option')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchRuleList, addRuleList, updateRuleList, delRuleList, fetchRuleEditSelect }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false
	}
	static storeName = 'activityRule'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchRuleList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchRuleList() {
		return this.props.actions.fetchRuleList(...arguments)
	}

	@autoLoading.bind(this, 'loading')
	fetchRuleEditSelect() {
		return this.props.actions.fetchRuleEditSelect(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addRuleList() {
		return this.props.actions.addRuleList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateRuleList() {
		return this.props.actions.updateRuleList(...arguments)
	}

	@autoLoading
	delRuleList() {
		return this.props.actions.delRuleList(...arguments)
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
						fetchRuleList: ::this.fetchRuleList,
						fetchRuleEditSelect: ::this.fetchRuleEditSelect,
						addRuleList: ::this.addRuleList,
						delRuleList: ::this.delRuleList,
						updateRuleList: ::this.updateRuleList
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}