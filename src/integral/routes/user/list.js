import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'integral/components/user/list'
import { 
	fetchIntergralUserList,
	 } from 'integral/actions/action'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ integralUser }) => ({ 
		content: integralUser.get('content'),
		option: integralUser.get('option'),
		params: integralUser.get('params'),
		pending:  integralUser.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchIntergralUserList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
	}
	static storeName = 'integralUser'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchIntergralUserList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchIntergralUserList() {
		return this.props.actions.fetchIntergralUserList(...arguments)
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
						fetchIntergralUserList: ::this.fetchIntergralUserList,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}