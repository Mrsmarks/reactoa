import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Input from 'antd/lib/input'
import Form from 'antd/lib/form'
import Modal from 'antd/lib/modal'
import message from 'antd/lib/message'
import SeeModal from './seeModal'
import EditModal from './editModal'
import AddModal from './addModal'
import Popconfirm from 'antd/lib/popconfirm'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
const FormItem = Form.Item

@Key(['content'])
@Form.create()
export default class AdminComp extends React.Component{

	constructor(props, context) {
		super(props, context)
		this.state = {
			visible_1: false,
			visible_2: false,
			visible_3: false,
			info: {}
		}
	}

	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		listLoading: PropTypes.bool.isRequired,
		editLoading: PropTypes.bool.isRequired,
		addLoading: PropTypes.bool.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	renderToolBar() {
		const { getFieldProps } = this.props.form

		return(
			<div className="toolbar">
				<Form inline>
					<Auth type={["admin-add"]}>
						<Button type="primary" onClick={() => {
							this.toggleModal(undefined, 'visible_3')
						}}>
							<Icon type="plus"/>
							添加
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>
					<FormItem  label="账户：">
		    	        <Input type="text" {...getFieldProps('name')}/>
			        </FormItem>
			        <FormItem  label="组织机构编码：">
		    	        <Input type="text" {...getFieldProps('organization')}/>
			        </FormItem>
			        <FormItem  label="上级机构编码：">
		    	        <Input type="text" {...getFieldProps('parentid')}/>
			        </FormItem>
			        <Button onClick={::this.handleSearch} type="ghost">
						<Icon  type="search" />
						 查询
					</Button>	
			    </Form>
			</div>
		)
	}
	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/system/admin/list',
			query: query
		})
		this.props.actions.fetchAdminList(query)
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	this.context.router.push({
				pathname: '/system/admin/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchAdminList({page, ...values})
    	})
	}

	handleConfirm(obj) {
		const id = obj.id
		const params = this.props.params.toJS()
		this.props.actions.fetchDelAdminItem(id).then(reslove => {
			message.success(reslove.errormsg)
		})
	}

	toggleModal(info, visible) {
		if(info) {
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

	addAdmin(info) {
		const params = this.props.params.toJS()
		this.props.actions.addAdminItem(info).then(reslove => {
			if(reslove.errorcode == 0) {
					this.setState({visible_3: false})
					message.success(reslove.errormsg)
					this.props.actions.fetchAdminList({page:params.page})
			}
		})
	}

	editAdmin(info, id) {
		const params = this.props.params.toJS()
		this.props.actions.editAdminItem(info, id).then(reslove => {
			if(reslove.errorcode == 0) {
				this.setState({visible_2: false, info:reslove.result})
				message.success(reslove.errormsg)
				this.props.actions.fetchAdminList({page: params.page})
			}
		})
	}

	toGroupList(obj) {
		this.context.router.push({
			pathname: '/system/admin/edit',
			query: {
				id: obj.id
			}
		})
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const select = this.props.select.toJS()
        const option = this.props.option.toJS()
		const user = this.props.user.toJS()
		const toggleModal = (obj, visible) => _ => {
			return this.toggleModal(obj, visible)
		}
		const handleConfirm = (obj) => _ => {
			return this.handleConfirm(obj)
		}

		const toGroupList = obj => _ => {
			return this.toGroupList(obj)
		}
		const columns = [{
			title: '账户',
			dataIndex: 'username',
			key: 'username'
		}, {
			title: '组织机构编码',
			dataIndex: 'organization',
			key: 'organization'
		}, {
			title: '群组名称',
			dataIndex: 'admin_group_id',
			key: 'admin_group_id',
			render(groupId) {
				const obj = option.adminGroupList.find(item => item.id+'' == groupId)
				return(
					<span>
						{obj? obj.name: ''}
					</span>
				)
			}
		}, {
			title: '权限包',
			dataIndex: 'role',
			key: 'role',
			render(role) {
				const obj = option.authPackageList.find(item => item.id+'' == role)
				return(
					<span>
						{obj? obj.name: ''}
					</span>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(status, obj) {
				return (
					<div>
						<Auth type={["admin-check"]}>
							<a onClick={toggleModal(obj, 'visible_1')} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["admin-group-check"]}>
							<a hidden={obj.level!=3} style={{paddingRight:5}} onClick={toGroupList(obj)}>群组权限</a>
						</Auth>
						<Auth type={["admin-update"]}>
							<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["admin-delete"]}>
							<Popconfirm title="确定要删除这个管理员吗？" onConfirm={handleConfirm(obj)}>
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
				pagination = {pagination}
				loading={this.props.listLoading}
			/>
		)
	}

	
	render() {
		const select = this.props.select.toJS()
		const option = this.props.option.toJS()
		const user = this.props.user.toJS()
		return (
			<div>
				{this.renderToolBar()}
				{this.renderTable()}
				<SeeModal
					user={user} 
					select={option}
					toggle={::this.toggleModal}
					visible={this.state.visible_1}
					info={this.state.info}
					user={user}
				/>
				<EditModal
					user={user}
					select={select}
					option={option}
					toggle={::this.toggleModal}
					visible={this.state.visible_2}
					info={this.state.info}
					current={this.state.current}
					editAdmin={::this.editAdmin}
					editLoading={this.props.editLoading}
				/>
				<AddModal
					user={user}
					select={select}
					toggle={::this.toggleModal}
					getOrganizationDetail = {this.props.actions.getOrganizationDetail}
					addAdmin={::this.addAdmin}
					current={this.state.current}
					addLoading={this.props.addLoading}
					visible={this.state.visible_3}
					user={user}
				/>
				
			</div>
		)
	}
}