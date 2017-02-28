import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ManagementEditComp from 'system/components/management/update'
import { checkManagementDetail, updateManagementList } from 'system/actions'
import { uploadFile } from 'Application/actions'
import autoLoading from 'Application/decorators/autoLoading'


@connect(
	({ systemManagement, application }) => ({ 
		pending: systemManagement.get('pending'),
		option: systemManagement.get('option'),
		info: systemManagement.get('info'),
		id: systemManagement.get('id'),
		assets_domain: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ checkManagementDetail, updateManagementList, uploadFile }, dispatch)
	})
)
export default class HelpEditCompRoute extends React.Component{

	state = {
		loading: false,
		fileLoading: false
	}
	static storeName = 'systemManagement'
	
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(checkManagementDetail({...props.location.query}))
		])
	}

	@autoLoading
	checkManagementDetail() {
		return this.props.actions.checkManagementDetail(...arguments)
	}

	@autoLoading
	updateManagementList() {
		return this.props.actions.updateManagementList(...arguments)
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
						actions={{
							checkManagementDetail: ::this.checkManagementDetail,
							updateManagementList: ::this.updateManagementList,
							uploadFile: ::this.uploadFile
						}}
					>

					</ManagementEditComp>
				}
			</div>
		)
	}
}