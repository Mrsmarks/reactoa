import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'
import StatusComp from 'system/components/status_code/list'
import { fetchStatusCodeList, addStatusCodeList, updateStatusCodeList } from 'system/actions'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 系统－管理员－列表页路由
 */

@connect(
	({ systemStatusCode }) => ({ 
		pending: systemStatusCode.get('pending'),
		params: systemStatusCode.get('params'),
		content: systemStatusCode.get('content'),
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchStatusCodeList, addStatusCodeList, updateStatusCodeList }, dispatch)
	})
)

export default class ManagementCompRoute extends React.Component {

	state = {
		listLoading: false,
		addLoading: false,
		updateLoading: false
	}

	static storeName = 'systemStatusCode'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchStatusCodeList({...props.location.query}))
		])
	}

	@autoLoading.bind(this, 'listLoading')
	fetchStatusCodeList() {
		return this.props.actions.fetchStatusCodeList(...arguments)
	}

	@autoLoading
	addStatusCodeList() {
		return this.props.actions.addStatusCodeList(...arguments)
	}

	@autoLoading
	updateStatusCodeList() {
		return this.props.actions.updateStatusCodeList(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children:
					<Spin spinning={this.props.pending}>
						<StatusComp
							{...this.props}
							{...this.state}
							actions={{
								fetchStatusCodeList: ::this.fetchStatusCodeList,
								addStatusCodeList: ::this.addStatusCodeList,
								updateStatusCodeList: ::this.updateStatusCodeList
						}}/>
					
					</Spin>
				}
			</div>
		)
	}
}