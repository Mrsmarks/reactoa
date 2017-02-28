import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import LayoutComp from 'wechatWall/components/wall-details/setting/layout/index'
import { 
	settingLayoutList,
	updateLayoutList,
	addLayoutList,
	delLayoutList,
} from 'wechatWall/actions/wall-details/setting/action'
import { uploadFile } from  'Application/actions'

import Spin  from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/**
 * 微信－回复管理－列表页路由
 */

@connect(
	({ wallSettinglayout, application }) => ({ 
		content: wallSettinglayout.get('content'),
		params: wallSettinglayout.get('params'),
		pending:  wallSettinglayout.get('pending'),
		assetsUrl: application.getIn(['user', 'assets_domain'])
	}),
	dispatch => ({
		actions: bindActionCreators({ settingLayoutList, addLayoutList, updateLayoutList, delLayoutList, uploadFile }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false,
		fileLoading: false
	}
	static storeName = 'wallSettinglayout'
	static fillStore(redux, props) {
		return Promise.all([
			redux.dispatch(settingLayoutList({ ...props.location.query }))
		])
	}

	@autoLoading.bind(this, 'loading')
	settingLayoutList() {
		return this.props.actions.settingLayoutList(...arguments)
	}

	@autoLoading.bind(this, 'addLoading')
	addLayoutList() {
		return this.props.actions.addLayoutList(...arguments)
	}

	@autoLoading.bind(this, 'updateLoading')
	updateLayoutList() {
		return this.props.actions.updateLayoutList(...arguments)
	}

	@autoLoading
	delLayoutList() {
		return this.props.actions.delLayoutList(...arguments)
	}

	@autoLoading.bind(this, 'fileLoading')
	uploadFile() {
		return this.props.actions.uploadFile(...arguments)
	}

	render() {
		return (
			<div>
				{this.props.children? this.props.children: 
				<Spin spinning={this.props.pending}>
					<LayoutComp
					{...this.props}
					{...this.state}
					actions={{
						settingLayoutList: ::this.settingLayoutList,
						addLayoutList: ::this.addLayoutList,
						delLayoutList: ::this.delLayoutList,
						updateLayoutList: ::this.updateLayoutList,
						uploadFile: ::this.uploadFile
					}} 
					>
					</LayoutComp>
				</Spin>
				}
			</div>
			
		)
	}
}