import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TemplateComp from 'wechatWall/components/wall-details/setting/animation/index'
import { 
	getTemplateList,
	delTemplateList,
	updateDefaultTemp
	 } from 'wechatWall/actions/wall-details/setting/action'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ wallSettingTemplate, application }) => ({ 
		content: wallSettingTemplate.get('content'),
		params: wallSettingTemplate.get('params'),
		pending:  wallSettingTemplate.get('pending'),
		select: wallSettingTemplate.get('select'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ getTemplateList, delTemplateList, updateDefaultTemp }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
	}
	static storeName = 'wallSettingTemplate'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(getTemplateList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	getTemplateList() {
		return this.props.actions.getTemplateList(...arguments)
	}

	@autoLoading
	delTemplateList() {
		return this.props.actions.delTemplateList(...arguments)
	}

	@autoLoading
	updateDefaultTemp() {
		return this.props.actions.updateDefaultTemp(...arguments)
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
						getTemplateList: ::this.getTemplateList,
						delTemplateList: ::this.delTemplateList,
						updateDefaultTemp: ::this.updateDefaultTemp
					}} 
					>
					</TemplateComp>
				</Spin>
				}
			</div>
			
		)
	}
}