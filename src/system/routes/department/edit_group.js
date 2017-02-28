import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AdminEditComp from 'system/components/department/edit_group'
import autoLoading from 'Application/decorators/autoLoading'
import { fetchDepartmentGroupRoleList, updateDepartmentGroupRoleList } from 'system/actions'

@connect(
	({ systemDepartment,application }) => ({ 
		groupList: systemDepartment.get('groupList'),
		user: application.get('user'),
		dpid: systemDepartment.get('dpid')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchDepartmentGroupRoleList, updateDepartmentGroupRoleList }, dispatch)
	})
)

//系统 - 管理员 - 微信权限分组
export default class AdminEditCompRoute extends React.Component{

	state = {
		loading: false
	}

	static storeName = 'systemDepartment'
	// static fillStore(redux, props) {
	// 	return Promise.all([
	// 		redux.dispatch(fetchDepartmentGroupRoleList({...props.location.query}))
	// 	])
	// }

	componentWillMount() {
		setTimeout(() => {
			this.props.actions.fetchDepartmentGroupRoleList({...this.props.location.query})
		}, 0)
	}


	@autoLoading.bind(this, 'loading')
	fetchDepartmentGroupRoleList() {
		return this.props.actions.fetchDepartmentGroupRoleList(...arguments)
	}

	@autoLoading
	updateDepartmentGroupRoleList() {
		return this.props.actions.updateDepartmentGroupRoleList(...arguments)
	}

	render() {
		return (
			<AdminEditComp
				{...this.props}
				{...this.state}
				actions={{
					fetchDepartmentGroupRoleList: ::this.fetchDepartmentGroupRoleList,
					updateDepartmentGroupRoleList: ::this.updateDepartmentGroupRoleList
				}}				
			></AdminEditComp>
		)
	}
}