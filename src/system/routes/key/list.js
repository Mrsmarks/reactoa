import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import KeyComp from 'system/components/key/list'
import { fetchSystemKey, delSystemKey, updateSystemKey, fetchAcidByCid } from 'system/actions'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 系统－第三方key－列表页路由
 */

@connect(
	({ systemKey }) => ({ 
		params: systemKey.get('params'),
		content: systemKey.get('content'),
		pending: systemKey.get('pending'),
		select: systemKey.get('select'),
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchSystemKey, delSystemKey, updateSystemKey, fetchAcidByCid }, dispatch)
	})
)

export default class HelpCompRoute extends React.Component {

	
	state={
		loading: false,
		updateLoading: false,
		loadOption: false
	}
	static storeName='systemKey'
	
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSystemKey({...props.location.query}))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchSystemKey() {
		return this.props.actions.fetchSystemKey(...arguments)
	}

	@autoLoading
	delSystemKey() {
		return this.props.actions.delSystemKey(...arguments)
	}

	@autoLoading.bind(this, 'loadOption')
	fetchAcidByCid() {
		return this.props.actions.fetchAcidByCid(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateSystemKey() {
		return this.props.actions.updateSystemKey(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children ?  this.props.children: 
				<Spin spinning={this.props.pending}>
					<KeyComp
						{...this.state}
						{...this.props}
						actions={{
							fetchSystemKey: ::this.fetchSystemKey,
							delSystemKey: ::this.delSystemKey,
							updateSystemKey: ::this.updateSystemKey,
							fetchAcidByCid: ::this.fetchAcidByCid
						}}
					/>
				</Spin>
			}
			</div>
		)
	}
}