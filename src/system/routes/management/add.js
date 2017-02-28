import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ManagementEditComp from 'system/components/management/add'
import { addManagementList } from 'system/actions'
import { uploadFile } from 'Application/actions'
import autoLoading from 'Application/decorators/autoLoading'


@connect(
	({ systemManagement, application }) => ({ 
		pending: systemManagement.get('pending'),
		option: systemManagement.get('option'),
		assets_domain: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ addManagementList, uploadFile }, dispatch)
	})
)
export default class managementCompRoute extends React.Component{
	state = {
		fileLoading: false,
	}
	@autoLoading
	addManagementList() {
		return this.props.actions.addManagementList(...arguments)
	}

	@autoLoading.bind(this, 'fileLoading')
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children:
					<ManagementEditComp
						{...this.props}
						{...this.state}
						actions= {{
							addManagementList: ::this.addManagementList,
							uploadFile: ::this.uploadFile
						}}
					>

					</ManagementEditComp>
				}
			</div>
		)
	}
}