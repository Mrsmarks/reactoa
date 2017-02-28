import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/example/add'
import { 
	addExampleList,
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
		options: cardExample.get('options'),
		pending: cardExample.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ addExampleList, uploadFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		addLoading: false,
		fileLoading: false
	}
	static storeName = 'cardSetting'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchExampleEditSelect())
		])
	}

	@autoLoading.bind(this, 'addLoading')
	addExampleList() {
		return this.props.actions.addExampleList(...arguments)
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
						addExampleList: ::this.addExampleList,
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