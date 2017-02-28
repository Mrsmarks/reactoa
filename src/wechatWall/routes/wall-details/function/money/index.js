import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoLoading from 'Application/decorators/autoLoading'

import MoneyComp from 'wechatWall/components/wall-details/function/money/index'
import { fetchWallMoneyInfo, saveMoneyInfo } from 'wechatWall/actions/wall-details/function/action'

/**
 * 微信墙－数钱－路由
 */

@connect(
	({ wallFunctionMoney }) => ({ 
		content: wallFunctionMoney.get('content')
	}),
	dispatch => ({
		actions: bindActionCreators({ saveMoneyInfo }, dispatch)
	})
)
export default class MoneyCompRoute extends React.Component {

	state = {
		loading: false,
		editLoading: false
	}
	// static storeName = 'wallPhotoManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchWallMoneyInfo({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'editLoading')
	saveMoneyInfo() {
		return this.props.actions.saveMoneyInfo(...arguments)
	}

	@autoLoading
	deleteMoney() {
		return this.props.actions.saveMoneyInfo(...arguments)
	}


	render() {
		return (
			<MoneyComp 
				{...this.props}
				{...this.state}
				actions={{
					saveMoneyInfo: ::this.saveMoneyInfo,
					deleteMoney: ::this.saveMoneyInfo
				}}
			/>
		)
	}
}