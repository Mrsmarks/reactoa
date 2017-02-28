import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import city from 'Application/utils/city'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'

import AddModal from './addModal'
import EditModal from './editModal'
import SeeModal from './seeModal'

const FormItem = Form.Item


@Key(['content'])
@Form.create()
export default class ManagementComp extends React.Component{

	constructor(props, context) {
		super(props, context)
		this.state ={
			info: {},
			visible_1: false,
			visible_2: false,
			visible_3: false

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
		this.props.actions.delNetWorkList(id).then(reslove => {
			if(!reslove.errorcode) {
				message.success(reslove.errormsg)
				// this.props.actions.fetchNetWorkList({page: params.page})
			}
		})
	}

	handleAdd(info) {
		const params = this.props.params.toJS()
		this.props.actions.addNetWorkList(info).then(reslove => {
			if(reslove.errorcode == 0) {
					this.setState({visible_1: false, info: {}})
					message.success(reslove.errormsg)
					// this.props.actions.fetchNetWorkList({page: params.page})
			}

		})
		
	}

	handleEdit(id, info) {
		const params = this.props.params.toJS()
		this.props.actions.updateNetWorkList(id, info).then(reslove => {
			if(reslove.errorcode == 0) {
					this.setState({visible_3: false, info: {}})
					message.success(reslove.errormsg)
					// this.props.actions.fetchNetWorkList({page: params.page})
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
	      	const page = 1
	      	this.context.router.push({
				pathname: '/system/network/list',
				query: {
					page: page,
					name: name
				}
			})
			this.props.actions.fetchNetWorkList({page, name})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/system/network/list',
			query: query
		})
		this.props.actions.fetchNetWorkList(query)
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const nameProps = getFieldProps('name', {
			
		})
		return (
			<div className="toolbar">
				<Form inline>
					<Auth type={['network-add']}>
						<Button onClick={() => {this.toggleModal(undefined, 'visible_1')}} type="primary" >
							<Icon type="plus"/>
							添加
						</Button>
					</Auth>
					<span> </span>
		        	<FormItem  label="网点名称：">
	    	        	<Input {...nameProps} />
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
		const option = this.props.option.toJS().departmentList
		const toggleModal = (obj, visible) => _ => {
			this.toggleModal(obj, visible)
		}
		const handleConfirm = obj => _ =>{
			return this.handleConfirm(obj)
		}
		const columns = [{
			title: '所属企业',
			dataIndex: 'cpid_name',
			key: 'cpid_name',
		}, {
			title: '所属部门',
			dataIndex: 'dpid',
			key: 'dpid',
			render(id, obj) {
				const info = option.find(item => item.id+'' == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '网点名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '使用状态',
			dataIndex: 'use_state',
			key: 'use_state',
			render(status) {
				return (
					<span>{status? '开启': '关闭'}</span>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(status, obj) {
				return (
					<div>
					<Auth type={['network-check']}>
						<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>查看</a>
					</Auth>
					<Auth type={['network-update']}>
						<a onClick={toggleModal(obj, 'visible_3')} style={{paddingRight:5}}>编辑</a>
					</Auth>

					<Auth type={['network-delete']}>
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
		const option = this.props.option.toJS()
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<AddModal
					option={option}
					city={city}
					visible={this.state.visible_1}
					toggle={::this.toggleModal}
					handleAdd={::this.handleAdd}
					user={this.props.user}
				/>
				<EditModal
					option={option}
					city={city}
					info={this.state.info}
					visible={this.state.visible_3}
					toggle={::this.toggleModal}
					handleEdit={::this.handleEdit}
					user={this.props.user}
				/>
				<SeeModal
					option={option}
					city={city}
					info={this.state.info}
					visible={this.state.visible_2}
					toggle={::this.toggleModal}
					user={this.props.user}
				/>
				
			</div>
		)
	}
}