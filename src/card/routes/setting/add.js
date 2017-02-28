import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/setting/add'
import { 
	addSettingList,
	fetchSettingEditSelect
	 } from 'card/actions'

import { uploadFile } from  'Application/actions'


import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ cardSetting, application }) => ({ 
		option: cardSetting.get('option'),
		pending: cardSetting.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ addSettingList, uploadFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		addLoading: false,
		uploadFile: false
	}
	static storeName = 'cardSetting'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSettingEditSelect())
		])
	}

	@autoLoading.bind(this, 'addLoading')
	addSettingList() {
		return this.props.actions.addSettingList(...arguments)
	}

	@autoLoading.bind(this, 'uploadFile')
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
						addSettingList: ::this.addSettingList,
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