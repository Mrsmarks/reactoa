import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'
import GroupAddComp from 'system/components/group/add'
import { updateSystemGroup, checkSystemGroup } from 'system/actions'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 系统－群组管理－列表页路由
 */

@connect(
	({ systemGroup }) => ({ 
		params: systemGroup.get('params'),
		content: systemGroup.get('content'),
		pending: systemGroup.get('pending'),
		info: systemGroup.get('info'),
		error: systemGroup.get('error'),
	}),
	dispatch => ({
		actions: bindActionCreators({ updateSystemGroup, checkSystemGroup }, dispatch)
	})
)

export default class HelpCompRoute extends React.Component {

	
	state={
		updateLoading: false,
		loading: false
	}
	static storeName='systemGroup'
	
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(checkSystemGroup({...props.location.query}))
		])
	}
	
	@autoLoading.bind(this, 'updateLoading')
	updateSystemGroup() {
		return this.props.actions.updateSystemGroup(...arguments)
	}

	@autoLoading.bind(this, 'loading')
	checkSystemGroup() {
		return this.props.actions.checkSystemGroup(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children ?  this.props.children: 
				<Spin spinning={this.props.pending}>
					<GroupAddComp
						{...this.state}
						{...this.props}
						actions={{
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