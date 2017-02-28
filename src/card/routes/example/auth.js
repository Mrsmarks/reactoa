import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/example/auth'
import { 
	getExampleAuth,
	updateExampleAuth
	 } from 'card/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ cardExample }) => ({ 
		auth: cardExample.get('auth'),
		pending: cardExample.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ getExampleAuth, updateExampleAuth }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false
	}

	static storeName = 'cardExample'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(getExampleAuth({ ...props.location.query })),
		])
	}

	@autoLoading.bind(this, 'loading')
	getExampleAuth() {
		return this.props.actions.getExampleAuth(...arguments)
	}

	@autoLoading
	updateExampleAuth() {
		return this.props.actions.updateExampleAuth(...arguments)
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
						getExampleAuth: ::this.getExampleAuth,
						updateExampleAuth: ::this.updateExampleAuth,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}