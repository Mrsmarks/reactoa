import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/route/edit'
import { 
	updateRouteList,
	checkRouteList,
	fetchRouteEditSelect
	 } from 'activity/actions'
import { uploadFile } from  'Application/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityRoute, application }) => ({ 
		content: activityRoute.get('content'),
		params: activityRoute.get('params'),
		pending:  activityRoute.get('pending'),
		option: activityRoute.get('option'),
		info: activityRoute.get('info'),
		assetsUrl: application.getIn(['user', 'assets_domain']),
	}),
	dispatch => ({
		actions: bindActionCreators({ updateRouteList, checkRouteList, fetchRouteEditSelect }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		updateLoading: false,
		loading: false
	}
	static storeName = 'activityRoute'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(checkRouteList({ ...props.location.query })),
			redux.dispatch(fetchRouteEditSelect({...props.location.query}))
		])
	}

	@autoLoading.bind(this, 'updateLoading')
	updateRouteList() {
		return this.props.actions.updateRouteList(...arguments)
	}

	@autoLoading.bind(this, 'loading')
	checkRouteList() {
		return this.props.actions.checkRouteList(...arguments)
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
						updateRouteList: ::this.updateRouteList,
						checkRouteList: ::this.checkRouteList
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}