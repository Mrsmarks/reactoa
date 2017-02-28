import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/list/list'
import { 
	fetchCardList,
	updateCardList,
	addCardList,
	delCardList
	
	 } from 'card/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ cardList }) => ({ 
		content: cardList.get('content'),
		select: cardList.get('select'),
		params: cardList.get('params'),
		pending:  cardList.get('pending'),
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCardList, delCardList, addCardList, updateCardList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
	}
	static storeName = 'cardList'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCardList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchCardList() {
		return this.props.actions.fetchCardList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addCardList() {
		return this.props.actions.addCardList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateCardList() {
		return this.props.actions.updateCardList(...arguments)
	}

	@autoLoading
	delCardList() {
		return this.props.actions.delCardList(...arguments)
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
						fetchCardList: ::this.fetchCardList,
						delCardList: ::this.delCardList,
						addCardList: ::this.addCardList,
						updateCardList: ::this.updateCardList,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}