import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'teacher/components/user/list'
import { 
	fetchTeacherUserList,
	 } from 'teacher/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ teacherUser }) => ({ 
		content: teacherUser.get('content'),
		option: teacherUser.get('option'),
		params: teacherUser.get('params'),
		pending:  teacherUser.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchTeacherUserList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
	}
	static storeName = 'teacherUser'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchTeacherUserList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchTeacherUserList() {
		return this.props.actions.fetchTeacherUserList(...arguments)
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
						fetchTeacherUserList: ::this.fetchTeacherUserList,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}