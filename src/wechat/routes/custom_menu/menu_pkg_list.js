import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'

import CustomMenuPkgComp from 'wechat/components/custom_menu/MenuPackageList'
import autoLoading from 'Application/decorators/autoLoading'
import { 
	fetchMenuPackageList,
	addMenuPackageList,
	updateMenuPackageList,
	delMenuPackageList,
	updateMenuPackageStatus,
	updateMenuPackageSort
 } from 'wechat/actions'

/**
 * 微信－个性化菜单－列表页路由
 */

@connect(
	({ wechatCustomMenuPkg }) => ({ 
		content: wechatCustomMenuPkg.get('content'),
		pending:  wechatCustomMenuPkg.get('pending'),
		select: wechatCustomMenuPkg.get('select')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchMenuPackageList, addMenuPackageList, updateMenuPackageList, delMenuPackageList, updateMenuPackageStatus, updateMenuPackageSort }, dispatch)
	})
)

export default class GroupCompRoute extends React.Component {

	state = {
		loading: false,
		addLoading: false,
		updateLoading: false
	}
	static storeName = 'wechatCustomMenuPkg'
	static fillStore(redux, props) {
		redux.dispatch(fetchMenuPackageList({ ...props.location.query }))
	}
	@autoLoading.bind(this, 'loading')
	fetchMenuPackageList() {
		return this.props.actions.fetchMenuPackageList( ...arguments )
	}

	@autoLoading.bind(this, 'addLoading')
	addMenuPackageList() {
		return this.props.actions.addMenuPackageList( ...arguments )
	}

	@autoLoading.bind(this, 'updateLoading')
	updateMenuPackageList() {
		return this.props.actions.updateMenuPackageList( ...arguments )
	}

	@autoLoading
	delMenuPackageList() {
		return this.props.actions.delMenuPackageList( ...arguments )
	}

	@autoLoading.bind(this, 'updateLoading')
	updateMenuPackageStatus() {
		return this.props.actions.updateMenuPackageStatus( ...arguments )
	}

	@autoLoading
	updateMenuPackageSort() {
		return this.props.actions.updateMenuPackageSort( ...arguments )
	}


	render() {
		return (
			<div>
				{this.props.children? this.props.children:
				<Spin spinning={this.props.pending}>
					<CustomMenuPkgComp
						{...this.props}
						{...this.state}
						actions={{
							fetchMenuPackageList: ::this.fetchMenuPackageList,
							addMenuPackageList: ::this.addMenuPackageList,
							updateMenuPackageList: ::this.updateMenuPackageList,
							delMenuPackageList: ::this.delMenuPackageList,
							updateMenuPackageStatus: ::this.updateMenuPackageStatus,
							updateMenuPackageSort: ::this.updateMenuPackageSort
						}} 
					></CustomMenuPkgComp>
				</Spin>}
			</div>
		)
	}
}