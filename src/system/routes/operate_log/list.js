import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'
import LogComp from 'system/components/operate_log/list'
import { fetchSystemLog } from 'system/actions'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 系统－管理员操作日志－列表页路由
 */

@connect(
	({ systemOperateLog }) => ({ 
		pending: systemOperateLog.get('pending'),
		params: systemOperateLog.get('params'),
		content: systemOperateLog.get('content'),
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchSystemLog }, dispatch)
	})
)

export default class ManagementCompRoute extends React.Component {

	state = {
		listLoading: false,
	}

	static storeName = 'systemOperateLog'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSystemLog({...props.location.query}))
		])
	}

	@autoLoading.bind(this, 'listLoading')
	fetchSystemLog() {
		return this.props.actions.fetchSystemLog(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children:
					<Spin spinning={this.props.pending}>
						<LogComp
							{...this.props}
							{...this.state}
							actions={{
								fetchSystemLog: ::this.fetchSystemLog,
						}}/>
					
					</Spin>
				}
			</div>
		)
	}
}