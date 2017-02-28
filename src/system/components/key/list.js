import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import city from 'Application/utils/city'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'

import AddModal from './addModal'
import EditModal from './editModal'
import SeeModal from './seeModal'

const FormItem = Form.Item
const Option = Select.Option

@Key(['content'])
@Form.create()
export default class ManagementComp extends React.Component{

	constructor(props, context) {
		super(props, context)
		this.state ={
			info: {},
			visible_1: false,
			visible_2: false,
			visible_3: false,
			account: [],
			
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


	handleConfirm(obj) {
		const id = obj.id
		const params = this.props.params.toJS()
		this.props.actions.delSystemKey(id).then(reslove => {
			if(!reslove.errorcode) {
				message.success(reslove.errormsg)
			}
		})
	}

	handleAdd(info) {
		const params = this.props.params.toJS()
		this.props.actions.updateSystemKey(info, 'add').then(reslove => {
			if(reslove.errorcode == 0) {
					this.setState({visible_1: false, info: {}})
					message.success(reslove.errormsg)
			}

		})
		
	}

	handleEdit(id, info) {
		const params = this.props.params.toJS()
		this.props.actions.updateSystemKey(info, 'update', id).then(reslove => {
			if(reslove.errorcode == 0) {
					this.setState({visible_3: false, info: reslove.result})
					message.success(reslove.errormsg)
			}
		})
	}

	getAcidList(info) {
		if(info.type == 1) {
			this.props.actions.fetchAcidByCid(info.cpid).then(resolve=> {
				this.setState({
					account: resolve.result.accountList
					
				})
			})
		}
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	this.context.router.push({
				pathname: '/system/key/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchSystemKey({page, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/system/key/list',
			query: query
		})
		this.props.actions.fetchSystemKey(query)
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const select = this.props.select.toJS()
		const nameProps = getFieldProps('name', {
			
		})

		const typeProps = getFieldProps('type', {

		})
		return (
			<div className="toolbar">
				<Form inline>
					<Auth type={["system-key-add"]}>
						<Button onClick={() => {this.toggleModal(undefined, 'visible_1')}} type="primary" >
							<Icon type="plus"/>
							添加
						</Button>
					</Auth>

					<span> </span>
		        	<FormItem  label="类型：">
	    	        	<Select {...typeProps} style={{width: 150}} placeholder="请选择类型">
	    	        		{
	    	        			select.thirdPartyKeyType.map(item => {
	    	        				return(
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<FormItem  label="名称：">
	    	        	<Input {...nameProps}/>
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
		const select = this.props.select.toJS()
		const toggleModal = (obj, visible, cb) => _ => {
			this.toggleModal(obj, visible, cb)
		}
		const handleConfirm = obj => _ => {
			return this.handleConfirm(obj)
		}
		const getAcidList = obj => {
			this.getAcidList(obj)
		}
		const columns = [{
			title: '企业',
			dataIndex: 'cpid',
			key: 'cpid',
			render(id) {
				const component = select.companyList.find(item => item.id+'' == id)
				const htm = component? (<span>{component.name}</span>): ''
				return(
					<span>{htm}</span>
				)
			}
		}, {
			title: '名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			render(id) {
				return(
					<span>{id == 1? '微信': '积分系统'}</span>
				)
			}
		}, {
			title: 'AppId',
			dataIndex: 'appid',
			key: 'appid',
		}, {
			title: 'Key',
			dataIndex: 'keys',
			key: 'keys',
		}, {
			title: '操作',
			key: 'operation',
			render(status, obj) {
				return (
					<div>
						<Auth type={["system-key-check"]}>
							<a onClick={toggleModal(obj, 'visible_2', getAcidList)} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["system-key-update"]}>
							<a onClick={toggleModal(obj, 'visible_3', getAcidList)} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["system-key-delete"]}>
							<Popconfirm title="确定删除吗？" onConfirm={handleConfirm(obj)}>
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
					select={this.props.select.toJS()}
					visible={this.state.visible_1}
					toggle={::this.toggleModal}
					handleAdd={::this.handleAdd}
					fetchAcidByCid={this.props.actions.fetchAcidByCid}
					updateLoading={this.props.updateLoading}
				/>
				<EditModal
					account={this.state.account}
					select={this.props.select.toJS()}
					visible={this.state.visible_3}
					toggle={::this.toggleModal}
					handleEdit={::this.handleEdit}
					fetchAcidByCid={this.props.actions.fetchAcidByCid}
					info={this.state.info}
					updateLoading={this.props.updateLoading}
				/>
				<SeeModal
					account={this.state.account}
					select={this.props.select.toJS()}
					visible={this.state.visible_2}
					toggle={::this.toggleModal}
					info={this.state.info}

				/>
			</div>
		)
	}
}