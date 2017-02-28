import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'
import CustomerStatisticalComp from 'wechat/components/customer_statistical/list'
import { fetchCustomerStatisticalList } from 'wechat/actions'
import autoLoading from 'Application/decorators/autoLoading'
/**
 * 微信－客服统计－列表页路由
 */

@connect(
	({ wechatCustomerStatistical }) => ({ 
		content: wechatCustomerStatistical.get('content'),
		params: wechatCustomerStatistical.get('params'),
		pending: wechatCustomerStatistical.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCustomerStatisticalList }, dispatch)
	})
)
export default class GroupCompRoute extends React.Component {

	static fillStore(redux, props) {
		redux.dispatch(fetchCustomerStatisticalList({ ...props.location.query }))
	}

	state = {
		listLoading: false
	}

	@autoLoading.bind(this, 'listLoading')
	fetchCustomerStatisticalList() {
		return this.props.actions.fetchCustomerStatisticalList(...arguments)
	}

	render() {
		return (
			<Spin spinning={this.props.pending}>
				<CustomerStatisticalComp
					{...this.props}
					{...this.state}
					actions={{
						fetchCustomerStatisticalList: ::this.fetchCustomerStatisticalList
					}} 
				/>
			</Spin>
		)
	}
}