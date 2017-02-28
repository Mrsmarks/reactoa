import React, { PropTypes } from 'React'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PictureComp from 'cardVoucher/components/route/list'
import { fetchCardVoucherRoutes, delCardVoucherRoute } from 'cardVoucher/actions'
import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统--列表页路由
 * 路由
 */
 @connect(
	({ cardVoucherRoute, application }) => ({ 
		content: cardVoucherRoute.get('content'),
		params: cardVoucherRoute.get('params'),
		pending:  cardVoucherRoute.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchCardVoucherRoutes, delCardVoucherRoute }, dispatch)
	})
)


export default class PictureCompRoute extends React.Component {
	state = {
		loading: false,
		delLoading: false
	}

	static storeName = 'cardVoucherRoute'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchCardVoucherRoutes({...props.location.query }))
		])
	}

	@autoLoading.bind(this,'loading')
	fetchCardVoucherRoutes(){
		return this.props.actions.fetchCardVoucherRoutes(...arguments)
	}

	@autoLoading
	delCardVoucherRoute() {
		return this.props.actions.delCardVoucherRoute(...arguments)
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
							fetchCardVoucherRoutes: ::this.fetchCardVoucherRoutes,
							delCardVoucherRoute: ::this.delCardVoucherRoute
						}}
					>
					</PictureComp>
				</Spin>
			}
			</div>	
		)
	}


} 