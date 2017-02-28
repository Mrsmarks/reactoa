import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/management/list'
import { 
	fetchManagementList,
	fetchManagementEditSelect,
	addManagementList,
	delManagementList,
	updateManagementList
	 } from 'activity/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityManagement }) => ({ 
		content: activityManagement.get('content'),
		params: activityManagement.get('params'),
		pending:  activityManagement.get('pending'),
		editSelect: activityManagement.get('editSelect'),
		option: activityManagement.get('option')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchManagementList, fetchManagementEditSelect, addManagementList, delManagementList, updateManagementList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		selectLoading: false,
		addLoading: false
	}
	static storeName = 'activityManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchManagementList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchManagementList() {
		return this.props.actions.fetchManagementList(...arguments)
	}

	@autoLoading.bind(this, 'loading')
	fetchManagementEditSelect() {
		return this.props.actions.fetchManagementEditSelect(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addManagementList() {
		return this.props.actions.addManagementList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateManagementList() {
		return this.props.actions.updateManagementList(...arguments)
	}

	@autoLoading
	delManagementList() {
		return this.props.actions.delManagementList(...arguments)
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
						fetchManagementList: ::this.fetchManagementList,
						fetchManagementEditSelect: ::this.fetchManagementEditSelect,
						addManagementList: ::this.addManagementList,
						delManagementList: ::this.delManagementList,
						updateManagementList: ::this.updateManagementList
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}