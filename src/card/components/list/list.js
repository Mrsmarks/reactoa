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
			pathname: '/card/list/list',
			query: query
		})
		this.props.actions.fetchCardList(query)
	}

	handleAdd(info) {
		this.props.actions.addCardList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
		})	
	}

	handleRemove(id) {
		this.props.actions.delCardList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	handleUpdate(info, id) {
		this.props.actions.updateCardList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_2: false, info: resolve.result })
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
				pathname: '/card/list/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchCardList({page, ...values})
    	})
	}


	renderToolbar() {
		const { getFieldProps } = this.props.form
		const select = this.props.select.toJS()
		const typeProps = getFieldProps('type', {

		})
		return (
			<div className="toolbar">
				<Form inline>
					<Auth type={["cards-greeting-add"]}>
						<Button type="primary" onClick={() => {this.toggleModal(undefined, 'visible_1')}}><Icon type="plus" />添加祝福语</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>	
					<FormItem  label="名称：">	
						<Select {...typeProps} placeholder="请选择类型" style={{width: 150}}>
							{
								select.CardsType.map(item => {
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

		const columns = [{
			title: '贺卡类型',
			dataIndex: 'type',
			key: 'type',
			render(id, obj) {
				const info = select.CardsType.find(item => item.value == id)
				const name = info? info.label: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '贺卡实例',
			dataIndex: 'example',
			key: 'example',
			render(id, obj) {
				const info = select.CardsType.find(item => item.value == obj.type)
				const children = info? info.children: []
				const child = children.find(item => item.value == id)
				const name = child? child.label: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '微信昵称',
			dataIndex: 'wechat_name',
			key: 'wechat_name',
		}, {
			title: '手机号',
			dataIndex: 'mobile',
			key: 'mobile',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
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