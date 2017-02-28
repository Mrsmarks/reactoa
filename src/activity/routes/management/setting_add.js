import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/management/setting_add'
import { 
	addSettingList
	 } from 'activity/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*,
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activitySetting, application }) => ({ 
		content:  activitySetting.get('content'),
		pending:  activitySetting.get('pending'),
		select: activitySetting.get('select'),
		assetsUrl: application.getIn(['user', 'assets_domain']),
	}),
	dispatch => ({
		actions: bindActionCreators({ addSettingList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		addLoading: false
	}
	static storeName = 'activitySetting'

	@autoLoading.bind(this, 'addLoading')
	addSettingList() {
		return this.props.actions.addSettingList(...arguments)
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
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}