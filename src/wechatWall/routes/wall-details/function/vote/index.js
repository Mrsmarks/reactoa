import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import autoLoading from 'Application/decorators/autoLoading'

import VoteComp from 'wechatWall/components/wall-details/function/vote/index'
import { fetchVoteList, editVote } from 'wechatWall/actions/wall-details/function/action'
import { uploadFile } from 'Application/actions'


/**
 * 微信墙－图片墙－路由
 */
@connect(
	({ wallFunctionVote, application }) => ({ 
		content: wallFunctionVote.get('content'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchVoteList, editVote, uploadFile }, dispatch)
	})
)
export default class VoteCompRoute extends React.Component {
	state = {
		loading: false,
		uploadLoading: false,
		saveLoading: false
	}
	// static storeName = 'wallPhotoManagement'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchVoteList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'uploadLoading')
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	@autoLoading.bind(this, 'saveLoading')
	saveVote() {
		return this.props.actions.editVote(...arguments)
	}

	@autoLoading
	removeVote() {
		return this.props.actions.editVote(...arguments)
	}

	render() {
		return (
			<VoteComp 
				{...this.props}
				{...this.state}
				actions={{
					uploadFile: ::this.uploadFile,
					saveVote: ::this.saveVote,
					removeVote: ::this.removeVote
				}}
			/>
		)
	}
}