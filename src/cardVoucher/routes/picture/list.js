import React, { PropTypes } from 'React'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PictureComp from 'cardVoucher/components/picture/list'
import { fetchCardVoucherPhotos, delCardVoucherPhotos } from 'cardVoucher/actions'
import { uploadFile } from  'Application/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统--列表页路由
 * 图片库
 */
 @connect(
	({ cardVoucherPic, application }) => ({ 
		content: cardVoucherPic.get('content'),
		params: cardVoucherPic.get('params'),
		pending:  cardVoucherPic.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCardVoucherPhotos, delCardVoucherPhotos, uploadFile }, dispatch)
	})
)


export default class PictureCompRoute extends React.Component {
	state = {
		loading: false,
		delLoading: false
	}

	static storeName = 'cardVoucherPic'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCardVoucherPhotos({ page:1,psize:10 }))
		])
	}

	@autoLoading.bind(this,'loading')
	fetchCardVoucherPhotos(){
		return this.props.actions.fetchCardVoucherPhotos(...arguments)
	}

	@autoLoading.bind(this,'delLoading')
	delCardVoucherPhotos() {
		return this.props.actions.delCardVoucherPhotos(...arguments)
	}

	render(){
		return(
			<div>
			{this.props.children? this.props.children:
				<Spin spinning={this.props.pending}>
					<PictureComp
						{...this.props}
						{...this.state}
						actions={{
							fetchCardVoucherPhotos: ::this.fetchCardVoucherPhotos,
							delCardVoucherPhotos: ::this.delCardVoucherPhotos
						}}
					>
					</PictureComp>
				</Spin>
			}
			</div>			
		)
	}
} 