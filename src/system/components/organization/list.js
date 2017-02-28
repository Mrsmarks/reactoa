import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Upload from 'antd/lib/upload'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
import Select from 'antd/lib/select'
import SeeModal from './seeModal'
import AddModal from './addModal'
import EditModal from './editModal'
const FormItem = Form.Item
const Option = Select.Option

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
		actions: PropTypes.object.isRequired,
		user: PropTypes.instanceOf(Immutable.Map).isRequired
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
		this.props.actions.delSystemOrganization(id).then(reslove => {
			if(!reslove.errorcode) {
				message.success(reslove.errormsg)
			}
		})
	}

	handleAdd(info) {
		const params = this.props.params.toJS()
		this.props.actions.updateSystemOrganization(info, 'add').then(reslove => {
			if(reslove.errorcode == 0) {
					this.setState({visible_1: false, info: {}})
					message.success(reslove.errormsg)
			}

		})
		
	}

	handleEdit(info, id) {
		const params = this.props.params.toJS()
		this.props.actions.updateSystemOrganization(info, 'update', id).then(reslove => {
			if(reslove.errorcode == 0) {
					this.setState({visible_3: false, info: reslove.result})
					message.success(reslove.errormsg)
			}
		})
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const name = values.name
	      	const oid = values.oid
	      	const parentid = values.parentid
	      	const page = 1
	      	this.context.router.push({
				pathname: '/system/organization/list',
				query: {
					page: page,
					...values
				}
			})
			this.props.actions.fetchSystemOrganization({page, ...values})
    	})
	}

	uploadFile(file) {
		this.props.actions.uploadExcelFile(file, '/system/system-organization/import-data').then(resolve => {
			message.success(resolve.errormsg)
		})
	}


	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/system/organization/list',
			query: query
		})
		this.props.actions.fetchSystemOrganization(query)
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const option = this.props.select.toJS()
		const dataExportProps = {
			beforeUpload: this.uploadFile.bind(this),
		}
		return (
			<div className="toolbar">
				<Form inline>
					<Auth type={["system-organization-add"]}>
						<Button onClick={()=>{this.toggleModal(undefined, 'visible_1')}}  type="primary">
							<Icon  type="plus" />
							添加
						</Button>
					</Auth>
					<span style={{marginLeft: 5}}></span>
		        	<FormItem  label="机构编码：">
	    	        	<Input {...getFieldProps('oid')} />
		        	</FormItem>
		        	<FormItem  label="上级机构编码：">
	    	        	<Input {...getFieldProps('parentid')} />
		        	</FormItem>
		        	<FormItem  label="运营状态：">
	    	        	<Select {...getFieldProps('enable')} style={{width: 150}}>
	    	        		{
	    	        			option.map(item => {
	    	        				return(
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
					<Button onClick={::this.handleSearch}  htmlType="submit">
						<Icon  type="search" />
						 查询
					</Button>
					<span style={{marginLeft: 5}}></span>
					<Button type="ghost" onClick={() => {window.location.href = `${this.props.backend_domain}/template/system-organization.xlsx`}}>
						<Icon type="download" />
						导入模板下载
					</Button>
					<span style={{marginLeft: 5}}></span>
					<Auth type={["system-organization-import"]}>
						<Upload {...dataExportProps} showUploadList={false}>
							<Button type="ghost">
								<Icon type="upload" />
								数据导入
							</Button>
						</Upload>	
					</Auth>
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
			title: '机构编码',
			dataIndex: 'institu_code',
			key: 'institu_code',
		},{
			title: '简称',
			dataIndex: 'intro',
			key: 'intro',
		}, {
			title: '地址',
			dataIndex: 'address',
			key: 'address',
		}, {
			title: '营业状态',
			dataIndex: 'enable',
			key: 'enable',
			render(value) {
				return(
					<span>{value == 1 ? '启用': '停用'}</span>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(status, obj) {
				return (
					<div>
					<Auth type={["system-organization-check"]}>
						<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>查看</a>
					</Auth>
					<Auth type={["system-organization-update"]}>
						<a onClick={toggleModal(obj, 'visible_3')} style={{paddingRight:5}}>编辑</a>
					</Auth>
					<Auth type={["system-organization-delete"]}>
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
			<div>
				<Table 
					dataSource={dataSource}
					columns={columns}
					pagination={pagination}
					loading={this.props.loading}
				/>
			</div>
		)
	}

	render() {
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<SeeModal
					info={this.state.info}
					visible={this.state.visible_2}
					toggle={::this.toggleModal}
				/>
				<AddModal
					visible={this.state.visible_1}
					toggle={::this.toggleModal}
					updateLoading={this.props.updateLoading}
					handleAdd={::this.handleAdd}
				/>
				<EditModal
					info={this.state.info}
					visible={this.state.visible_3}
					toggle={::this.toggleModal}
					handleUpdate={::this.handleEdit}
					updateLoading={this.props.updateLoading}
				/>
				
			</div>
		)
	}
}