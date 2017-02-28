import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Popconfirm from 'antd/lib/popconfirm'
import MainModal from './mainModal'
import Key from 'Application/decorators/key'
import message from 'antd/lib/message'
import Auth from 'Application/components/auth'


const FormItem = Form.Item


@Key(['content'])
@Form.create()
export default class ManagementComp extends React.Component{

	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired,
		listLoading: PropTypes.bool.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	constructor(props, context) {
		super(props, context)
		this.state = {
			visible: false,
			info: {}
		}
	}

	toggleModal(info, visible) {
		if(info) {
			this.setState({
				[visible]: !this.state.visible,
				info: info
			})
		}else{
			this.setState({
				[visible]: !this.state.visible,
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
	      	const contact = values.contact 
	      	const page = 1
	      	this.context.router.push({
				pathname: '/system/management/list',
				query: {
					page: page,
					name: name,
					contact: contact
				}
			})
			this.props.actions.fetchManagementList({page, name, contact})
    	})
	}

	toChildRoute(path, id) {
		if(id) {
			this.context.router.push({
				pathname: path,
				query: {
					id: id
				}
			})
		}else{
			this.context.router.push({pathname: path})
		}
		
	}
	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/system/management/list',
			query: query
		})
		this.props.actions.fetchManagementList(query)
	}

	handleConfirm(id) {
		this.props.actions.delManagementList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const nameProps = getFieldProps('name', {
			
		})
		const contactProps = getFieldProps('contact', {
			
		})
		return (
			<div className="toolbar">
				<Form inline>
					<Auth type={["company-add"]}>
						<Button onClick={() => {this.toChildRoute('/system/management/add')}} type="primary">
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span> </span>
					<FormItem  label="企业：">
	    	        	<Input {...getFieldProps('name')} type="text" />
		        	</FormItem>
		        	<FormItem  label="联系人：">
	    	        	<Input {...getFieldProps('contact')} type="text" />
		        	</FormItem>
					<Button onClick={::this.handleSearch} type="primary" htmlType="submit">
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
		const toChildRoute = (path, id) => _ => {
			return this.toChildRoute(path, id)
		}
		const handleConfirm = id => _ => {
			return this.handleConfirm(id)
		}
		const columns = [{
			title: '企业名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '联系人',
			dataIndex: 'contact',
			key: 'contact'
		}, {
			title: '联系电话',
			dataIndex: 'tel',
			key: 'tel',
		}, {
			title: '地址',
			dataIndex: 'address',
			key: 'address',
		}, {
			title: '操作',
			key: 'operation',
			render(status, obj) {
				return (
					<div>
						<Auth type={["company-check"]}>
							<a onClick={toggleModal(obj, 'visible')} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["company-edit"]}>
							<a onClick={toChildRoute('/system/management/update', obj.id)} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["company-delete"]}>
							<Popconfirm title="确认删除吗？" onConfirm={handleConfirm(obj.id)}>
								<a  style={{paddingRight:5}}>删除</a>
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
				loading={this.props.listLoading}
			/>
		)
	}

	render() {
		const option = this.props.option.toJS()
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<MainModal
					toggle={::this.toggleModal}
					visible={this.state.visible}
					info={this.state.info}
					option={option}
					assets_domain={this.props.assets_domain}
				/>
			</div>
		)
	}
}