import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoLoading from 'Application/decorators/autoLoading'

import PhotoWallComp from 'wechatWall/components/wall-details/function/photoWall/index'

import { addPhoto, deletePhoto, fetchPhotoList, savePhotoOrigin } from 'wechatWall/actions/wall-details/function/action'
import { uploadFile } from 'Application/actions'

/**
 * 微信墙－图片墙－路由
 */

@connect(
	({ wallFunctionPhoto, application }) => ({ 
		content: wallFunctionPhoto.get('content'),
		picType: wallFunctionPhoto.get('picType'),
		assetsUrl: application.getIn(['user', 'assets_domain']),
	}),
	dispatch => ({
		actions: bindActionCreators({ uploadFile, addPhoto, deletePhoto, savePhotoOrigin }, dispatch)
	})
)
export default class PhotoWallCompRoute extends React.Component {

	state = {
		loading: false,
		saveLoading: false
	}
	// static storeName = 'wallPhotoManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchPhotoList({ ...props.location.query }))
		])
	}

	@autoLoading
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading
	addPhoto() {
		return this.props.actions.addPhoto(...arguments)
	}

	@autoLoading
	deletePhoto() {
		return this.props.actions.deletePhoto(...arguments)
	}

	@autoLoading.bind(this, 'saveLoading')
	savePhotoOrigin() {
		return this.props.actions.savePhotoOrigin(...arguments)
	}

	render() {
		return (
			<PhotoWallComp 
				{...this.props}
				{...this.state}
				assetsUrl={this.props.assetsUrl}
				actions={{
					uploadFile: ::this.uploadFile,
					addPhoto: ::this.addPhoto,
					deletePhoto: ::this.deletePhoto,
					savePhotoOrigin: ::this.savePhotoOrigin
				}}
			/>
		)
	}
}