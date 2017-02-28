import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoLoading from 'Application/decorators/autoLoading'

import { fetchShakeList, updateShakeConfig, editShake } from 'wechatWall/actions/wall-details/function/action'

import ShakeComp from 'wechatWall/components/wall-details/function/shake/index'

/**
 * 微信墙－摇一摇－路由
 */

@connect(
	({ wallFunctionShake }) => ({ 
		content: wallFunctionShake.get('content'),
		hasLimit: wallFunctionShake.get('hasLimit'),
		topLevel: wallFunctionShake.get('topLevel'),
		afterRound: wallFunctionShake.get('afterRound')
	}),
	dispatch => ({
		actions: bindActionCreators({ updateShakeConfig, editShake }, dispatch)
	})
)
export default class ShakeCompRoute extends React.Component {

	state = {
		loading: false,
		updateConfigLoading: false,
		editLoading: false
	}
	// static storeName = 'wallPhotoManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchShakeList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'updateConfigLoading')
	updateShakeConfig() {
		return this.props.actions.updateShakeConfig(...arguments)
	}

	@autoLoading
	removeShake() {
		return this.props.actions.editShake(...arguments)
	}

	@autoLoading.bind(this, 'editLoading')
	saveShake() {
		return this.props.actions.editShake(...arguments)
	}

	render() {
		return (
			<ShakeComp 
				{...this.props}
				{...this.state}
				actions={{
					updateShakeConfig: ::this.updateShakeConfig,
					removeShake: ::this.removeShake,
					saveShake: ::this.saveShake
				}}
			/>
		)
	}
}