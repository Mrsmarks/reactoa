
import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/stats_log/list'
import { 
	fetchStatsLogList
	 } from 'activity/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityStatsLog, application }) => ({ 
		content: activityStatsLog.get('content'),
		data: activityStatsLog.get('data'),
		params: activityStatsLog.get('params'),
		pending:  activityStatsLog.get('pending'),
		select: activityStatsLog.get('select'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchStatsLogList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
	}
	static storeName = 'activityStatsLog'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchStatsLogList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchStatsLogList() {
		return this.props.actions.fetchStatsLogList(...arguments)
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
						fetchStatsLogList: ::this.fetchStatsLogList,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
		)
	}
}