import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'
import OrganizationComp from 'system/components/organization/list'
import { fetchSystemOrganization, 
		updateSystemOrganization, 
		delSystemOrganization,
		 } from 'system/actions'
import { uploadExcelFile } from  'Application/actions'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 系统－机构管理－列表页路由
 */

@connect(
	({ systemOrganization, application }) => ({ 
		params: systemOrganization.get('params'),
		content: systemOrganization.get('content'),
		select: systemOrganization.get('select'),
		pending: systemOrganization.get('pending'),
		backend_domain: application.getIn(['user', 'backend_domain']),
		user: application.get('user')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchSystemOrganization, updateSystemOrganization, delSystemOrganization, uploadExcelFile }, dispatch)
	})
)

export default class HelpCompRoute extends React.Component {

	
	state={
		loading: false,
		updateLoading: false,
	}
	static storeName='systemOrganization'
	
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSystemOrganization({...props.location.query}))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchSystemOrganization() {
		return this.props.actions.fetchSystemOrganization(...arguments)
	}

	@autoLoading
	delSystemOrganization() {
		return this.props.actions.delSystemOrganization(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateSystemOrganization() {
		return this.props.actions.updateSystemOrganization(...arguments)
	}

	@autoLoading
	uploadExcelFile() {
		return this.props.actions.uploadExcelFile(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children ?  this.props.children: 
				<Spin spinning={this.props.pending}>
					<OrganizationComp
						{...this.state}
						{...this.props}
						actions={{
							fetchSystemOrganization: ::this.fetchSystemOrganization,
							delSystemOrganization: ::this.delSystemOrganization,
							updateSystemOrganization: ::this.updateSystemOrganization,
							uploadExcelFile: ::this.uploadExcelFile,

						}}
					/>
				</Spin>
			}
			</div>
		)
	}
}