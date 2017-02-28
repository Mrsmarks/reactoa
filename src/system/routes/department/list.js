import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import DepartmentComp from 'system/components/department/list'
import { fetchDepartmentList, deleteDepartment } from 'system/actions'
import autoLoading from 'Application/decorators/autoLoading'


/**
 * 系统－部门管理－列表页路由
 */

@connect(
	({ systemDepartment, application }) => ({ 
		content: systemDepartment.get('content'),
		params: systemDepartment.get('params'),
		pending: systemDepartment.get('pending'),
		user: application.get('user')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchDepartmentList, deleteDepartment }, dispatch)
	})
)
export default class DepartmentCompRoute extends React.Component {

	state = {
		loading: false
	}

	static storeName = 'systemDepartment'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchDepartmentList({ ...props.location.query }))
		])
	}

	@autoLoading
	fetchDepartmentList() {
		return this.props.actions.fetchDepartmentList(...arguments)
	}

	@autoLoading
	deleteDepartment() {
		return this.props.actions.deleteDepartment(...arguments)
	}

	render() {
		return (
			<div>
				{
					this.props.children? this.props.children: 
					<DepartmentComp 
						{...this.props}
						{...this.state}
						actions={{
							deleteDepartment: ::this.deleteDepartment,
							fetchDepartmentList: ::this.fetchDepartmentList
						}}
					/>
				}	
			</div>
		)
	}
}