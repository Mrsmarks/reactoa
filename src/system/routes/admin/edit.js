import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import message from 'antd/lib/message'

import AdminEditComp from 'system/components/admin/edit'
import autoLoading from 'Application/decorators/autoLoading'
import { fetchGroupRoleList, updateGroupRoleList } from 'system/actions'

@connect(
	({ systemAdmin,application }) => ({ 
		groupList: systemAdmin.get('groupList'),
		user: application.get('user'),
		error: systemAdmin.get('error'),
		id: systemAdmin.get('id')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchGroupRoleList, updateGroupRoleList }, dispatch)
	})
)

//系统 - 管理员 - 微信权限分组
export default class AdminEditCompRoute extends React.Component{

	state = {
		loading: false
	}

	static storeName = 'systemAdmin'
	// static fillStore(redux, props) {
	// 	return Promise.all([
	// 		redux.dispatch(fetchGroupRoleList({...props.location.query}))
	// 	])
	// }

	componentWillMount() {
		setTimeout(() => {
			this.props.actions.fetchGroupRoleList({...this.props.location.query}).catch(({ err }) => {
                message.error(err.errormsg)
            })
		}, 0)
	}

	@autoLoading.bind(this, 'loading')
	fetchGroupRoleList() {
		return this.props.actions.fetchGroupRoleList(...arguments)
	}

	@autoLoading
	updateGroupRoleList() {
		return this.props.actions.updateGroupRoleList(...arguments)
	}

	render() {
		return (
			<AdminEditComp
				{...this.props}
				{...this.state}
				actions={{
					fetchGroupRoleList: ::this.fetchGroupRoleList,
					updateGroupRoleList: ::this.updateGroupRoleList
				}}				
			></AdminEditComp>
		)
	}
}