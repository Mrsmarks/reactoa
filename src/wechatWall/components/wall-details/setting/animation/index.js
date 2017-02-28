import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import Switch from 'antd/lib/switch'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
import image404 from 'Application/resources/404.png'
const FormItem = Form.Item
const Option = Select.Option

@Key(['content'])
@Form.create()
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
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

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	this.context.router.push({
				pathname: '/wall/activity-screen/index',
				query: {
					page,
					...values
				}
			})
			this.props.actions.getTemplateList({page, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall/activity-screen/index',
			query: query
		})
		this.props.actions.getTemplateList(query)
	}

	handleRemove(id) {
		this.props.actions.delTemplateList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	addTemplate() {
		this.context.router.push({
			pathname: '/wall/activity-screen/add',
		})
	}

	updateDefaultTemp(id) {
		this.props.actions.updateDefaultTemp(id).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.getTemplateList(this.context.location.query)
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const select = this.props.select.toJS()
		return (
			<div className="toolbar">
				<Form inline >
					<Button onClick={::this.addTemplate} type="primary">
						<Icon type="plus" />
						添加模板
					</Button>
					<span style={{marginLeft: 5}}></span>
					<FormItem label="布局类型：">
						<Select {...getFieldProps('lid')} style={{width: 150}} placeholder="请输入布局类型">
							{
								select.templateLayout.map(item => {
									return(
										<Option key={item.id} value={item.id+''}>{item.name}</Option>
									)
								})
							}
						</Select>
					</FormItem>
					<FormItem label="主题类型：">
						<Select {...getFieldProps('stid')} style={{width: 150}} placeholder="请输入主题类型">
							{
								select.templateStyleType.map(item => {
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
		const updateDefaultTemp = id => _ => {
			return this.updateDefaultTemp(id)
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
		},{
			title: '布局类型',
			dataIndex: 'lid',
			key: 'lid',
			render(lid) {
				const info = select.templateLayout.find(item => item.id == lid)
				return(
					<span>{info? info.name: ''}</span>
				)
			}
		},{
			title: '主题类型',
			dataIndex: 'stid',
			key: 'stid',
			render(stid) {
				const info = select.templateStyleType.find(item => item.id == stid)
				return(
					<span>{info? info.name: ''}</span>
				)
			}
		},{
			title: '是否默认启用',
			dataIndex: 'default',
			key: 'default',
			render(sort, obj) {
				return(
					<Switch onChange={updateDefaultTemp(obj.id)} checked={!!sort} checkedChildren="开" unCheckedChildren="关"/>
				)
			}
		},{
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Link to={{ pathname: '/wall/activity-screen/edit', query: { id: obj.id } }}>详情</Link>
						<span style={{marginLeft: 5}}></span>
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
			</div>
		)
	}
}