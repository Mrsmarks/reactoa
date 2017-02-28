import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'


import ManagementComp from 'system/components/management/list'
import { fetchManagementList, delManagementList } from 'system/actions'
import autoLoading from 'Application/decorators/autoLoading'


/**
 * 系统－管理员－列表页路由
 */

@connect(
	({ systemManagement, application }) => ({ 
		pending: systemManagement.get('pending'),
		params: systemManagement.get('params'),
		content: systemManagement.get('content'),
		option: systemManagement.get('option'),
		assets_domain: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchManagementList, delManagementList }, dispatch)
	})
)

export default class ManagementCompRoute extends React.Component {

	state = {
		listLoading: false,
	}

	static storeName = 'systemManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchManagementList({...props.location.query}))
		])
	}

	@autoLoading.bind(this, 'listLoading')
	fetchManagementList() {
		return this.props.actions.fetchManagementList(...arguments)
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
						<ManagementComp
							{...this.props}
							{...this.state}
							actions={{
								fetchManagementList: ::this.fetchManagementList,
								delManagementList: ::this.delManagementList
						}}/>
					
					</Spin>
				}
			</div>
		)
	}
}