import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import NetWorkComp from 'system/components/network/list'
import { fetchNetWorkList, delNetWorkList, addNetWorkList, updateNetWorkList } from 'system/actions'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 系统－网点管理－列表页路由
 */

@connect(
	({ systemNetWork, application }) => ({ 
		params: systemNetWork.get('params'),
		content: systemNetWork.get('content'),
		pending: systemNetWork.get('pending'),
		option: systemNetWork.get('option'),
		user: application.get('user')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchNetWorkList, delNetWorkList, addNetWorkList, updateNetWorkList }, dispatch)
	})
)

export default class HelpCompRoute extends React.Component {

	
	state={
		loading: false,
		addChildLoading: false,
		updateLoading: false,
	}
	static storeName='systemNetWork'
	
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchNetWorkList({...props.location.query}))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchNetWorkList() {
		return this.props.actions.fetchNetWorkList(...arguments)
	}

	@autoLoading
	delNetWorkList() {
		return this.props.actions.delNetWorkList(...arguments)
	}

	@autoLoading.bind(this, 'addChildLoading')
	addNetWorkList() {
		return this.props.actions.addNetWorkList(...arguments)
	}
	@autoLoading.bind(this, 'updateLoading')
	updateNetWorkList() {
		return this.props.actions.updateNetWorkList(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children ?  this.props.children: 
				<Spin spinning={this.props.pending}>
					<NetWorkComp
						{...this.state}
						{...this.props}
						actions={{
							fetchNetWorkList: ::this.fetchNetWorkList,
							addNetWorkList: ::this.addNetWorkList,
							delNetWorkList: ::this.delNetWorkList,
							updateNetWorkList: ::this.updateNetWorkList
						}}
					/>
				</Spin>
			}
			</div>
		)
	}
}