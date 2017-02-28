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

import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'


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

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/card/setting/list',
			query: query
		})
		this.props.actions.fetchSettingList(query)
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	this.context.router.push({
				pathname: '/card/setting/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchSettingList({page, ...values})
    	})
	}

	handleRemove(id) {
		this.props.actions.delSettingList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const nameProps = getFieldProps('name', {

		})
		return (
			<div className="toolbar">
				<Form inline>
					<Auth type={["cards-config-add"]}>
						<Link to={{pathname: '/card/setting/add' }}>
							<Button  type="primary"><Icon type="plus" />添加主配置</Button>
						</Link>
					</Auth>
					<span style={{marginLeft:5}}> </span>	
					<FormItem  label="名称：">	
						<Input placeholder="请输入名称查找" {...nameProps}/>
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
		const option = this.props.option.toJS()
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '首页模板',
			dataIndex: 'index',
			key: 'index',
			render(id, obj) {
				const info = option.index.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '列表页模板',
			dataIndex: 'list',
			key: 'list',
			render(id, obj) {
				const info = option.list.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '祝福语页模板',
			dataIndex: 'greeting',
			key: 'greeting',
			render(id, obj) {
				const info = option.greeting.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '路由',
			dataIndex: 'route',
			key: 'route',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["cards-config-check"]}>
							<Link to={{pathname: '/card/setting/edit', query:{id: obj.id}}} style={{paddingRight:5}}>编辑</Link>
						</Auth>
						<Auth type={["cards-config-delete"]}>
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
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
			</div>
		)
	}
}