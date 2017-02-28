import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import AuthComp from 'system/components/auth/list'
import { fetchAuthList, removeAuthPackage } from 'system/actions'
import autoLoading from 'Application/decorators/autoLoading'


/**
 * 系统－权限包管理－列表页路由
 */

@connect(
	({ systemAuth }) => ({ 
		count: systemAuth.get('count'),
		content: systemAuth.get('content'),
		pending: systemAuth.get('pending'),
		error: systemAuth.get('error'),
		params: systemAuth.get('params')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchAuthList, removeAuthPackage }, dispatch)
	})
)
export default class AuthCompRoute extends React.Component {

	state = {
		loading: false
	}

	static storeName = 'systemAuth'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchAuthList({ ...props.location.query }))
		])
	}
	
	@autoLoading.bind(this, 'loading')
	fetchAuthList() {
		return this.props.actions.fetchAuthList(...arguments)
	}

	@autoLoading.bind(this, 'loading')
	removeAuthPackage() {
		return this.props.actions.removeAuthPackage(...arguments)
	}

	render() {
		return (
			<div>
				{
					this.props.children? this.props.children: 
					<Spin spinning={this.props.pending}>
						<AuthComp
							{...this.props}
							{...this.state}
							actions={{
								fetchAuthList: ::this.fetchAuthList,
								removeAuthPackage: ::this.removeAuthPackage
							}}
						/>
					</Spin>
				}
			</div>
		)
	}
}