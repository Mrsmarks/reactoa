import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoLoading from 'Application/decorators/autoLoading'

import SignManageComp from 'wechatWall/components/wall-details/sign/manage/index'

import { fetchSignSetting, updateSignSetting, fetchWhiteList, editWhiteName } from 'wechatWall/actions/wall-details/sign/action'

/**
 * 微信墙－签到－路由
 */

@connect( 
	({ wallSignManage, application }) => ({ 
		info: wallSignManage,
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ updateSignSetting, fetchWhiteList, editWhiteName }, dispatch)
	})
)

export default class SignManageCompRoute extends React.Component {

	state = {
		saveLoading: false,
		updateWhiteStatusLoading: false,
		tableLoading: false,
		editWhiteNameLoading: false
	}
	// static storeName = 'wallPhotoManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSignSetting({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'saveLoading')
	updateSignSetting() {
		return this.props.actions.updateSignSetting(...arguments)
	}

	@autoLoading.bind(this, 'updateWhiteStatusLoading')
	updateWhiteStatus() {
		return this.props.actions.updateSignSetting(...arguments)
	}

	@autoLoading.bind(this, 'tableLoading')
	fetchWhiteList() {
		return this.props.actions.fetchWhiteList(...arguments)
	}

	@autoLoading.bind(this, 'editWhiteNameLoading')
	editWhiteName() {
		return this.props.actions.editWhiteName(...arguments)
	}

	@autoLoading.bind(this, 'tableLoading')
	removeWhiteName() {
		return this.props.actions.editWhiteName(...arguments)
	}

	render() {
		return (
			<SignManageComp 
				{...this.props}
				{...this.state}
				actions={{
					updateSignSetting: ::this.updateSignSetting,
					updateWhiteStatus: ::this.updateWhiteStatus,
					fetchWhiteList: ::this.fetchWhiteList,
					editWhiteName: ::this.editWhiteName,
					removeWhiteName: ::this.removeWhiteName
				}}
			/>
		)
	}
}