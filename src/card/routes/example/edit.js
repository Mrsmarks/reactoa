import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/example/edit'
import { 
	fetchExampleDetail,
	updateExampleList,
	fetchExampleEditSelect
	 } from 'card/actions'

import { uploadFile } from  'Application/actions'


import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ cardExample, application }) => ({ 
		info: cardExample.get('info'),
		options: cardExample.get('options'),
		pending: cardExample.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain']),
		id: application.get('id')
	}),
	dispatch => ({
		actions: bindActionCreators({ updateExampleList, fetchExampleDetail, uploadFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		updateLoading: false,
		singerLoading: false,
		fileLoading: false
	}
	static storeName = 'cardExample'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchExampleDetail({ ...props.location.query })),
			redux.dispatch(fetchExampleEditSelect())
		])
	}

	@autoLoading.bind(this, 'updateLoading')
	updateExampleList() {
		return this.props.actions.updateExampleList(...arguments)
	}

	@autoLoading.bind(this, 'singerLoading')
	fetchExampleDetail() {
		return this.props.actions.fetchExampleDetail(...arguments)
	}

	@autoLoading.bind(this, 'fileLoading')
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<GroupComp
					{...this.props}
					{...this.state}
					actions={{
						updateExampleList: ::this.updateExampleList,
						fetchExampleDetail: ::this.fetchExampleDetail,
						uploadFile: ::this.uploadFile
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}