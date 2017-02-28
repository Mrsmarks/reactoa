import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Spin from 'antd/lib/spin'

import MenuComp from 'system/components/menu/list'
import { 
	initMenuListPage, 
	fetchMenuList, 
	fetchMenuType, 
	editMenu,
	removeMenu
} from 'system/actions'

import autoLoading from 'Application/decorators/autoLoading'
/**
 * 系统－菜单管理－微信
 */

@connect(
	({ systemMenu }) => ({ 
		systemMenu
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchMenuList, initMenuListPage, fetchMenuType, editMenu, removeMenu }, dispatch)
	})
)
export default class MenuCompRoute extends React.Component {
	static propTypes = {
		systemMenu: PropTypes.instanceOf(Immutable.Map).isRequired
	}

	state = {
		loading: false,
		addMenuLoading: false,
		modalLoading: false
	}

	static storeName = 'systemMenu'
	static fillStore(redux, props) {

		return Promise.all([
			redux.dispatch(initMenuListPage(props.params.id))
			//redux.dispatch(fetchMenuList(props.params.id))
		])
	}

	@autoLoading.bind(this, 'addMenuLoading')
	fetchMenuType() {
		return this.props.actions.fetchMenuType()
	}

	@autoLoading
	fetchMenuList() {
		return this.props.actions.fetchMenuList(...arguments)
	}

	@autoLoading
	initMenuListPage() {
		return this.props.actions.initMenuListPage(...arguments)
	}

	@autoLoading.bind(this, 'modalLoading')
	editMenu() {
		return this.props.actions.editMenu(...arguments)
	}

	@autoLoading
	removeMenu() {
		return this.props.actions.editMenu(...arguments)
	}

	
	render() {

		const systemMenu = this.props.systemMenu
		return (
			<Spin spinning={systemMenu.get('pending')}>
				<MenuComp
					menuDetails={systemMenu.get('menuDetails')}
					menuList={systemMenu.get('menuList')}
					current={systemMenu.get('currentKey')}
					menuType={systemMenu.get('menuType')}
					error={systemMenu.get('error')}
					loading={this.state.loading}
					addMenuLoading={this.state.addMenuLoading}
					modalLoading={this.state.modalLoading}
					actions={{
						fetchMenuList: ::this.fetchMenuList,
						fetchMenuType: ::this.fetchMenuType,
						editMenu: ::this.editMenu,
						removeMenu: ::this.removeMenu,
						initMenuListPage: ::this.initMenuListPage
					}}
				/>
			</Spin>
		)
	}
}