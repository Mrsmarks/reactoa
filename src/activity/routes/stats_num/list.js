
import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/stats_num/list'
import { 
	fetchStatsNumList
	 } from 'activity/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityStatsNum, application }) => ({ 
		content: activityStatsNum.get('content'),
		params: activityStatsNum.get('params'),
		pending:  activityStatsNum.get('pending'),
		select: activityStatsNum.get('select'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchStatsNumList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
	}
	static storeName = 'activityStatsNum'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchStatsNumList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchStatsNumList() {
		return this.props.actions.fetchStatsNumList(...arguments)
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
						fetchStatsNumList: ::this.fetchStatsNumList,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
		)
	}
}