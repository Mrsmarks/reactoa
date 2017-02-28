import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoLoading from 'Application/decorators/autoLoading'

import MsgReviewComp from 'wechatWall/components/wall-details/function/msgReview/index'

import { fetchMsgreview, updateMsgreview } from 'wechatWall/actions/wall-details/function/action'

/**
 * 微信墙－弹幕－路由
 */

@connect(
	({ wallFunctionMsgreview }) => ({ 
		info: wallFunctionMsgreview.get('info')
	}),
	dispatch => ({
		actions: bindActionCreators({ updateMsgreview }, dispatch)
	})
)

export default class MsgReviewCompRoute extends React.Component {

	state = {
		loading: false
	}
	// static storeName = 'wallPhotoManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchMsgreview({ ...props.location.query }))
		])
	}

	@autoLoading
	updateMsgreview() {
		return this.props.actions.updateMsgreview(...arguments)
	}

	render() {
		return (
			<MsgReviewComp 
				{...this.props}
				{...this.state}
				actions={{
					updateMsgreview: ::this.updateMsgreview
				}}
			/>
		)
	}
}