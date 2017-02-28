import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoLoading from 'Application/decorators/autoLoading'

import LotteryComp from 'wechatWall/components/wall-details/function/lottery/index'

import { editPrize, fetchPrizeList, updatePassword, fetchWallPrizeSelectData } from 'wechatWall/actions/wall-details/function/action'
import { uploadFile } from 'Application/actions'

/**
 * 微信墙－抽奖－路由
 */

@connect(
	({ wallFunctionLottery, application }) => ({ 
		password: wallFunctionLottery.get('password'),
		content: wallFunctionLottery.get('content'),
		assetsUrl: application.getIn(['user', 'assets_domain']),

		selectData: wallFunctionLottery.get('selectData')
	}),
	dispatch => ({
		actions: bindActionCreators({ uploadFile, editPrize, fetchPrizeList, updatePassword }, dispatch)
	})
)

export default class LotteryCompRoute extends React.Component {

	static contextTypes = {
		getSid: PropTypes.func.isRequired
	}

	state = {
		loading: false,
		editLoading: false,
		passwordLoading: false
	}
	// static storeName = 'wallPhotoManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchPrizeList({ ...props.location.query })),
			redux.dispatch(fetchWallPrizeSelectData(props.location.query.id))
		])
	}

	@autoLoading
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading.bind(this, 'editLoading')
	editPrize() {
		return this.props.actions.editPrize(...arguments)
	}

	@autoLoading
	deletePrize() {
		return this.props.actions.editPrize(...arguments)
	}

	@autoLoading.bind(this, 'passwordLoading')
	updatePassword() {
		return this.props.actions.updatePassword(...arguments)
	}

	render() {
		return (
			<LotteryComp 
				{...this.props}
				{...this.state}
				actions={{
					uploadFile: ::this.uploadFile,
					editPrize: ::this.editPrize,
					deletePrize: ::this.deletePrize,
					updatePassword: ::this.updatePassword
				}}
			/>
		)
	}
}