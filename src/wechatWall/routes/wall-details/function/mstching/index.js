import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoLoading from 'Application/decorators/autoLoading'

import MstchingComp from 'wechatWall/components/wall-details/function/mstching/index'

import { fetchMstchingInfo, updateMstching, updateMstchingStatus } from 'wechatWall/actions/wall-details/function/action'

/**
 * 微信墙－对对碰－路由
 */

@connect(
	({ wallFunctionMstching }) => ({ 
		mstching: wallFunctionMstching
	}),
	dispatch => ({
		actions: bindActionCreators({ updateMstching, updateMstchingStatus }, dispatch)
	})
)

export default class PhotoWallCompRoute extends React.Component {

	state = {
		loading: false,
		updateLoading: false
	}
	// static storeName = 'wallPhotoManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchMstchingInfo({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'updateLoading')
	updateMstching() {
		return this.props.actions.updateMstching(...arguments)
	}

	@autoLoading
	updateMstchingStatus() {
		return this.props.actions.updateMstchingStatus(...arguments)
	}

	render() {
		return (
			<MstchingComp 
				{...this.props}
				{...this.state}
				actions={{
					updateMstching: ::this.updateMstching,
					updateMstchingStatus: ::this.updateMstchingStatus
				}}
			/>
		)
	}
}