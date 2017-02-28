import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
import { 
	fetchActivityDataById,
	setUserDrawStauts
} from 'wechatWall/actions/wall-details/data/action'
import StatisticsComp from 'wechatWall/components/wall-details/data/statistics/index'

/**
 * 微信墙－活动统计 - 活动统计 - 路由
 */

@connect(
	({ wallDetailStatistics }) => ({ 
		content: wallDetailStatistics.getIn(['content', 'list']),
		count: wallDetailStatistics.getIn(['content', 'count']),
		mess_count: wallDetailStatistics.getIn(['content', 'mess_count']),
		fensi_count: wallDetailStatistics.getIn(['content', 'fensi_count']),
		params: wallDetailStatistics.get('params'),
		pending:  wallDetailStatistics.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchActivityDataById, setUserDrawStauts }, dispatch)
	})
)

export default class PhotoWallCompRoute extends React.Component {

	state = {
		loading: false,
		updateLoading: false
	}
	static storeName = 'wallDetailStatistics'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchActivityDataById({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchActivityDataById() {
		return this.props.actions.fetchActivityDataById(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	setUserDrawStauts() {
		return this.props.actions.setUserDrawStauts(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<StatisticsComp 
						{...this.props}
						{...this.state}
						actions={{
							fetchActivityDataById: ::this.fetchActivityDataById,
							setUserDrawStauts: ::this.setUserDrawStauts
						}}
					/>
				</Spin>
				}
			</div>
		)
	}
}