import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'


import AdminComp from 'system/components/admin/list'
import { fetchAdminList, fetchDelAdminItem, addAdminItem, editAdminItem, getOrganizationDetail } from 'system/actions'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 系统－管理员－列表页路由
 */

@connect(
	({ systemAdmin, application }) => ({ 
		params: systemAdmin.get('params'),
		content: systemAdmin.get('content'),
		pending: systemAdmin.get('pending'),
		select: systemAdmin.get('select'),
		option: systemAdmin.get('option'),
		user: application.get('user')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchAdminList, fetchDelAdminItem, addAdminItem, editAdminItem, getOrganizationDetail }, dispatch)
	})
)

export default class AdminCompRoute extends React.Component {

	state = {
		listLoading: false,
		editLoading: false,
		addLoading: false,
	}

	static storeName = 'systemAdmin'
	static fillStore(redux, props) {
		// console.log(this.props.user.toJS())
		return Promise.all([
			redux.dispatch(fetchAdminList({...props.location.query}))
		])
	}

	// componentWillMount() {
	// 	setTimeout(() => {
	// 		this.props.actions.fetchAdminList({...this.props.location.query})
	// 	}, 0)
	// }


	@autoLoading.bind(this, 'listLoading')
	fetchAdminList() {
		return this.props.actions.fetchAdminList(...arguments)
	}

    @autoLoading.bind(this, 'listLoading')
	fetchDelAdminItem() {
		return this.props.actions.fetchDelAdminItem(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addAdminItem() {
		return this.props.actions.addAdminItem(...arguments)
	}

	@autoLoading.bind(this, 'editLoading')
	editAdminItem() {
		return this.props.actions.editAdminItem(...arguments)
	}

	@autoLoading
	getOrganizationDetail() {
		return this.props.actions.getOrganizationDetail(...arguments)
	}

	render() {
		return (
			<div>
				{ this.props.children ? this.props.children :
					<Spin spinning={this.props.pending}>
						<AdminComp
							{...this.props}
							{...this.state}
							actions={{
								fetchAdminList: ::this.fetchAdminList,
								fetchDelAdminItem: ::this.fetchDelAdminItem,
								addAdminItem: ::this.addAdminItem,
								editAdminItem: ::this.editAdminItem,
								getOrganizationDetail: ::this.getOrganizationDetail
							}}
						></AdminComp>
					</Spin>
				}	
			</div>
		)
			
		
	}
}