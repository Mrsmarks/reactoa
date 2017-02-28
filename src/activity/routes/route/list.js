import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/route/list'
import { 
	fetchRouteList,
	delRouteList
	 } from 'activity/actions'
import { uploadFile } from  'Application/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityRoute }) => ({ 
		content: activityRoute.get('content'),
		params: activityRoute.get('params'),
		pending:  activityRoute.get('pending'),
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchRouteList, delRouteList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
	}
	static storeName = 'activityRoute'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchRouteList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchRouteList() {
		return this.props.actions.fetchRouteList(...arguments)
	}

	@autoLoading
	delRouteList() {
		return this.props.actions.delRouteList(...arguments)
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
						fetchRouteList: ::this.fetchRouteList,
						delRouteList: ::this.delRouteList
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}