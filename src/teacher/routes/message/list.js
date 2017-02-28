import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import GroupComp from 'teacher/components/message/list'
import { 
	fetchTeacherMessageList,
	 } from 'teacher/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ teacherMessage }) => ({ 
		content: teacherMessage.get('content'),
		option: teacherMessage.get('option'),
		params: teacherMessage.get('params'),
		pending:  teacherMessage.get('pending')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchTeacherMessageList }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
	}
	static storeName = 'teacherMessage'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(fetchTeacherMessageList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	fetchTeacherMessageList() {
		return this.props.actions.fetchTeacherMessageList(...arguments)
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
						fetchTeacherMessageList: ::this.fetchTeacherMessageList,
					}} 
					>
					</GroupComp>
				</Spin>
				}
			</div>
			
		)
	}
}