import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/support/list'
import { 
	fetchSupportList,
	addSupportList,
	updateSupportList,
	delSupportList,
	 } from 'activity/actions'
import { uploadFile } from  'Application/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activitySupport, application }) => ({ 
		content: activitySupport.get('content'),
		params: activitySupport.get('params'),
		pending:  activitySupport.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchSupportList, addSupportList, updateSupportList, delSupportList, uploadFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
		fileLoading: false
	}
	static storeName = 'activitySupport'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSupportList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchSupportList() {
		return this.props.actions.fetchSupportList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addSupportList() {
		return this.props.actions.addSupportList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateSupportList() {
		return this.props.actions.updateSupportList(...arguments)
	}

	@autoLoading
	delSupportList() {
		return this.props.actions.delSupportList(...arguments)
	}

	@autoLoading.bind(this, 'fileLoading')
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
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
						fetchSupportList: ::this.fetchSupportList,
						addSupportList: ::this.addSupportList,
						delSupportList: ::this.delSupportList,
						updateSupportList: ::this.updateSupportList,
						uploadFile: ::this.uploadFile
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}