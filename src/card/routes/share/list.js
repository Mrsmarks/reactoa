import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/share/list'
import { 
	fetchShareList
	 } from 'card/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ cardShare, application }) => ({ 
		content: cardShare.get('content'),
		params: cardShare.get('params'),
		pending:  cardShare.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain']),
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchShareList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
	}
	static storeName = 'cardShare'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchShareList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchShareList() {
		return this.props.actions.fetchShareList(...arguments)
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
						fetchShareList: ::this.fetchShareList,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}