import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/setting/list'
import { 
	fetchSettingList,
	delSettingList,
	
	 } from 'card/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ cardSetting }) => ({ 
		content: cardSetting.get('content'),
		option: cardSetting.get('option'),
		params: cardSetting.get('params'),
		pending:  cardSetting.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchSettingList, delSettingList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false
	}
	static storeName = 'cardSetting'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSettingList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchSettingList() {
		return this.props.actions.fetchSettingList(...arguments)
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
						delSettingList: ::this.delSettingList,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}