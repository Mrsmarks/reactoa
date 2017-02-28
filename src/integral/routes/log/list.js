import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'integral/components/log/list'
import { 
	fetchIntergralLogList,
	 } from 'integral/actions/action'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ integralLog }) => ({ 
		content: integralLog.get('content'),
		option: integralLog.get('option'),
		params: integralLog.get('params'),
		pending:  integralLog.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchIntergralLogList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
	}
	static storeName = 'integralLog'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchIntergralLogList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchIntergralLogList() {
		return this.props.actions.fetchIntergralLogList(...arguments)
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
						fetchIntergralLogList: ::this.fetchIntergralLogList,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}