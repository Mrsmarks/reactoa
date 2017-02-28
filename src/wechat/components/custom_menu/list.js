import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Key from 'Application/decorators/key'
import onError from 'Application/decorators/onError'

import AddModal from './addModal'
import SeeModal from './seeModal'
import EditModal from './editModal'
import Auth from 'Application/components/auth'

const FormItem = Form.Item



@Key(['content'])
@Form.create()
@onError('fetchCustomMenuList')
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
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
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
	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const name = values.name
	      	const page = 1
	      	this.context.router.push({
				pathname: '/wechat/custom-menu/list',
				query: {
					page: page,
					name: name
				}
			})
			this.props.actions.fetchCustomMenuList({page, name})
    	})
	}

	handleAdd(info) {
		const params = this.props.params.toJS()
		this.props.actions.addCustomMenuList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
			// this.props.actions.fetchCustomMenuList({params: params.page})
		})	
	}

	handleUpdate(info, id) {
		const params = this.props.params.toJS()
		this.props.actions.updateCustomMenuList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_3: false, info: resolve.result })
			// this.props.actions.fetchCustomMenuList({params: params.page})
		})	
	}

	handleRemove(id) {
		const params = this.props.params.toJS()
		this.props.actions.delCustomMenuList(id).then(resolve => {
			message.success(resolve.errormsg)
			// this.props.actions.fetchCustomMenuList({params: params.page})
		})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wechat/custom-menu/list',
			query: query
		})
		this.props.actions.fetchCustomMenuList(query)
	}

	addMenuPackage(menuId) {
		this.context.router.push({
			pathname: '/wechat/add-menu-package/list',
			query: {
				menuId: menuId
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
					<Auth type={["wechat-personal-menu-add"]}>
						<Button type="primary" onClick={() => {this.toggleModal(undefined, 'visible_1')}}>
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>
					<FormItem  label="名称：">
	    	        	<Input {...nameProps} type="text"/>
		        	</FormItem>
						<Button onClick={::this.handleSearch} type="primary" >
							<Icon type="search" />
							 查询
						</Button>	
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const toggleModal = (obj, visible, initChildSource) => _ => {
			return this.toggleModal(obj, visible, initChildSource)
		}
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}
		const addMenuPackage = menuId => _ => {
			return this.addMenuPackage(menuId)
		}
		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '备注',
			dataIndex: 'remark',
			key: 'remark'
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				// const authConfig = {
				// 	dpid: obj.dpid,
				// 	nid: obj.nid,
				// 	cpid: obj.cpid,
				// 	uid: obj.create_user
				// }
				return (
					<div>
						<Auth 
							type={["wechat-personal-menu-pack"]}
						>
							<a onClick={addMenuPackage(obj.id)} style={{paddingRight:5}}>编辑菜单包</a>
						</Auth>
						<Auth type={["wechat-personal-menu-check"]}>
							<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth 
							type={["wechat-personal-menu-update"]}
						>
							<a onClick={toggleModal(obj, 'visible_3')}style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth 
							type={["wechat-personal-menu-delete"]}
						>
							<Popconfirm title="确定要删除吗？" onConfirm={handleRemove(obj.id)}>
								<a>删除</a>
							</Popconfirm>
						</Auth>
					</div>
				)
			}
		}]

		const params = this.props.params.toJS()
		const pagination = {
			total: +params.count,
			current: +params.page,
			onChange: ::this.handlePageChange,
			showSizeChanger: true,
			pageSize: +params.psize,
			onShowSizeChange: ::this.handlePageChange,
			showTotal: function() {
				return `共${params.count}条`
			}.bind(this)
		}	

		return (
			<Table 
				dataSource={dataSource}
				columns={columns}
				pagination={pagination}
				loading={this.props.loading}
			/>
		)
	}


	render() {
		return (
			<div>
			   {this.renderToolbar()}
			   {this.renderTable()}
			   <AddModal
					info={this.state.info}
					visible={this.state.visible_1}
					handleAdd={::this.handleAdd}
					addLoading={this.props.addLoading}
					toggle={::this.toggleModal}
				/>
				<SeeModal 
					info={this.state.info}
					visible={this.state.visible_2}
					toggle={::this.toggleModal}
				/>
				<EditModal 
					info={this.state.info}
					visible={this.state.visible_3}
					handleUpdate={::this.handleUpdate}
					updateLoading={this.props.addLoading}
					toggle={::this.toggleModal}
				/>
			</div>
		)
	}
}