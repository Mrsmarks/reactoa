import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/template/list'
import { 
	fetchTemplateList,
	addTemplateList,
	updateTemplateList,
	delTemplateList,
	 } from 'activity/actions'
import { uploadFile } from  'Application/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityTemplate, application }) => ({ 
		content: activityTemplate.get('content'),
		params: activityTemplate.get('params'),
		pending:  activityTemplate.get('pending'),
		select: activityTemplate.get('select'),
		assetsUrl: application.getIn(['user', 'assets_domain']),
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchTemplateList, addTemplateList, updateTemplateList, delTemplateList, uploadFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
		fileLoading: false
	}
	static storeName = 'activityTemplate'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchTemplateList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchTemplateList() {
		return this.props.actions.fetchTemplateList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addTemplateList() {
		return this.props.actions.addTemplateList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateTemplateList() {
		return this.props.actions.updateTemplateList(...arguments)
	}

	@autoLoading
	delTemplateList() {
		return this.props.actions.delTemplateList(...arguments)
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
						fetchTemplateList: ::this.fetchTemplateList,
						addTemplateList: ::this.addTemplateList,
						delTemplateList: ::this.delTemplateList,
						updateTemplateList: ::this.updateTemplateList,
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