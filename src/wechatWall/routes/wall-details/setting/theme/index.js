import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ThemeComp from 'wechatWall/components/wall-details/setting/Theme/index'
import { 
	settingThemeList,
	updateThemeList,
	addThemeList,
	delThemeList,
	 } from 'wechatWall/actions/wall-details/setting/action'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ wallSettingTheme, application }) => ({ 
		content: wallSettingTheme.get('content'),
		params: wallSettingTheme.get('params'),
		pending:  wallSettingTheme.get('pending'),
	}),
	dispatch => ({
		actions: bindActionCreators({ settingThemeList, addThemeList, updateThemeList, delThemeList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
		fileLoading: false
	}
	static storeName = 'wallSettingTheme'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(settingThemeList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	settingThemeList() {
		return this.props.actions.settingThemeList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addThemeList() {
		return this.props.actions.addThemeList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateThemeList() {
		return this.props.actions.updateThemeList(...arguments)
	}

	@autoLoading
	delThemeList() {
		return this.props.actions.delThemeList(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<ThemeComp
					{...this.props}
					{...this.state}
					actions={{
						settingThemeList: ::this.settingThemeList,
						addThemeList: ::this.addThemeList,
						delThemeList: ::this.delThemeList,
						updateThemeList: ::this.updateThemeList,
					}} 
					>
					</ThemeComp>
				</Spin>
				}
			</div>
			
		)
	}
}