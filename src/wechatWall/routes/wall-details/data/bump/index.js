import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
import { fetchBumpList } from 'wechatWall/actions/wall-details/data/action'
import BumpComp from 'wechatWall/components/wall-details/data/bump/index'

/**
 * 微信墙－活动统计－对对碰 - 路由
 */

@connect(
	({ wallDetailBump, application }) => ({ 
		content: wallDetailBump.get('content'),
		params: wallDetailBump.get('params'),
		pending:  wallDetailBump.get('pending'),
		assets_domain: application.get('assets_domain')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchBumpList }, dispatch)
	})
)

export default class PhotoWallCompRoute extends React.Component {
	state = {
		loading: false
	}

	static storeName = 'wallDetailBump'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchBumpList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchBumpList() {
		return this.props.actions.fetchBumpList(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<BumpComp 
						{...this.props}
						{...this.state}
						actions={{
							fetchBumpList: ::this.fetchBumpList
						}}
					/>
				</Spin>
				}
			</div>
		)
	}
}