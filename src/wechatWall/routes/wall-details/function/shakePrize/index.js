import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoLoading from 'Application/decorators/autoLoading'

import ShakePrizeComp from 'wechatWall/components/wall-details/function/shakePrize/index'

import { updateShakePrizeConfig, fetchShakePrizeList, saveShakePrize } from 'wechatWall/actions/wall-details/function/action'
import { uploadFile } from 'Application/actions'

/**
 * 微信墙－摇大奖－路由
 */
@connect(
	({ wallFunctionShakePrize, application }) => ({ 
		content: wallFunctionShakePrize.get('content'),

		repeat: wallFunctionShakePrize.get('repeat'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ updateShakePrizeConfig, uploadFile, saveShakePrize }, dispatch)
	})
)

export default class ShakePrizeCompRoute extends React.Component {

	state = {
		loading: false
	}
	// static storeName = 'wallPhotoManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchShakePrizeList({ ...props.location.query }))
		])
	}

	//@autoLoading
	updateShakePrizeConfig() {
		return this.props.actions.updateShakePrizeConfig(...arguments)
	}

	@autoLoading
	saveShakePrize() {
		return this.props.actions.saveShakePrize(...arguments)
	}

	@autoLoading
	deleteShakePrize() {
		return this.props.actions.saveShakePrize(...arguments)
	}


	render() {
		return (
			<ShakePrizeComp 
				{...this.props}
				{...this.state}
				actions={{
					uploadFile: this.props.actions.uploadFile,
					saveShakePrize: ::this.saveShakePrize,
					deleteShakePrize: ::this.deleteShakePrize,
					updateShakePrizeConfig: ::this.updateShakePrizeConfig
				}}
			/>
		)
	}
}