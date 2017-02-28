import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/management/setting_list'
import { 
	fetchSettingList,
	fetchSettingDetail,
	addSettingList,
	updateSettingList,
	delSettingList
	 } from 'activity/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activitySetting }) => ({ 
		content: activitySetting.get('content'),
		params:  activitySetting.get('params'),
		pending:  activitySetting.get('pending'),
		error: activitySetting.get('error'),
		id: activitySetting.get('id')

	}),
	dispatch => ({
		actions: bindActionCreators({ fetchSettingList, fetchSettingDetail, addSettingList, updateSettingList, delSettingList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		updateLoading: false,
		addLoading: false
	}
	static storeName = 'activitySetting'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSettingList({ ...props.location.query }))
		])
	}

	// componentWillMount() {
	// 	const aid = this.props.location.query.aid
	// 	setTimeout(() => {
	// 		if (aid != this.props.id) {
	// 			this.fetchSettingList({ aid: aid })
	// 		}
	// 	}, 0)
	// }

	@autoLoading.bind(this, 'loading')
	fetchSettingList() {
		return this.props.actions.fetchSettingList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addSettingList() {
		return this.props.actions.addSettingList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateSettingList() {
		return this.props.actions.updateSettingList(...arguments)
	}

	@autoLoading
	delSettingList() {
		return this.props.actions.delSettingList(...arguments)
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
						fetchSettingList: ::this.fetchSettingList,
						addSettingList: ::this.addSettingList,
						delSettingList: ::this.delSettingList,
						updateSettingList: ::this.updateSettingList
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}