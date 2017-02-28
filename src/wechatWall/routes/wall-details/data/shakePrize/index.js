import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
import { 
	fetchShakePrizeList,
	exportShakePrizeList
	 } from 'wechatWall/actions/wall-details/data/action'
import ShakePrizeComp from 'wechatWall/components/wall-details/data/shakePrize/index'

/**
 * 微信墙－活动统计 - 摇大奖 - 路由
 */

@connect(
	({ wallDetailShakePrize, application }) => ({ 
		content: wallDetailShakePrize.get('content'),
		params: wallDetailShakePrize.get('params'),
		pending:  wallDetailShakePrize.get('pending'),
		select: wallDetailShakePrize.get('select'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({fetchShakePrizeList, exportShakePrizeList}, dispatch)
	})
)

export default class PhotoWallCompRoute extends React.Component {

	state = {
		loading: false
	}

	static storeName = 'wallDetailShakePrize'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchShakePrizeList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchShakePrizeList() {
		return this.props.actions.fetchShakePrizeList(...arguments)
	}

	@autoLoading
	exportShakePrizeList() {
		return this.props.actions.exportShakePrizeList(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<ShakePrizeComp 
						{...this.props}
						{...this.state}
						actions={{
							fetchShakePrizeList: ::this.fetchShakePrizeList,
							exportShakePrizeList: ::this.exportShakePrizeList
						}}
					/>
				</Spin>
				}
			</div>
		)
	}
}