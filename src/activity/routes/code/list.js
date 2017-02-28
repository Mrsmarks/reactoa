import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'activity/components/code/list'
import { 
	fetchCodeList,
	addCodeList,
	delCodeList,
	updateCodeList
} from 'activity/actions'

import { uploadExcelFile } from  'Application/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ activityCode, application }) => ({ 
		content: activityCode.get('content'),
		params: activityCode.get('params'),
		pending: activityCode.get('pending'),
		select: activityCode.get('select'),
		option: activityCode.get('option'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCodeList, addCodeList, delCodeList, updateCodeList, uploadExcelFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
	}
	static storeName = 'activityCode'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCodeList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchCodeList() {
		return this.props.actions.fetchCodeList(...arguments)
	}

	@autoLoading
	delCodeList() {
		return this.props.actions.delCodeList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addCodeList() {
		return this.props.actions.addCodeList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateCodeList() {
		return this.props.actions.updateCodeList(...arguments)
	}

	@autoLoading
	uploadExcelFile() {
		return this.props.actions.uploadExcelFile(...arguments)
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
						fetchCodeList: ::this.fetchCodeList,
						delCodeList: ::this.delCodeList,
						addCodeList: ::this.addCodeList,
						updateCodeList: ::this.updateCodeList,
						uploadExcelFile: ::this.uploadExcelFile
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
		)
	}
}