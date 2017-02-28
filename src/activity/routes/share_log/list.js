
import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/share_log/list'
import { 
	fetchShareLogList
	 } from 'activity/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityShareLog }) => ({ 
		content: activityShareLog.get('content'),
		params: activityShareLog.get('params'),
		pending:  activityShareLog.get('pending'),
		select: activityShareLog.get('select')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchShareLogList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
	}
	static storeName = 'activityShareLog'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchShareLogList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchShareLogList() {
		return this.props.actions.fetchShareLogList(...arguments)
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
						fetchShareLogList: ::this.fetchShareLogList,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
		)
	}
}