import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'integral/components/user/user_credit'
import { 
	fetchSingerUserRecord,
	 } from 'integral/actions/action'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ integralUserRecord }) => ({ 
		singer_record: integralUserRecord.get('singer_record'),
		pending: integralUserRecord.get('pending'),
		total: integralUserRecord.get('total')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchSingerUserRecord }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
	}
	static storeName = 'integralUserRecord'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchSingerUserRecord({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchSingerUserRecord() {
		return this.props.actions.fetchSingerUserRecord(...arguments)
	}


	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<GroupComp
					{...this.props}
					{...this.state}
					actions={{
						fetchSingerUserRecord: ::this.fetchSingerUserRecord,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
		)
	}
}