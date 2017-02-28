import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import Key from 'Application/decorators/key'

import SeeModal from './seeModal'
import AddModal from './addModal'
import AddChildModal from './addChildModal'
import EditModal from './editModal'
import Auth from 'Application/components/auth'

const FormItem = Form.Item


@Key(['content'])
@Form.create()
export default class HelpComp extends React.Component{

	constructor(props) {
		super(props)
		this.state ={
			visible_1: false,
			visible_2: false,
			visible_3: false,
			visible_4: false,
			info: {}
		}
	}

	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		loading: PropTypes.bool.isRequired,
		addChildLoading: PropTypes.bool.isRequired,
		updateLoading: PropTypes.bool.isRequired,
		editChildLoading: PropTypes.bool.isRequired

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
				pathname: '/system/help/list',
				query: {
					page: page,
					name: name				
				}
			})
			this.props.actions.fetchHelpList({page, name})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/system/help/list',
			query: query
		})
		this.props.actions.fetchHelpList(query)
	}

	handleConfirm(obj) {
		const id = obj.id
		const params = this.props.params.toJS()
		this.props.actions.delHelpNode(id).then(reslove => {
			if(!reslove.errorcode) {
				message.success(reslove.errormsg)
				// this.props.actions.fetchHelpList({page: params.page})
			}
		})
	}

	handleAdd(info) {
		const params = this.props.params.toJS()
		this.props.actions.addHelpNode(info).then(reslove => {
			if(reslove.errorcode == 0) {
					this.setState({visible_2: false, visible_3: false, info: {}})
					message.success(reslove.errormsg)
					// this.props.actions.fetchHelpList({page: params.page})
			}

		})
		
	}

	handleEdit(id, info) {
		const params = this.props.params.toJS()
		this.props.actions.updateHelpNode(id, info).then(reslove => {
			if(reslove.errorcode == 0) {
					this.setState({visible_4: false, info: {}})
					message.success(reslove.errormsg)
					// this.props.actions.fetchHelpList({page: params.page})
			}
		})
	}

	addChildrenKey(list) {
		list.forEach(item => {
			if(item.children.length != 0) {
				item.children.forEach(item => {
					item.key = Math.random().toString(36).substr(2, 7)
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
				<Form inline>
					<Auth type={["system-help-document-add"]}>
						<Button onClick={() => {this.toggleModal(undefined, 'visible_3')}} type="primary" >
							<Icon type="plus" />
							 添加帮助
						</Button>
					</Auth>
					<span style={{marginLeft: 5}}></span>
		        	<FormItem  label="表名称：">
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
		this.addChildrenKey(dataSource)
		const toggleModal = (obj, visible, initChildSource) => _ => {
			return this.toggleModal(obj, visible, initChildSource)
		}
		const handleConfirm = obj => _ =>{
			return this.handleConfirm(obj)
		}
		const initChildSource = (info) => {
			if(info.parent_id > 0) {
				dataSource.forEach(item => {
					if(info.parent_id == item.id+'') {
						info.parent_name = item.name
					}
				})
			}
		}
		const addFunc = obj => {
			if(obj.type === 1) {
				return (
					<Auth type={["system-help-document-add"]}>
						<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>添加</a>
					</Auth>
				)
			}
		}
		const delFunc = obj => {
			return(
				<Auth type={["system-help-document-delete"]}>
					<Popconfirm title={obj.type === 1? "确定删除该表吗？":"确定删除该字段吗？"} onConfirm={handleConfirm(obj)}>
						<a>删除</a>
					</Popconfirm>
				</Auth>
			)
		}
		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name',
			render(name, obj) {
				var  menu = ''
				if(obj.hasOwnProperty('children')){
					menu = <span> {name}</span>
				}else{
				    menu = <span>|---{name}</span> 
				}
				return menu
			}
		}, {
			title: '备注',
			dataIndex: 'remark',
			key: 'remark'
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			render(status) {
				return(
					<span>{status == 1? '表名': '字段名'}</span>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["system-help-document-check"]}>
							<a onClick={toggleModal(obj, 'visible_1', initChildSource)} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["system-help-document-update"]}>
							<a onClick={toggleModal(obj, 'visible_4', initChildSource)} style={{paddingRight:5}}>编辑</a>
						</Auth>
						{addFunc(obj)}
						{delFunc(obj)}
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
					<SeeModal
						visible={this.state.visible_1}
						toggle={::this.toggleModal}
						info={this.state.info}
					/>
					<AddChildModal
						visible={this.state.visible_2}
						toggle={::this.toggleModal}
						info={this.state.info}
						addChildLoading={this.props.addChildLoading}
						handleAdd={::this.handleAdd}
					/>
					<AddModal
						visible={this.state.visible_3}
						toggle={::this.toggleModal}
						addChildLoading={this.props.addChildLoading}
						handleAdd={::this.handleAdd}
					/>
					<EditModal
						visible={this.state.visible_4}
						toggle={::this.toggleModal}
						info={this.state.info}
						editChildLoading={this.props.editChildLoading}
						handleEdit={::this.handleEdit}
					/>
			</div>
		)
	}
}