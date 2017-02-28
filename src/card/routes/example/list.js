import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/example/list'
import { 
	fetchExampleList,
	delExampleList,
	updateExampleSticky
	 } from 'card/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ cardExample }) => ({ 
		content: cardExample.get('content'),
		options: cardExample.get('options'),
		params: cardExample.get('params'),
		pending:  cardExample.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchExampleList, delExampleList, updateExampleSticky }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		updateSticky: false
	}
	static storeName = 'cardExample'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchExampleList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchExampleList() {
		return this.props.actions.fetchExampleList(...arguments)
	}

	@autoLoading
	delExampleList() {
		return this.props.actions.delExampleList(...arguments)
	}

	@autoLoading.bind(this, 'updateSticky')
	updateExampleSticky() {
		return this.props.actions.updateExampleSticky(...arguments)
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
						fetchExampleList: ::this.fetchExampleList,
						delExampleList: ::this.delExampleList,
						updateExampleSticky: ::this.updateExampleSticky
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}