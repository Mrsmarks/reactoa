import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'
import GroupComp from 'system/components/group/list'
import { fetchSystemGroup, updateSystemGroup, delSystemGroup, checkSystemGroup } from 'system/actions'
import { uploadExcelFile } from  'Application/actions'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 系统－群组管理－列表页路由
 */

@connect(
	({ systemGroup }) => ({ 
		params: systemGroup.get('params'),
		content: systemGroup.get('content'),
		pending: systemGroup.get('pending'),
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchSystemGroup, updateSystemGroup, delSystemGroup, checkSystemGroup }, dispatch)
	})
)

export default class HelpCompRoute extends React.Component {

	
	state={
		loading: false,
		updateLoading: false,
	}
	static storeName='systemGroup'
	
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSystemGroup({...props.location.query}))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchSystemGroup() {
		return this.props.actions.fetchSystemGroup(...arguments)
	}

	@autoLoading
	delSystemGroup() {
		return this.props.actions.delSystemGroup(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateSystemGroup() {
		return this.props.actions.updateSystemGroup(...arguments)
	}

	@autoLoading
	checkSystemGroup() {
		return this.props.actions.checkSystemGroup(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children ?  this.props.children: 
				<Spin spinning={this.props.pending}>
					<GroupComp
						{...this.state}
						{...this.props}
						actions={{
							fetchSystemGroup: ::this.fetchSystemGroup,
							delSystemGroup: ::this.delSystemGroup,
							updateSystemGroup: ::this.updateSystemGroup,
							checkSystemGroup: ::this.checkSystemGroup
						}}
					/>
				</Spin>
			}
			</div>
		)
	}
}