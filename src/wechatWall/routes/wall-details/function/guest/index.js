import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoLoading from 'Application/decorators/autoLoading'

import GuestComp from 'wechatWall/components/wall-details/function/guest/index'

import { fetchGuestList, editGuest, sortGuest, deleteGuest } from 'wechatWall/actions/wall-details/function/action'
import { uploadFile } from 'Application/actions'

/**
 * 微信墙－嘉宾墙－路由
 */
@connect(
	({ wallFunctionGuest, application }) => ({ 
		content: wallFunctionGuest.get('content'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchGuestList, editGuest, sortGuest, uploadFile }, dispatch)
	})
)
export default class GuestCompRoute extends React.Component {

	state = {
		loading: false,
		editLoading: false,
		listLoading: false
	}
	// static storeName = 'wallPhotoManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchGuestList({ ...props.location.query }))
		])
	}

	@autoLoading
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading.bind(this, 'editLoading')
	editGuest() {
		return this.props.actions.editGuest(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	sortGuest() {
		return this.props.actions.sortGuest(...arguments)
	}

	@autoLoading.bind(this, 'listLoading')
	deleteGuest() {
		return this.props.actions.editGuest(...arguments)
	}

	render() {
		return (
			<GuestComp 
				{...this.props}
				{...this.state}
				actions={{
					uploadFile: ::this.uploadFile,
					editGuest: ::this.editGuest,
					sortGuest: ::this.sortGuest,
					deleteGuest: ::this.deleteGuest
				}}
			/>
		)
	}
}