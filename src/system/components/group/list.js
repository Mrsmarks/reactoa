import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import { Link } from 'react-router'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Upload from 'antd/lib/upload'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'

const FormItem = Form.Item


@Key(['content'])
@Form.create()
export default class ManagementComp extends React.Component{

	constructor(props, context) {
		super(props, context)
		this.state ={
			info: {},
			visible: false
		}
	}

	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
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


	handleConfirm(id) {
		const params = this.props.params.toJS()
		this.props.actions.delSystemGroup(id).then(reslove => {
			if(!reslove.errorcode) {
				message.success(reslove.errormsg)
			}
		})
	}

	// handleAdd(info) {
	// 	const params = this.props.params.toJS()
	// 	this.props.actions.updateSystemOrganization(info, 'add').then(reslove => {
	// 		if(reslove.errorcode == 0) {
	// 				this.setState({visible_1: false, info: {}})
	// 				message.success(reslove.errormsg)
	// 				// this.props.actions.fetchSystemOrganization({page: params.page})
	// 		}

	// 	})
		
	// }

	// handleEdit(id, info) {
	// 	const params = this.props.params.toJS()
	// 	this.props.actions.updateSystemOrganization(info, 'update', id).then(reslove => {
	// 		if(reslove.errorcode == 0) {
	// 				this.setState({visible_3: false, info: {}})
	// 				message.success(reslove.errormsg)
	// 				// this.props.actions.fetchSystemOrganization({page: params.page})
	// 		}
	// 	})
	// }

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const name = values.name
	      	const page = 1
	      	this.context.router.push({
				pathname: '/system/group/list',
				query: {
					page: page,
					name: name
				}
			})
			this.props.actions.fetchSystemGroup({page, name})
    	})
	}


	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/system/group/list',
			query: query
		})
		this.props.actions.fetchSystemGroup(query)
	}

	toAdd() {
		this.context.router.push({
			pathname: '/system/group/add'
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		return (
			<div className="toolbar">
				<Form inline>
					<Auth type={["system-group-add"]}>
						<Button  onClick={::this.toAdd} type="primary" >
							<Icon  type="plus" />
							添加
						</Button>	
					</Auth>
		        	<FormItem  label="名称：">
	    	        	<Input {...getFieldProps('name')} />
		        	</FormItem>
					<Button onClick={::this.handleSearch} type="ghost" >
						<Icon  type="search" />
						 查询
					</Button>					
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const toggleModal = (obj, visible) => _ => {
			this.toggleModal(obj, visible)
		}
		const handleConfirm = id => _ =>{
			return this.handleConfirm(id)
		}
		const columns = [{
			title: '企业名称',
			dataIndex: 'cpid_name',
			key: 'cpid_name',
		},{
			title: '群组名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '操作',
			key: 'operation',
			render(status, obj) {
				return (
					<div>
					<Auth type={["system-group-check"]}>
						<Link to={{ pathname: '/system/group/edit', query: { id: obj.id } }}>查看群组详情</Link>
					</Auth>
						<span style={{marginLeft: 5}}></span>
					<Auth type={["system-group-delete"]}>
						<Popconfirm title="确定要删除吗？" onConfirm={handleConfirm(obj.id)}>
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
			</div>
		)
	}
}