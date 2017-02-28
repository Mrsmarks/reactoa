import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TemplateComp from 'wechatWall/components/wall-details/setting/animation/edit'
import { 
	updateTemplateList,
	getTemplateOption,
	checkTemplateList
	 } from 'wechatWall/actions/wall-details/setting/action'

import { uploadFile } from 'Application/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ wallSettingTemplate, application }) => ({ 
		info: wallSettingTemplate.get('info'),
		pending:  wallSettingTemplate.get('pending'),
		option: wallSettingTemplate.get('option'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ updateTemplateList, getTemplateOption, checkTemplateList, uploadFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		updateLoading: false,
		fileLoading: false
	}
	static storeName = 'wallSettingTemplate'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(getTemplateOption()),
			redux.dispatch(checkTemplateList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'updateLoading')
	updateTemplateList() {
		return this.props.actions.updateTemplateList(...arguments)
	}

	@autoLoading
	checkTemplateList() {
		return this.props.actions.checkTemplateList(...arguments)
	}

	@autoLoading.bind(this, 'loading')
	getTemplateOption() {
		return this.props.actions.getTemplateOption(...arguments)
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
					<TemplateComp
					{...this.props}
					{...this.state}
					actions={{
						updateTemplateList: ::this.updateTemplateList,
						getTemplateOption: ::this.getTemplateOption,
						checkTemplateList: ::this.checkTemplateList,
						uploadFile: ::this.uploadFile
					}} 
					>
					</TemplateComp>
				</Spin>
				}
			</div>
			
		)
	}
}