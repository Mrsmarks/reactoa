import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/black/list'
import { 
	fetchBlackList,
	addBlackList,
	delBlackList,
	updateBlackList,
	 } from 'activity/actions'

import { uploadExcelFile } from  'Application/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityBlack, application }) => ({ 
		content: activityBlack.get('content'),
		params: activityBlack.get('params'),
		pending:  activityBlack.get('pending'),
		select: activityBlack.get('select'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchBlackList, addBlackList, delBlackList, updateBlackList, uploadExcelFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
	}
	static storeName = 'activityBlack'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchBlackList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchBlackList() {
		return this.props.actions.fetchBlackList(...arguments)
	}

	@autoLoading
	delBlackList() {
		return this.props.actions.delBlackList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addBlackList() {
		return this.props.actions.addBlackList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateBlackList() {
		return this.props.actions.updateBlackList(...arguments)
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
						fetchBlackList: ::this.fetchBlackList,
						delBlackList: ::this.delBlackList,
						addBlackList: ::this.addBlackList,
						updateBlackList: ::this.updateBlackList,
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