import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Spin from 'antd/lib/spin'

import QRCodeComp from 'wechat/components/qrcode/list'
import { fetchQRCodeSelect, fetchQRCodeList, editQRCode } from 'wechat/actions'
import autoLoading from 'Application/decorators/autoLoading'


/**
 * 微信－场景－列表页路由
 */

@connect(
	({ wechatQRCode }) => ({ 
		selectData: wechatQRCode.get('selectData'),
		content: wechatQRCode.get('content'),
		params: wechatQRCode.get('params'),
		pending: wechatQRCode.get('pending'),
		error: wechatQRCode.get('error')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchQRCodeSelect, fetchQRCodeList, editQRCode }, dispatch)
	})
)

export default class QRCodeRoute extends React.Component {

	state = {
		loading: false,
		submitLoading: false,
		editLoading: false
	}


	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchQRCodeList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchQRCodeList() {
		return this.props.actions.fetchQRCodeList(...arguments)
	}

	@autoLoading.bind(this, 'submitLoading')
	editQRCode() {
		return this.props.actions.editQRCode(...arguments)
	}

	@autoLoading.bind(this, 'editLoading')
	fetchQRCodeSelect() {
		return this.props.actions.fetchQRCodeSelect(...arguments)
	}


	render() {
		return (
			<Spin spinning={this.props.pending}>
				<QRCodeComp
					{...this.props}
					{...this.state}
					actions={{
						editQRCode: ::this.editQRCode,
						fetchQRCodeList: ::this.fetchQRCodeList,
						fetchQRCodeSelect: ::this.fetchQRCodeSelect
					}} 
				/>
			</Spin>
		)
	}
}