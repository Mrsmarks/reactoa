import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import RoleComp from 'system/components/role/list'
import { fetchRoleList, fetchCompAndAuthList, editRole } from 'system/actions'
import autoLoading from 'Application/decorators/autoLoading'


/**
 * 系统－角色管理－列表页路由
 */

@connect(
	({ systemRole, application }) => ({ 
		pending: systemRole.get('pending'),
		params: systemRole.get('params'),
		content: systemRole.get('content'),
		error: systemRole.get('error'),

		authPackageList: systemRole.get('authPackageList'),

		user: application.get('user')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchRoleList, fetchCompAndAuthList, editRole }, dispatch)
	})
)
export default class RoleCompRoute extends React.Component {

	state = {
		loading: false,
	}

	static storeName = 'systemRole'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchRoleList({ ...props.location.query }))
		])
	}
	
	@autoLoading.bind(this, 'loading')
	fetchRoleList() {
		return this.props.actions.fetchRoleList(...arguments)
	}

	@autoLoading.bind(this, 'loading')
	fetchCompAndAuthList() {
		return this.props.actions.fetchCompAndAuthList(...arguments)
	}

	@autoLoading.bind(this, 'loading')
	editRole() {
		return this.props.actions.editRole(...arguments)
	}

	render() {
		return (
			<div>
				{
					this.props.children? this.props.children: 
					<Spin spinning={this.props.pending}>
						<RoleComp
							{...this.props}
							loading={this.state.loading}
							actions={{
								fetchRoleList: ::this.fetchRoleList,
								fetchCompAndAuthList: ::this.fetchCompAndAuthList,
								editRole: ::this.editRole
							}}
						/>
					</Spin>
				}	
			</div>
		)
	}
}