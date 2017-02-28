import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoLoading from 'Application/decorators/autoLoading'

import InfoComp from 'wechatWall/components/wall-details/function/info/index'

import { fetchActivityById } from 'wechatWall/actions/wall-details/function/action'
import { editActivity } from 'wechatWall/actions/wall'

/**
 * 微信墙－基本信息－路由
 */

@connect(
	({ wallFunctionInfo }) => ({ 
		info: wallFunctionInfo.get('info')
	}),
	dispatch => ({
		actions: bindActionCreators({ editActivity }, dispatch)
	})
)

export default class InfoCompRoute extends React.Component {

	state = {
		loading: false
	}
	// static storeName = 'wallPhotoManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchActivityById({ ...props.location.query }))
		])
	}

	@autoLoading
	editActivity() {
		return this.props.actions.editActivity(...arguments)
	}


	render() {
		return (
			<InfoComp 
				{...this.props}
				{...this.state}
				actions={{
					editActivity: ::this.editActivity
				}}
			/>
		)
	}
}