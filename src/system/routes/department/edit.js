import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import message from 'antd/lib/message'

import Spin from 'antd/lib/spin'

import DepartmentEditComp from 'system/components/department/edit'
import { fetchDepartmentById, fetchDepartmentSelector, editDepartment } from 'system/actions'

import autoLoading from 'Application/decorators/autoLoading'


@connect(
	({ systemDepartment }) => ({
		deptData: systemDepartment.get('deptData'),
		deptId: systemDepartment.get('deptId'),

		deptSelector: systemDepartment.get('deptSelector')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchDepartmentById, editDepartment }, dispatch)
	})
)
export default class DepartmentEditCompRoute extends React.Component{

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchDepartmentById(props.location.query)),
			redux.dispatch(fetchDepartmentSelector())
		])
	}

	state = {
		btnLoading: false,
		fetchLoading: false
	}

	@autoLoading.bind(this, 'fetchLoading')
	fetchDepartmentById() {
		return this.props.actions.fetchDepartmentById(...arguments)
	}

	@autoLoading.bind(this, 'btnLoading')
	editDepartment() {
		return this.props.actions.editDepartment(...arguments)
	}


	// 每次进来都要判断ID是否已经改变，改变的话要重新请求数据
	componentWillMount() {
		const nextId = this.props.location.query.id
		setTimeout(() => {
			if (nextId != this.props.deptId) {
				this.fetchDepartmentById({ id: nextId })
			}
		}, 0)
	}



	render() {
		if (this.props.fetchLoading || !this.props.deptSelector.get('load')) {
			return <Spin spinning={true}/>
		}

		return (
			<DepartmentEditComp 
				{...this.props}
				{...this.state}
				actions={{
					editDepartment: ::this.editDepartment
				}}
			/>
		)
	}
}