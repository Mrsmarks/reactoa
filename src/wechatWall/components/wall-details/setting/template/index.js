import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Switch from 'antd/lib/switch'
import Select from 'antd/lib/select'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'

import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
import image404 from 'Application/resources/404.png'

import AddModal from './addModal'
import EditModal from './editModal'
import SeeModal from './seeModal'

const FormItem = Form.Item
const Option = Select.Option
@Key(['content'])
@Form.create()
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info:{},
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
	      	const page = 1
	      	const id = this.context.location.query.id
	      	this.context.router.push({
				pathname: '/wall/activity-template/index',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchWallActivityTemp({page, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall/activity-template/index',
			query: query
		})
		this.props.actions.fetchWallActivityTemp(query)
	}

	handleAdd(info) {
		this.props.actions.updateWallActivityTemp("add", info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
		})	
	}

	handleUpdate(info, id) {
		this.props.actions.updateWallActivityTemp("update", info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_2: false, info: resolve.result })
		})	
	}

	handleRemove(id) {
		this.props.actions.delWallActivityTemp(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	updateDefaultActivityTemp(id) {
		this.props.actions.updateDefaultActivityTemp(id).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchWallActivityTemp(this.context.location.query)

		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const select = this.props.select.toJS()
		return (
			<div className="toolbar">
				<Form inline >
					<Button onClick={() => {this.toggleModal(undefined,'visible_1')}} type="primary">
						<Icon type="plus" />
						添加模板
					</Button>
					<span style={{marginLeft: 5}}></span>
					<FormItem label="活动类型：">
						<Select {...getFieldProps('activity_type')} style={{width:150}}>
							{
								select.activityType.map(item => {
									return(
										<Option key={item.id} value={item.id+''}>{item.name}</Option>
									)
								})
							}
						</Select>
					</FormItem>
					<FormItem label="屏幕类型：">
						<Select {...getFieldProps('screen_type')} style={{width:150}}>
							{
								select.screenType.map(item => {
									return(
										<Option key={item.id} value={item.id+''}>{item.name}</Option>
									)
								})
							}
						</Select>
					</FormItem>
					<Button type="ghost" onClick={::this.handleSearch}>
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
		const assetsUrl = this.props.assetsUrl
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const toggleModal = (obj, visible, cb) => _ => {
			return this.toggleModal(obj, visible, cb)
		}

		const updateDefaultActivityTemp = id => _ => {
			return this.updateDefaultActivityTemp(id)
		}

		const columns = [{
			title: '模板名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '缩略图',
			dataIndex: 'thumb',
			key: 'thumb',
			render(url, obj) {
				return(
					<img className='head-img'src={url? assetsUrl + url: image404}/>
				)
			}
		}, {
			title: '活动类型',
			dataIndex: 'activity_type',
			key: 'activity_type',
			render(type) {
				const obj = select.activityType.find(item => item.id == type)
				return(
					<span>{obj? obj.name: ""}</span>
				)
			}
		}, {
			title: '屏幕类型',
			dataIndex: 'screen_type',
			key: 'screen_type',
			render(type) {
				const obj = select.screenType.find(item => item.id == type)
				return(
					<span>{obj? obj.name: ""}</span>
				)
			}
		}, {
			title: '是否启用默认',
			dataIndex: 'default',
			key: 'default',
			render(sort, obj) {
				return(
					<Switch  onChange={updateDefaultActivityTemp(obj.id)} checked={!!sort} checkedChildren="开" unCheckedChildren="关"/>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<a onClick={toggleModal(obj, 'visible_3')} style={{paddingRight:5}}>查看</a>
						<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>编辑</a>
						<Popconfirm title="确定要删除吗？" onConfirm={handleRemove(obj.id)}>
							<a>删除</a>
						</Popconfirm>
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
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<AddModal
					toggle={::this.toggleModal}
					visible={this.state.visible_1}
					updateLoading={this.props.updateLoading}
					handleAdd={::this.handleAdd}
					select={this.props.select.toJS()}
					uploadFile={this.props.actions.uploadFile}
					fileLoading={this.props.fileLoading}
					assetsUrl={this.props.assetsUrl}
				/>
				<EditModal
					toggle={::this.toggleModal}
					visible={this.state.visible_2}
					updateLoading={this.props.updateLoading}
					handleUpdate={::this.handleUpdate}
					info={this.state.info}
					select={this.props.select.toJS()}
					uploadFile={this.props.actions.uploadFile}
					fileLoading={this.props.fileLoading}
					assetsUrl={this.props.assetsUrl}
				/>
				<SeeModal
					toggle={::this.toggleModal}
					visible={this.state.visible_3}
					info={this.state.info}
					select={this.props.select.toJS()}
					assetsUrl={this.props.assetsUrl}
				/>
			</div>
		)
	}
}