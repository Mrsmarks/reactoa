import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import message from 'antd/lib/message'

import Spin from 'antd/lib/spin'

import AuthEditComp from 'system/components/auth/edit'
import { fetchAuthEditData, fetchAuthPackageById, editAuthPackage } from 'system/actions'

import autoLoading from 'Application/decorators/autoLoading'

@connect(
	({ systemAuth, application }) => ({
		authPackageList: systemAuth.get('authPackageList'),
		menuList: systemAuth.get('menuList'),
		authDetails: systemAuth.get('authDetails'),
		editId: systemAuth.get('editId'),
		userLevel: application.getIn(['user', 'level'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchAuthEditData, fetchAuthPackageById, editAuthPackage }, dispatch)
	})
)
export default class AuthEditCompRoute extends React.Component{

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchAuthEditData({ ...props.location.query }))
		])
	}

	state = {
		btnLoading: false,
		fetchLoading: false
	}

	@autoLoading.bind(this, 'btnLoading')
	editAuthPackage() {
		return this.props.actions.editAuthPackage(...arguments)
	}

	@autoLoading.bind(this, 'fetchLoading')
	fetchAuthEditData() {
		return this.props.actions.fetchAuthEditData(...arguments)
	}

	// 每次进来都要判断ID是否已经改变，改变的话要重新请求数据
	componentWillMount() {
		const nextId = this.props.location.query.id
		setTimeout(() => {
			if (nextId != this.props.editId) {
				this.fetchAuthEditData({ id: nextId })
			}
		}, 0)
	}

	render() {
		if (!this.props.menuList.size || this.state.fetchLoading) {
			return <Spin spinning={true}/>
		}

		const actions = {
			editAuthPackage: ::this.editAuthPackage,
		}
		return (
			<AuthEditComp 
				{...this.props}
				{...this.state}
				editId={this.props.editId}
				actions={actions}
			/>
		)
	}
}