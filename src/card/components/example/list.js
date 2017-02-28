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
			pathname: '/card/example/list',
			query: query
		})
		this.props.actions.fetchExampleList(query)
	}

	updateExampleSticky(id) {
		const params = this.props.params.toJS()
		this.props.actions.updateExampleSticky(id).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchExampleList({page: params.page})
		})
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	this.context.router.push({
				pathname: '/card/example/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchExampleList({page, ...values})
    	})
	}

	handleRemove(id) {
		this.props.actions.delExampleList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const option = this.props.options.toJS()
		const typeProps = getFieldProps('type', {

		})
		return (
			<div className="toolbar">
				<Form inline>
					<Auth type={["cards-example-add"]}>
						<Link to={{pathname: '/card/example/add' }}>
							<Button  type="primary"><Icon type="plus" />添加实例</Button>
						</Link>
					</Auth>
					<span style={{marginLeft:5}}> </span>	
					<FormItem  label="贺卡类型：">	
						<Select {...typeProps} placeholder='请选择分类' style={{width: 150}}>
							{
								option.CardsType.map(item => {
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
		const option = this.props.options.toJS()
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const updateExampleSticky = id => _ => {
			return this.updateExampleSticky(id)
		}

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '模板',
			dataIndex: 'tid',
			key: 'tid',
			render(id, obj) {
				const info = option.CardsTemplate.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			render(id, obj) {
				const info = option.CardsType.find(item => item.value == id)
				const name = info? info.label: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '是否置顶',
			dataIndex: 'stick',
			key: 'stick',
			render(status, obj) {
				return(
					<Switch defaultChecked={status} onChange={updateExampleSticky(obj.id)}/>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["cards-type-check"]}>
							<Link to={{pathname: '/card/example/auth', query:{id: obj.id}}} style={{paddingRight:5}}>配置权限</Link>
						</Auth>
						<Auth type={["cards-example-check"]}>
							<Link to={{pathname: '/card/example/edit', query:{id: obj.id}}} style={{paddingRight:5}}>编辑</Link>
						</Auth>
						<Auth type={["cards-example-delete"]}>
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