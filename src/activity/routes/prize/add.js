import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/prize/add'
import { 
	addPrizeList,
	addSupportList,
	fetchPrizeSelect,
	fetchPrizeRuleEditSelect,
	addPrizeRuleList
	 } from 'activity/actions'

import { uploadFile } from  'Application/actions'


import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityPrize, application }) => ({ 
		select: activityPrize.get('select'),
		ruleOption: activityPrize.get('ruleOption'),
		pending: activityPrize.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ addPrizeList, addSupportList, fetchPrizeRuleEditSelect, fetchPrizeSelect, addPrizeRuleList, uploadFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		addLoading: false,
		addSupportLoading: false,
		addRuleLoading: false
	}
	static storeName = 'activityPrize'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchPrizeSelect()),
			redux.dispatch(fetchPrizeRuleEditSelect())
		])
	}

	@autoLoading.bind(this, 'addLoading')
	addPrizeList() {
		return this.props.actions.addPrizeList(...arguments)
	}

	@autoLoading
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading.bind(this, 'addSupportLoading')
	addSupportList() {
		return this.props.actions.addSupportList(...arguments)
	}

	@autoLoading
	fetchPrizeSelect() {
		return this.props.actions.fetchPrizeSelect(...arguments)
	}

	@autoLoading
	fetchPrizeRuleEditSelect() {
		return this.props.actions.fetchPrizeRuleEditSelect(...arguments)
	}

	@autoLoading.bind(this, 'addRuleLoading')
	addPrizeRuleList() {
		return this.props.actions.addPrizeRuleList(...arguments)
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
						addPrizeList: ::this.addPrizeList,
						uploadFile: ::this.uploadFile,
						addSupportList: ::this.addSupportList,
						fetchPrizeSelect: ::this.fetchPrizeSelect,
						fetchPrizeRuleEditSelect: ::this.fetchPrizeRuleEditSelect,
						addPrizeRuleList: ::this.addPrizeRuleList
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}