import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import HelpComp from 'system/components/help/list'
import { fetchHelpList, addHelpNode, delHelpNode, updateHelpNode } from 'system/actions'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 系统－帮助－列表页路由
 */

@connect(
	({ systemHelp }) => ({ 
		params: systemHelp.get('params'),
		content: systemHelp.get('content'),
		pending: systemHelp.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchHelpList, addHelpNode, delHelpNode, updateHelpNode }, dispatch)
	})
)

export default class HelpCompRoute extends React.Component {

	
	state={
		loading: false,
		addChildLoading: false,
		updateLoading: false,
		editChildLoading: false
	}

	static storeName='systemHelp'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchHelpList({...props.location.query}))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchHelpList() {
		return this.props.actions.fetchHelpList(...arguments)
	}

	@autoLoading
	delHelpNode() {
		return this.props.actions.delHelpNode(...arguments)
	}

	@autoLoading.bind(this, 'addChildLoading')
	addHelpNode() {
		return this.props.actions.addHelpNode(...arguments)
	}
	@autoLoading.bind(this, 'updateLoading')
	updateHelpNode() {
		return this.props.actions.updateHelpNode(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children ?  this.props.children: 
				<Spin spinning={this.props.pending}>
					<HelpComp
						{...this.state}
						{...this.props}
						actions={{
							fetchHelpList: ::this.fetchHelpList,
							addHelpNode: ::this.addHelpNode,
							delHelpNode: ::this.delHelpNode,
							updateHelpNode: ::this.updateHelpNode
						}}
					/>
				</Spin>
			}
			</div>
		)
	}
}