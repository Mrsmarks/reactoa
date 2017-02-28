import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Switch from 'antd/lib/switch'
import Spin from 'antd/lib/spin'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import Upload from 'antd/lib/upload'
import Modal from 'antd/lib/modal'

import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
import AddModal from './addModal'
import EditModal from './editModal'
import SeeModal from './seeModal'
const img = require('Application/resources/404.png')



const FormItem = Form.Item
const Option = Select.Option

@Key(['content'])
@Form.create()
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			visible_1: false,
			visible_2: false,
			visible_3: false,
			info: {}
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

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/card/bless/list',
			query: query
		})
		this.props.actions.fetchBlessList(query)
	}

	handleAdd(info) {
		this.props.actions.addBlessList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
		})	
	}

	handleRemove(id) {
		this.props.actions.delBlessList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	handleUpdate(info, id) {
		this.props.actions.updateBlessList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_2: false, info: resolve.result })
		})	
	}

	updateBlessSticky(id) {
		const params = this.props.params.toJS()
		this.props.actions.updateBlessSticky(id).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchBlessList({page: params.page})
		})
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
	      	const page = 1
	      	this.context.router.push({
				pathname: '/card/bless/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchBlessList({page, ...values})
    	})
	}


	renderToolbar() {
		const { getFieldProps } = this.props.form
		const select = this.props.select.toJS()
		const typeProps = getFieldProps('type', {

		})
		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["cards-greeting-add"]}>
						<Button type="primary" onClick={() => {this.toggleModal.bind(this)(undefined, 'visible_1')}}><Icon type="plus" />新增</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>	
					<FormItem  label="名称：">	
						<Select {...typeProps} placeholder="请输入名称查找" style={{width: 150}}>
							{
								select.map(item => {
									return (
										<Option key={item.value} value={item.value+''}>{item.label}</Option>
									)
								})
							}
						</Select>
					</FormItem>
		        	<Button onClick={::this.handleSearch} type="primary">
						<Icon type="search" />
						查询
					</Button>
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const select = this.props.select.toJS()
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const toggleModal = (info, visible, cb) => _ => {
			return this.toggleModal(info, visible ,cb)
		}

		const updateBlessSticky = id => _ => {
			return this.updateBlessSticky(id)
		}

		const columns = [{
			title: '标题',
			dataIndex: 'title',
			key: 'title'
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			render(id, obj) {
				const info = select.find(item => item.value == id)
				const name = info? info.label: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '祝福语',
			dataIndex: 'content',
			key: 'content',
		}, {
			title: '是否置顶',
			dataIndex: 'stick',
			key: 'stick',
			render(status, obj) {
				return(
					<Switch defaultChecked={status} onChange={updateBlessSticky(obj.id)}/>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["cards-type-check"]}>
							<Link to={{pathname: '/card/bless/auth', query:{id: obj.id}}} style={{paddingRight:5}}>配置权限</Link>
						</Auth>
						<Auth type={["cards-greeting-check"]}>
							<a onClick={toggleModal(obj, 'visible_3')}>查看</a>
						</Auth>
						<span> </span>
						<Auth type={["cards-greeting-update"]}>
							<a onClick={toggleModal(obj, 'visible_2')}>编辑</a>
						</Auth>
						<span> </span>
						<Auth type={["cards-greeting-delete"]}>
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
				pagination={ pagination }
				loading={this.props.loading}
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
					toggle={::this.toggleModal}
					visible={this.state.visible_1}
					addLoading={this.props.addLoading}
					handleAdd={::this.handleAdd}
					select={select}
				/>
				<EditModal
					toggle={::this.toggleModal}
					visible={this.state.visible_2}
					addLoading={this.props.updateLoading}
					handleUpdate={::this.handleUpdate}
					info={this.state.info}
					select={select}
				/>
				<SeeModal
					toggle={::this.toggleModal}
					visible={this.state.visible_3}
					info={this.state.info}
					select={select}
				/>
			</div>
		)
	}
}