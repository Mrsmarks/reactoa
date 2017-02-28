import React, { PropTypes } from 'React'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PictureComp from 'cardVoucher/components/shelves/list'
import { fetchCardVoucherQrcodeList, delCardVoucherQrcode, generateCardVoucherQrcode } from 'cardVoucher/actions'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统--列表页路由
 * 二维码
 */
 @connect(
	({ cardVoucherShelves, application }) => ({ 
		content: cardVoucherShelves.get('content'),
		params: cardVoucherShelves.get('params'),
		pending:  cardVoucherShelves.get('pending'),
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCardVoucherQrcodeList, delCardVoucherQrcode, generateCardVoucherQrcode }, dispatch)
	})
)


export default class PictureCompRoute extends React.Component {
	state = {
		loading: false,
		delLoading: false
	}

	static storeName = 'cardVoucherShelves'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCardVoucherQrcodeList({ page:1,psize:10 }))
		])
	}

	@autoLoading.bind(this,'loading')
	fetchCardVoucherQrcodeList(){
		return this.props.actions.fetchCardVoucherQrcodeList(...arguments)
	}

	@autoLoading.bind(this,'delLoading')
	delCardVoucherQrcode() {
		return this.props.actions.delCardVoucherQrcode(...arguments)
	}
	generateCardVoucherQrcode() {
		return this.props.actions.generateCardVoucherQrcode(...arguments)
	}
	render(){
		return(
			<div>
			{
				this.props.children ? this.props.children:
				<Spin spinning={this.props.pending}>
					<PictureComp
						{...this.props}
						{...this.state}
						actions={{
							fetchCardVoucherQrcodeList: ::this.fetchCardVoucherQrcodeList,
							generateCardVoucherQrcode: ::this.generateCardVoucherQrcode,
							delCardVoucherQrcode: ::this.delCardVoucherQrcode
						}}
					>
					</PictureComp>
				</Spin>
			}
			</div>	
		)
	}


} 