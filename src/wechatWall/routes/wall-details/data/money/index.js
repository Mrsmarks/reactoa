import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchMoneyList } from 'wechatWall/actions/wall-details/data/action'
import autoLoading from 'Application/decorators/autoLoading'
import PrizeComp from 'wechatWall/components/wall-details/data/money/index'
import Spin from 'antd/lib/spin'

/**
 * 微信墙－活动统计 - 数钱 - 路由
 */

@connect(
	({ wallDetailMoney, application }) => ({ 
		content: wallDetailMoney.get('content'),
		params: wallDetailMoney.get('params'),
		pending:  wallDetailMoney.get('pending'),
		select: wallDetailMoney.get('select'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchMoneyList }, dispatch)
	})
)

export default class PhotoWallCompRoute extends React.Component {

	state = {
		loading: false
	}

	static storeName = 'wallDetailMoney'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchMoneyList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchMoneyList() {
		return this.props.actions.fetchMoneyList(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<PrizeComp 
						{...this.props}
						{...this.state}
						actions={{
							fetchMoneyList: ::this.fetchMoneyList,
						}}
					/>
				</Spin>
				}
			</div>
		)
	}
}