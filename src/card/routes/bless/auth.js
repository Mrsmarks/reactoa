import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/bless/auth'
import { 
	getBlessAuth,
	updateBlessAuth
	 } from 'card/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ cardBless }) => ({ 
		auth: cardBless.get('auth'),
		pending: cardBless.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ getBlessAuth, updateBlessAuth }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false
	}

	static storeName = 'cardBless'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(getBlessAuth({ ...props.location.query })),
		])
	}

	@autoLoading.bind(this, 'loading')
	getBlessAuth() {
		return this.props.actions.getBlessAuth(...arguments)
	}

	@autoLoading
	updateBlessAuth() {
		return this.props.actions.updateBlessAuth(...arguments)
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
						getBlessAuth: ::this.getBlessAuth,
						updateBlessAuth: ::this.updateBlessAuth,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}