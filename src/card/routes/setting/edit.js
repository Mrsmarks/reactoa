import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/setting/edit'
import { 
	fetchSettingDetail,
	updateSettingList,
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
		info: cardSetting.get('info'),
		option: cardSetting.get('option'),
		pending: cardSetting.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain']),
		id: application.get('id')
	}),
	dispatch => ({
		actions: bindActionCreators({ updateSettingList, fetchSettingDetail, uploadFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		updateLoading: false,
		singerLoading: false,
		fileLoading: false
	}
	static storeName = 'cardSetting'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSettingDetail({ ...props.location.query })),
			redux.dispatch(fetchSettingEditSelect())
		])
	}

	@autoLoading.bind(this, 'updateLoading')
	updateSettingList() {
		return this.props.actions.updateSettingList(...arguments)
	}

	@autoLoading.bind(this, 'singerLoading')
	fetchSettingDetail() {
		return this.props.actions.fetchSettingDetail(...arguments)
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
						updateSettingList: ::this.updateSettingList,
						fetchSettingDetail: ::this.fetchSettingDetail,
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