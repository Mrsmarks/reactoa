import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
import { fetchShakeDataList, exportShakeDataList } from 'wechatWall/actions/wall-details/data/action'
import PrizeComp from 'wechatWall/components/wall-details/data/shake/index'

/**
 * 微信墙－活动统计 - 摇一摇 - 路由
 */

@connect(
	({ wallDetailShake, application }) => ({ 
		content: wallDetailShake.get('content'),
		params: wallDetailShake.get('params'),
		pending:  wallDetailShake.get('pending'),
		select: wallDetailShake.get('select'),
		backend_domain: application.getIn(['user', 'backend_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchShakeDataList, exportShakeDataList }, dispatch)
	})
)

export default class PhotoWallCompRoute extends React.Component {

	state = {
		loading: false
	}

	static storeName = 'wallDetailShake'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchShakeDataList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchShakeDataList() {
		return this.props.actions.fetchShakeDataList(...arguments)
	}

	@autoLoading
	exportShakeDataList() {
		return this.props.actions.exportShakeDataList(...arguments)
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
							fetchShakeDataList: ::this.fetchShakeDataList,
							exportShakeDataList: ::this.exportShakeDataList
						}}
					/>
				</Spin>
				}
			</div>
		)
	}
}