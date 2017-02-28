import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/management/setting_edit'
import { 
	updateSettingList,
	fetchSettingDetail
	 } from 'activity/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*,
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activitySetting, application }) => ({ 
		info:  activitySetting.get('info'),
		pending:  activitySetting.get('pending'),
		select: activitySetting.get('select'),
		assetsUrl: application.getIn(['user', 'assets_domain']),
	}),
	dispatch => ({
		actions: bindActionCreators({ updateSettingList, fetchSettingDetail }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		updateLoading: false,
		loading: false
	}
	static storeName = 'activitySetting'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSettingDetail({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'updateLoading')
	updateSettingList() {
		return this.props.actions.updateSettingList(...arguments)
	}

	@autoLoading.bind(this, 'loading')
	fetchSettingDetail() {
		return this.props.actions.fetchSettingDetail(...arguments)
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
						fetchSettingDetail: ::this.fetchSettingDetail
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}