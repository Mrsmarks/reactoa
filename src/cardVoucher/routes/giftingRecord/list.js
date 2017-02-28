import React, { PropTypes } from 'React'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PictureComp from 'cardVoucher/components/giftingRecord/list'
import { fetchCardVoucherGiftingRecordList  } from 'cardVoucher/actions'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统--列表页路由
 * 二维码
 */
 @connect(
	({ cardVoucherGiftingRecord, application }) => ({ 
		content: cardVoucherGiftingRecord.get('content'),
		params: cardVoucherGiftingRecord.get('params'),
		pending:  cardVoucherGiftingRecord.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCardVoucherGiftingRecordList  }, dispatch)
	})
)


export default class PictureCompRoute extends React.Component {
	state = {
		loading: false,
		delLoading: false
	}

	static storeName = 'cardVoucherGiftingRecord'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCardVoucherGiftingRecordList({ page:1,psize:10 }))
		])
	}

	@autoLoading.bind(this,'loading')
	fetchCardVoucherGiftingRecordList(){
		return this.props.actions.fetchCardVoucherGiftingRecordList(...arguments)
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
							fetchCardVoucherGiftingRecordList: ::this.fetchCardVoucherGiftingRecordList
						}}
					>
					</PictureComp>
				</Spin>
			}
			</div>	
		)
	}


} 