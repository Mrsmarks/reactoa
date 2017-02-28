import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/prize/list'
import { 
	fetchPrizeList,
	delPrizeList,
	getPrizeDetail,
	fetchPrizeSelect
	 } from 'activity/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityPrize }) => ({ 
		content: activityPrize.get('content'),
		params: activityPrize.get('params'),
		pending:  activityPrize.get('pending'),
		select: activityPrize.get('select')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchPrizeList, delPrizeList, getPrizeDetail, fetchPrizeSelect }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false
	}
	static storeName = 'activityPrize'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchPrizeList({ ...props.location.query })),
			redux.dispatch(fetchPrizeSelect())
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchPrizeList() {
		return this.props.actions.fetchPrizeList(...arguments)
	}

	@autoLoading
	fetchPrizeSelect() {
		return this.props.actions.fetchPrizeSelect(...arguments)
	}

	@autoLoading
	delPrizeList() {
		return this.props.actions.delPrizeList(...arguments)
	}

	@autoLoading
	getPrizeDetail() {
		return this.props.actions.getPrizeDetail(...arguments)
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
						fetchPrizeList: ::this.fetchPrizeList,
						delPrizeList: ::this.delPrizeList,
						getPrizeDetail: ::this.getPrizeDetail,
						fetchPrizeSelect: ::this.fetchPrizeSelect
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}