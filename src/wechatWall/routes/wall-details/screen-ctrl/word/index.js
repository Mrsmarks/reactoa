import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'
import { 
	getWordList,
	addWordList,
	delWordList,
	delWordsList
	 } from 'wechatWall/actions/wall-details/screen-ctrl/action'
import { uploadExcelFile } from  'Application/actions'

import WordComp from 'wechatWall/components/wall-details/screen-ctrl/word/index'

/**
 * 微信墙－虚拟角色－路由
 */

@connect(
	({ wallDetailWord, application }) => ({ 
		content: wallDetailWord.get('content'),
		params: wallDetailWord.get('params'),
		pending:  wallDetailWord.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ getWordList, addWordList, delWordList, delWordsList, uploadExcelFile }, dispatch)
	})
)

export default class GuestCompRoute extends React.Component {

	state = {
		loading: false,
		messageList: false,
		updateLoading: false,
		uploadLoading: false
	}
	static storeName = 'wallDetailWord'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(getWordList({ ...props.location.query })),
		])
	}

	@autoLoading.bind(this, 'loading')
	getWordList() {
		return this.props.actions.getWordList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	addWordList() {
		return this.props.actions.addWordList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	delWordList() {
		return this.props.actions.delWordList(...arguments)
	}

	@autoLoading
	delWordsList() {
		return this.props.actions.delWordsList(...arguments)
	}

	@autoLoading.bind(this, 'uploadLoading')
	uploadExcelFile() {
		return this.props.actions.uploadExcelFile(...arguments)
	}
	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<WordComp 
						{...this.props}
						{...this.state}
						actions={{
							getWordList: ::this.getWordList,
							addWordList: ::this.addWordList,
							delWordList: ::this.delWordList,
							delWordsList: ::this.delWordsList,
							uploadExcelFile: ::this.uploadExcelFile
						}}
					/>
				</Spin>
				}
			</div>
		)
	}
}