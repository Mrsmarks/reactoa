import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Button from 'antd/lib/button'

import Table from 'antd/lib/table'

import Menu from 'antd/lib/menu'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import Auth from 'Application/components/auth'

import AddModal from './addModal'
import EditModal from './editModal'

const Item = Menu.Item
import onError from 'Application/decorators/onError'

@onError('initMenuListPage')
export default class MenuComp extends React.Component{
	static propTypes = {
		menuDetails: PropTypes.instanceOf(Immutable.Map).isRequired,
		menuList: PropTypes.instanceOf(Immutable.List).isRequired,
		menuType: PropTypes.instanceOf(Immutable.List).isRequired,
		loading: PropTypes.bool.isRequired,
		addMenuLoading: PropTypes.bool.isRequired,
		modalLoading: PropTypes.bool.isRequired,
		actions: PropTypes.object.isRequired,
		current: PropTypes.number.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	constructor(props) {
		super(props)
		this.state = {
			dataSource: this.parseData(props.menuDetails),
			current: '',
			expandedRowKeys: ['defaultKey'],
			editModalData: {},
			addModalData: {},
			addModalVisible: false,
			editModalVisible: false
		}

	}

	parseData(content) {
		content = content.toJS()
		content.key = 'defaultKey'
		content.__add__ = true
		content.__deep__ = 1
		let data = [content]
		if (data[0].child) {
			data[0].children = this.walkData(data[0].child, data[0].name)
			delete data[0].child
		} else {
			data = []
		}

		return data
	}

	walkData(content, parentName) {
		const data = []
		let deep = 1
		for (let item in content) {
			const obj = content[item]
			obj.key = Math.random()
			obj.parentName = parentName
			data.push(obj)
			if (obj.child || obj.level != 4) {
				obj.__add__ = true
				obj.__deep__ = deep += 1
				obj.children = obj.child ? this.walkData(obj.child, obj.name) : []
				delete obj.child
			}
		}
		return data
	}

	componentWillReceiveProps(nextProps) {
		const dataSource = this.parseData(nextProps.menuDetails)
		this.setState({
			dataSource
		})
	}

	handleClick(obj) {
		if (!obj.key) {
			return
		}
		this.context.router.push(`/system/menu/list/${obj.key}`)
		//this.props.actions.fetchMenuList(obj.key)
		this.setState({
			current: obj.key
		})
	}

	shownAddModal(addModalData = {}) {
		if (this.props.menuType.size) {
			return this.setState({
				addModalVisible: true,
				addModalData
			})
		}

		this.props.actions.fetchMenuType().then(x => {
			this.setState({
				addModalVisible: true,
				addModalData
			})
		})
	}

	shownEditModal(editModalData) {
		this.setState({
			editModalData,
			editModalVisible: true
		})
	}

	// 保存菜单
	editMenu(data) {
		//{ name, auth, url, type, sort }
		this.props.actions.editMenu(...arguments).then(x => {
			message.success(x.errormsg)
			this.cancelModal()

			// 添加的是1级主菜单
			if (!data.parent_id) {
				this.handleClick({ key: (this.state.current || this.props.current) + '' })
			} else {
				this.props.actions.fetchMenuList(this.state.current)
			}
		})
	}

	cancelModal() {
		this.setState({
			addModalVisible: false,
			editModalVisible: false
		})
	}

	removeMenu(id) {
		this.props.actions.removeMenu({}, 'delete', id).then(x => {
			message.success(x.errormsg)
			this.props.actions.fetchMenuList(this.state.current)
		})
	}

	onExpandedRowsChange(keys) {
		this.setState({
			expandedRowKeys: keys
		})
	}

	renderToolbar() {

		return (
			<div className="toolbar">
				<Menu 
					onClick={::this.handleClick}
					mode="horizontal"
					selectedKeys={[this.state.current || this.props.current+'']}
				>
					{
						this.props.menuList.toJS().map(item => 
							<Item key={item.id}>{item.name}</Item>
						)
					}
					
				</Menu>	
				<Auth type={["system-menu-add"]}>
					<div style={{ display: 'inline-block', float: 'right', marginTop: -46 }}>
						<Button type="primary" onClick={this.shownAddModal.bind(this, {})} loading={this.props.addMenuLoading}>添加主菜单</Button>
					</div>
				</Auth>
			</div>
		)
	}

	renderTable() {
		const shownEditModal = obj => _ => {
			this.shownEditModal(obj)
		}

		const removeMenu = id => _ => {
			this.removeMenu(id)
		}

		const shownAddModal = obj => _ => {
			this.shownAddModal(obj)
		}

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '权限名',
			dataIndex: 'auth',
			key: 'auth'
		}, {
			title: '菜单地址',
			dataIndex: 'url',
			key: 'url',
		}, {
			title: '排序',
			dataIndex: 'sort',
			key: 'sort',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["system-menu-check"]}>
							<a onClick={shownEditModal(obj)}>编辑</a>
						</Auth>
						{' '}
						<Auth type={["system-menu-delete"]}>
							<Popconfirm title="确定删除吗？" onConfirm={removeMenu(obj.id)}>
								<a href="javascript:;">删除</a>
							</Popconfirm>
						</Auth>
						{' '}
						{
							obj.__add__ && <Auth type={["system-menu-add"]}><a onClick={shownAddModal(obj)}>添加</a></Auth>
						}
					</div>
				)
			}
		}]
		return (
			<Table 
				dataSource={this.state.dataSource}
				columns={columns}
				pagination={false}
				loading={this.props.loading}
				// locale={{
				// 	emptyText: this.props.nnnn || '暂无数据'
				// }}
				expandedRowKeys={this.state.expandedRowKeys}
				onExpandedRowsChange={::this.onExpandedRowsChange}
			/>
		)
	}



	render() {

		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<AddModal 
					visible={this.state.addModalVisible}
					onSubmit={::this.editMenu}
					onCancel={::this.cancelModal}
					menuType={this.props.menuType}
					loading={this.props.modalLoading}
					data={this.state.addModalData}
				/>
				<EditModal 
					visible={this.state.editModalVisible}
					data={this.state.editModalData}
					onSubmit={::this.editMenu}
					onCancel={::this.cancelModal}
					loading={this.props.modalLoading}
				/>
			</div>
		)
	}
}