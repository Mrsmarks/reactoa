
import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/user_prize/list'
import { 
	fetchUserPrizeList
	 } from 'activity/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityUserPrize, application }) => ({ 
		content: activityUserPrize.get('content'),
		params: activityUserPrize.get('params'),
		pending:  activityUserPrize.get('pending'),
		select: activityUserPrize.get('select'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchUserPrizeList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
	}
	static storeName = 'activityBlack'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchUserPrizeList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchUserPrizeList() {
		return this.props.actions.fetchUserPrizeList(...arguments)
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
						fetchUserPrizeList: ::this.fetchUserPrizeList,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
		)
	}
}