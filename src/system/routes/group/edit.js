import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'
import GroupEditComp from 'system/components/group/edit'
import { updateSystemGroup, checkSystemGroup, getSystemGroup } from 'system/actions'
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
		group: systemGroup.get('group')
	}),
	dispatch => ({
		actions: bindActionCreators({ updateSystemGroup, checkSystemGroup, getSystemGroup }, dispatch)
	})
)

export default class HelpCompRoute extends React.Component {

	
	state={
		updateLoading: false,
		loading: false,
	}
	static storeName='systemGroup'
	
	// static fillStore(redux, props) {
	// 	return Promise.all([
	// 		redux.dispatch(getSystemGroup({...props.location.query}))
	// 	])
	// }
	componentWillMount() {
		setTimeout(() => {
			this.props.actions.getSystemGroup({...this.props.location.query})
		}, 0)
	}
	
	@autoLoading.bind(this, 'updateLoading')
	updateSystemGroup() {
		return this.props.actions.updateSystemGroup(...arguments)
	}

	@autoLoading.bind(this, 'loading')
	getSystemGroup() {
		return this.props.actions.getSystemGroup(...arguments)
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
					<GroupEditComp
						{...this.state}
						{...this.props}
						actions={{
							updateSystemGroup: ::this.updateSystemGroup,
							checkSystemGroup: ::this.checkSystemGroup,
							getSystemGroup: ::this.getSystemGroup
						}}
					/>
				</Spin>
			}
			</div>
		)
	}
}