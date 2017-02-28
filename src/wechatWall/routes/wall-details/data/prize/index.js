import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
import { 
	fetchDrawDataById,
	checkDraw,
	checkDrawList,
	exportPrizeList
	 } from 'wechatWall/actions/wall-details/data/action'
import PrizeComp from 'wechatWall/components/wall-details/data/prize/index'

/**
 * 微信墙－活动统计 - 获奖情况 - 路由
 */

@connect(
	({ wallDetailPrize, application }) => ({ 
		content: wallDetailPrize.get('content'),
		params: wallDetailPrize.get('params'),
		pending:  wallDetailPrize.get('pending'),
		select: wallDetailPrize.get('select'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchDrawDataById, checkDraw, checkDrawList, exportPrizeList }, dispatch)
	})
)

export default class PhotoWallCompRoute extends React.Component {

	state = {
		loading: false,
		updateLoading: false
	}
	static storeName = 'wallDetailPrize'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchDrawDataById({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchDrawDataById() {
		return this.props.actions.fetchDrawDataById(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	checkDraw() {
		return this.props.actions.checkDraw(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	checkDrawList() {
		return this.props.actions.checkDrawList(...arguments)
	}

	@autoLoading
	exportPrizeList() {
		return this.props.actions.exportPrizeList(...arguments)
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
							fetchDrawDataById: ::this.fetchDrawDataById,
							checkDraw: ::this.checkDraw,
							checkDrawList: ::this.checkDrawList,
							exportPrizeList: ::this.exportPrizeList
						}}
					/>
				</Spin>
				}
			</div>
		)
	}
}