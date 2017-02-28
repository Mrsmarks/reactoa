import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/white/list'
import { 
	fetchWhiteList,
	addWhiteList,
	delWhiteList,
	updateWhiteList,
	 } from 'activity/actions'

import { uploadExcelFile } from  'Application/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityWhite, application }) => ({ 
		content: activityWhite.get('content'),
		params: activityWhite.get('params'),
		pending:  activityWhite.get('pending'),
		select: activityWhite.get('select'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchWhiteList, addWhiteList, delWhiteList, updateWhiteList, uploadExcelFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
	}
	static storeName = 'activityWhite'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchWhiteList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchWhiteList() {
		return this.props.actions.fetchWhiteList(...arguments)
	}

	@autoLoading
	delWhiteList() {
		return this.props.actions.delWhiteList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addWhiteList() {
		return this.props.actions.addWhiteList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateWhiteList() {
		return this.props.actions.updateWhiteList(...arguments)
	}

	@autoLoading
	uploadExcelFile() {
		return this.props.actions.uploadExcelFile(...arguments)
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
						fetchWhiteList: ::this.fetchWhiteList,
						delWhiteList: ::this.delWhiteList,
						addWhiteList: ::this.addWhiteList,
						updateWhiteList: ::this.updateWhiteList,
						uploadExcelFile: ::this.uploadExcelFile
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
		)
	}
}