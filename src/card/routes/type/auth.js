import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/type/auth'
import { 
	getTypeAuth,
	updateTypeAuth
	 } from 'card/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ cardType }) => ({ 
		auth: cardType.get('auth'),
		pending: cardType.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ getTypeAuth, updateTypeAuth }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false
	}

	static storeName = 'cardType'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(getTypeAuth({ ...props.location.query })),
		])
	}

	@autoLoading.bind(this, 'loading')
	getTypeAuth() {
		return this.props.actions.getTypeAuth(...arguments)
	}

	@autoLoading
	updateTypeAuth() {
		return this.props.actions.updateTypeAuth(...arguments)
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
						getTypeAuth: ::this.getTypeAuth,
						updateTypeAuth: ::this.updateTypeAuth,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}