import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import SettingComp from 'system/components/setting/edit'
import { fetchSystemData, updateSystemData } from 'system/actions'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 系统－获取系统配置
 */

@connect(
	({ systemSetting }) => ({ 
		systemSetting
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchSystemData, updateSystemData }, dispatch)
	})
)

export default class SettingCompRoute extends React.Component{

	state = {
		loading: false,
		saveLoading: false
	}

	static storeName = 'systemSetting'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSystemData())
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchSystemData() {
		return this.props.actions.fetchSystemData()
	}

	@autoLoading.bind(this, 'saveLoading')
	updateSystemData(data) {
		return this.props.actions.updateSystemData(data)
	}


	render() {
		const systemSetting = this.props.systemSetting
		return (
			<Spin spinning={systemSetting.get('pending')}>
				<SettingComp
					setting={systemSetting.get('setting')}
					loading={this.state.loading}
					saveLoading={this.state.saveLoading}
					radio={systemSetting.get('radio')}
					actions={{
						fetchSystemData: ::this.fetchSystemData,
						updateSystemData: ::this.updateSystemData
					}}
				></SettingComp>
			</Spin>
		)
	}
}