import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/prize/edit'
import { 
	updatePrizeList,
	addPrizeList,
	getPrizeDetail,
	addSupportList,
	addPrizeRuleList,
	fetchPrizeSelect,
	fetchPrizeRuleEditSelect
	 } from 'activity/actions'

import { uploadFile } from  'Application/actions'


import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityPrize, application }) => ({ 
		info: activityPrize.get('info'),
		select: activityPrize.get('select'),
		ruleOption: activityPrize.get('ruleOption'),
		pending: activityPrize.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain']),
		id: application.get('id')
	}),
	dispatch => ({
		actions: bindActionCreators({ updatePrizeList, getPrizeDetail, fetchPrizeSelect, fetchPrizeRuleEditSelect, addSupportList, addPrizeRuleList, uploadFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		updateLoading: false,
		singerLoading: false,
		addRuleLoading: false,
		addSupportLoading: false
	}
	static storeName = 'activityPrize'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(getPrizeDetail({ ...props.location.query })),
			redux.dispatch(fetchPrizeSelect()),
			redux.dispatch(fetchPrizeRuleEditSelect())
		])
	}

	// componentWillMount() {
	// 	const nextId = this.props.location.query.id
	// 	setTimeout(() => {
	// 			this.getPrizeDetail({ id: nextId })
	// 	}, 0)
	// }

	@autoLoading.bind(this, 'updateLoading')
	updatePrizeList() {
		return this.props.actions.updatePrizeList(...arguments)
	}

	@autoLoading.bind(this, 'singerLoading')
	getPrizeDetail() {
		return this.props.actions.getPrizeDetail(...arguments)
	}

	@autoLoading
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading.bind(this, 'addSupportLoading')
	addSupportList() {
		return this.props.actions.addSupportList(...arguments)
	}

	@autoLoading.bind(this, 'addRuleLoading')
	addPrizeRuleList() {
		return this.props.actions.addPrizeRuleList(...arguments)
	}

	@autoLoading
	fetchPrizeSelect() {
		return this.props.actions.fetchPrizeSelect(...arguments)
	}

	@autoLoading
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
						updatePrizeList: ::this.updatePrizeList,
						getPrizeDetail: ::this.getPrizeDetail,
						uploadFile: ::this.uploadFile,
						addSupportList: ::this.addSupportList,
						addPrizeRuleList: ::this.addPrizeRuleList,
						fetchPrizeSelect: ::this.fetchPrizeSelect,
						fetchPrizeRuleEditSelect: ::this.fetchPrizeRuleEditSelect,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}