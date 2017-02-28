import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/route/add'
import { 
	addRouteList,
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
		assetsUrl: application.getIn(['user', 'assets_domain']),
	}),
	dispatch => ({
		actions: bindActionCreators({ addRouteList, fetchRouteEditSelect }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		addLoading: false,
	}
	static storeName = 'activityRoute'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchRouteEditSelect({...props.location.query}))
		])
	}

	@autoLoading.bind(this, 'addLoading')
	addRouteList() {
		return this.props.actions.addRouteList(...arguments)
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
						addRouteList: ::this.addRouteList,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}