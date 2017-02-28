import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'card/components/type/list'
import { 
	fetchTypeList,
	updateTypeList,
	addTypeList,
	delTypeList,
	updateTypeSticky
	 } from 'card/actions'
import { uploadFile } from  'Application/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ cardType, application }) => ({ 
		content: cardType.get('content'),
		option: cardType.get('option'),
		params: cardType.get('params'),
		pending:  cardType.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain']),
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchTypeList, delTypeList, addTypeList, updateTypeList, updateTypeSticky, uploadFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
		fileLoading: false,
		updateSticky: false
	}
	static storeName = 'cardType'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchTypeList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchTypeList() {
		return this.props.actions.fetchTypeList(...arguments)
	}

	@autoLoading.bind(this, 'updateSticky')
	updateTypeSticky() {
		return this.props.actions.updateTypeSticky(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addTypeList() {
		return this.props.actions.addTypeList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateTypeList() {
		return this.props.actions.updateTypeList(...arguments)
	}

	@autoLoading
	delTypeList() {
		return this.props.actions.delTypeList(...arguments)
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
						fetchTypeList: ::this.fetchTypeList,
						delTypeList: ::this.delTypeList,
						addTypeList: ::this.addTypeList,
						updateTypeList: ::this.updateTypeList,
						uploadFile: ::this.uploadFile,
						updateTypeSticky: ::this.updateTypeSticky
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}