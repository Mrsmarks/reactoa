import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import TemplateComp from 'wechatWall/components/wall-details/setting/template/index'
import { 
	fetchWallActivityTemp,
	updateWallActivityTemp,
	delWallActivityTemp,
	updateDefaultActivityTemp
	 } from 'wechatWall/actions/wall-details/setting/action'
import { uploadFile } from  'Application/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ wallSettingActivity, application }) => ({ 
		content: wallSettingActivity.get('content'),
		select: wallSettingActivity.get('select'),
		params: wallSettingActivity.get('params'),
		pending:  wallSettingActivity.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchWallActivityTemp, updateWallActivityTemp, delWallActivityTemp, updateDefaultActivityTemp, uploadFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		updateLoading: false,
		fileLoading: false
	}
	static storeName = 'wallSettingActivity'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchWallActivityTemp({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchWallActivityTemp() {
		return this.props.actions.fetchWallActivityTemp(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateWallActivityTemp() {
		return this.props.actions.updateWallActivityTemp(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	delWallActivityTemp() {
		return this.props.actions.delWallActivityTemp(...arguments)
	}

	@autoLoading.bind(this, 'fileLoading')
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading
	updateDefaultActivityTemp() {
		return this.props.actions.updateDefaultActivityTemp(...arguments)
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
						fetchWallActivityTemp: ::this.fetchWallActivityTemp,
						updateWallActivityTemp: ::this.updateWallActivityTemp,
						delWallActivityTemp: ::this.delWallActivityTemp,
						updateDefaultActivityTemp: ::this.updateDefaultActivityTemp,
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