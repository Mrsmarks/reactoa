import React, { PropTypes } from 'React'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PictureComp from 'cardVoucher/components/record/list'
import { fetchCardVoucherRecordList, fetchCardVoucherRecordSelector } from 'cardVoucher/actions'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统--列表页路由
 * 二维码
 */
 @connect(
	({ cardVoucherRecord, application }) => ({ 
		content: cardVoucherRecord.get('content'),
		params: cardVoucherRecord.get('params'),
		pending:  cardVoucherRecord.get('pending'),
		cardStatus:  cardVoucherRecord.get('cardStatus'),
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCardVoucherRecordList, fetchCardVoucherRecordSelector }, dispatch)
	})
)


export default class PictureCompRoute extends React.Component {
	state = {
		loading: false,
		delLoading: false
	}

	static storeName = 'cardVoucherRecord'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCardVoucherRecordList({ page:1,psize:10 })),
			redux.dispatch(fetchCardVoucherRecordSelector())
		])
	}

	@autoLoading.bind(this,'loading')
	fetchCardVoucherRecordList(){
		return this.props.actions.fetchCardVoucherRecordList(...arguments)
	}

	@autoLoading.bind(this,'delLoading')
	fetchCardVoucherRecordSelector() {
		return this.props.actions.fetchCardVoucherRecordSelector(...arguments)
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
							fetchCardVoucherRecordList: ::this.fetchCardVoucherRecordList,
							fetchCardVoucherRecordSelector: ::this.fetchCardVoucherRecordSelector
						}}
					>
					</PictureComp>
				</Spin>
			}
			</div>	
		)
	}


} 