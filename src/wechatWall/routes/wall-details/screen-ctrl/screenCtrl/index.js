import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoLoading from 'Application/decorators/autoLoading'
import { 
	wallScreenCtrl, 
	updateWallScreenCtrl,
	freshPeopleNum
	} from 'wechatWall/actions/wall-details/screen-ctrl/action'
import ScreenComp from 'wechatWall/components/wall-details/screen-ctrl/screenCtrl/index'

/**
 * 微信墙－大屏幕控制－路由
 */

@connect(
	({ wallDetailScreenCtrl }) => ({ 
		content: wallDetailScreenCtrl.get('content'),
		pending:  wallDetailScreenCtrl.get('pending'),
	}), dispatch => ({
		actions: bindActionCreators({ wallScreenCtrl, updateWallScreenCtrl, freshPeopleNum }, dispatch)
	})
)

export default class GuestCompRoute extends React.Component {

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		getSid: PropTypes.func.isRequired
	}

	state = {
		loading: false,
		updateLoading: false
	}
	static storeName = 'wallDetailScreenCtrl'
	static fillStore(redux, props) {
		const sid = props.location.query.id
		return Promise.all([
			redux.dispatch(wallScreenCtrl(sid))
		])
	}

	@autoLoading.bind(this, 'loading')
	wallScreenCtrl() {
		return this.props.actions.wallScreenCtrl(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateWallScreenCtrl() {
		return this.props.actions.updateWallScreenCtrl(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	freshPeopleNum() {
		return this.props.actions.freshPeopleNum(...arguments)
	}

	render() {
		return (
			<ScreenComp 
				{...this.props}
				{...this.state}
				actions={{
					wallScreenCtrl: ::this.wallScreenCtrl,
					updateWallScreenCtrl: ::this.updateWallScreenCtrl,
					freshPeopleNum: ::this.freshPeopleNum
				}}
				
			/>
		)
	}
}