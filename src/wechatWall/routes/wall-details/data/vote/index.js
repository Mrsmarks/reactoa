import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import autoLoading from 'Application/decorators/autoLoading'
import { 
	fetchVoteList,
	fetchVotePeople
} from 'wechatWall/actions/wall-details/data/action'
import VoteComp from 'wechatWall/components/wall-details/data/vote/index'

/**
 * 微信墙－活动统计 - 投票 - 路由
 */

@connect(
	({ wallDetailVote, application }) => ({ 
		content: wallDetailVote.get('content'),
		people: wallDetailVote.get('people'),
		pending:  wallDetailVote.get('pending'),
		select: wallDetailVote.get('select'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({fetchVoteList, fetchVotePeople}, dispatch)
	})
)

export default class PhotoWallCompRoute extends React.Component {

	state = {
		loading: false,
		checkLoading: false,
	}

	static storeName = 'wallDetailVote'

	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchVoteList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchVoteList() {
		return this.props.actions.fetchVoteList(...arguments)
	}

	@autoLoading.bind(this, 'checkLoading')
	fetchVotePeople() {
		return this.props.actions.fetchVotePeople(...arguments)
	}


	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<VoteComp 
						{...this.props}
						{...this.state}
						actions={{
							fetchVoteList: ::this.fetchVoteList,
							fetchVotePeople: ::this.fetchVotePeople
						}}
					/>
				</Spin>
				}
			</div>
		)
	}
}