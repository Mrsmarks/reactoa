import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Switch from 'antd/lib/switch'

import Form from 'antd/lib/form'


import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Auth from 'Application/components/auth'

import AddModal from './addMenuPackageList'
import EditModal from './updateMenuPackageList'
import SeeModal from './seeMenuPackageList'

const FormItem = Form.Item


@Form.create()
export default class CustomMenuComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info: {},
			visible_1: false,
			visible_2: false,
			visible_3: false
		}
	}

	static propTypes= {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		select: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		location: PropTypes.object.isRequired,
		router: PropTypes.object.isRequired
	}

	toggleModal(info, visible, cb) {
		if(info) {
			if(cb) {
				cb(info)
			}
			this.setState({
				[visible]: !this.state[visible],
				info: info
			})
		}else{
			this.setState({
				[visible]: !this.state[visible],
			})
		}	
	}

	handleAdd(info,key) {
		const menuId = this.context.location.query.menuId
		this.props.actions.addMenuPackageList(info, key, menuId).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false, info: {} })
			this.props.actions.fetchMenuPackageList(this.context.location.query)
		})	
	}

	handleUpdate(info, pKey, cKey) {
		const menuId = this.context.location.query.menuId
		this.props.actions.updateMenuPackageList(info, menuId, pKey, cKey).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_3: false, info: resolve.result} )
			this.props.actions.fetchMenuPackageList(this.context.location.query)
		})	
	}

	handleRemove(obj) {
		const menuId = this.context.location.query.menuId
		if(obj.children) obj.childKey = 'undefined'
		this.props.actions.delMenuPackageList(menuId, obj.parentKey, obj.childKey).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchMenuPackageList(this.context.location.query)
		})
	}

	addMenuPackage(menuId) {
		this.context.router.push({
			pathname: '/wechat/add-menu-package/list',
			query: {
				menuId: menuId
			}
		})
	}

	changeStatus(obj) {
		const menuId = this.context.location.query.menuId
		if(obj.children) obj.childKey = 'undefined'
		this.props.actions.updateMenuPackageStatus(menuId, obj.parentKey, obj.childKey ).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchMenuPackageList(this.context.location.query)
		})
	}

	changeSort(obj, type) {
		const menuId = this.context.location.query.menuId
		const childKey = obj.childKey || obj.childKey == 0? obj.childKey: ''
		this.props.actions.updateMenuPackageSort(menuId, obj.parentKey, childKey, type).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchMenuPackageList(this.context.location.query)
		})
	}

	addChildrenKey(list) {
		list.forEach((item, index) => {
            item.key = index
			if(item.children.length != 0) {
				item.children.forEach(item => {
					item.key = item.id
				})
			}
		})
	}


	renderToolbar() {
		const { getFieldProps } = this.props.form
			
		const nameProps = getFieldProps('name', {
			
		})
		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["wechat-personal-menu-pack-add"]}>
						<Button type="primary" onClick={() => {this.toggleModal(undefined, 'visible_1')}}>
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		this.addChildrenKey(dataSource)
		const select = this.props.select.toJS()
		const toggleModal = (obj, visible, initChildSource) => _ => {
			return this.toggleModal(obj, visible, initChildSource)
		}
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}
		const addMenuPackage = menuId => _ => {
			return this.addMenuPackage(menuId)
		}

		const typeName = (list, key) => {
			var value = ''
			list.forEach(item => {
				if(item.key == key){
					value = item.value
					return
				}
			})
			return value
		}

		const addChildKey = (dataSource) =>{
			dataSource.forEach(item => {
				if(item.children) {
					item.children.forEach((child, index)=> {
						child.childKey = index
						child.parentKey = item.parentKey
					})
				}
			})
		}

		const addFunc = obj => {
			if(obj.children) {
				return (
					<a onClick={toggleModal(obj, 'visible_1')} style={{paddingRight:5}}>添加</a>
				)
			}
		}

		const changeStatus = obj => _ => {
			return this.changeStatus(obj)
		}

		const changeSort = (obj, type) => _ => {
			return this.changeSort(obj, type)
		}

		addChildKey(dataSource)
		const columns = [
		{
			title: '菜单包名称',
			dataIndex: 'primary_name',
			key: 'primary_name'
		}, {
			title: '菜单按钮名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '菜单按钮类型',
			dataIndex: 'type',
			key: 'type',
			render(type) {
				return (
					<span>{typeName(select.menuType, type)}</span>
				)
			}
		}, {
			title: '菜单按钮值',
			dataIndex: 'content',
			key: 'content',
			render(value, obj) {
				var content = ''
				switch(obj.type){
					case 'view_limited':
					var obj1 = select.allMaterial.find(item => item.id == value)
					content = obj1? obj1.name: ''
					break
					case 'media_id':
					let obj2 = select.allTxt.find(item => item.id == value)
					content = obj2? obj2.name: ''
					break
					default:
					content =  value
				}
				return (
					<span>{content}</span>
				)
			}
		}, {
			title: '启用状态',
			dataIndex: 'enabled',
			key: 'enabled',
			render(status, obj) {
				return(
					<Switch onChange={changeStatus(obj)} defaultChecked={status}/>
				)
			}
		}, {
			title: '排序',
			key: 'sort',
			render(status, obj) {
				return(
					<div>
						<div><a><Icon onClick={changeSort(obj, 'up')} type="caret-up"/></a></div>
						<div><a><Icon onClick={changeSort(obj, 'down')} type="caret-down"/></a></div>
					</div>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						{addFunc(obj)}
						<Auth type={["wechat-personal-menu-pack-che"]}>
							<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["wechat-personal-menu-pack-upd"]}>
							<a onClick={toggleModal(obj, 'visible_3')}style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["wechat-personal-menu-pack-del"]}>
							<Popconfirm title="确定要删除吗？" onConfirm={handleRemove(obj)}>
								<a>删除</a>
							</Popconfirm>
						</Auth>
					</div>
				)
			}
		}]
		return (
			<Table 
				dataSource={dataSource}
				columns={columns}
				loading={this.props.loading}
				pagination={false}
			/>
		)
	}


	render() {
		const select = this.props.select.toJS()
		return (
			<div>
			   {this.renderToolbar()}
			   {this.renderTable()}
			   <AddModal
					info={this.state.info}
					select={select}
					visible={this.state.visible_1}
					handleAdd={::this.handleAdd}
					addLoading={this.props.addLoading}
					toggle={::this.toggleModal}
				/>
				<SeeModal
					info={this.state.info}
					select={select}
					visible={this.state.visible_2}
					toggle={::this.toggleModal}
				/>
				<EditModal 
					info={this.state.info}
					select={select}
					visible={this.state.visible_3}
					handleUpdate={::this.handleUpdate}
					updateLoading={this.props.updateLoading}
					toggle={::this.toggleModal}
				/>
			</div>
		)
	}
}