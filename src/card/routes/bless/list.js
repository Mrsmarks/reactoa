import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/bless/list'
import { 
	fetchBlessList,
	updateBlessList,
	addBlessList,
	delBlessList,
	updateBlessSticky
	 } from 'card/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ cardBless }) => ({ 
		content: cardBless.get('content'),
		select: cardBless.get('select'),
		params: cardBless.get('params'),
		pending:  cardBless.get('pending'),
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchBlessList, delBlessList, addBlessList, updateBlessList, updateBlessSticky }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
		updateSticky: false
	}
	static storeName = 'cardBless'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchBlessList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchBlessList() {
		return this.props.actions.fetchBlessList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addBlessList() {
		return this.props.actions.addBlessList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateBlessList() {
		return this.props.actions.updateBlessList(...arguments)
	}

	@autoLoading.bind(this, 'updateSticky')
	updateBlessSticky() {
		return this.props.actions.updateBlessSticky(...arguments)
	}

	@autoLoading
	delBlessList() {
		return this.props.actions.delBlessList(...arguments)
	}


	render() {
		return (
			<div>
				{
					this.props.children? this.props.children: 
					<Spin spinning={this.props.pending}>
						<GroupComp
						{...this.props}
						{...this.state}
						actions={{
							fetchBlessList: ::this.fetchBlessList,
							delBlessList: ::this.delBlessList,
							addBlessList: ::this.addBlessList,
							updateBlessList: ::this.updateBlessList,
							updateBlessSticky: ::this.updateBlessSticky
						}} 
						>
						</GroupComp>
					</Spin>
				}
			</div>
			
		)
	}
}