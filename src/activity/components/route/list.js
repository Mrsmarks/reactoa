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
import Auth from 'Application/components/auth'

const FormItem = Form.Item

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
				pathname: '/activity/route/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchRouteList({page, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/route/list',
			query: query
		})
		this.props.actions.fetchRouteList(query)
	}

	toAddRoute() {
		this.context.router.push('/activity/route/add')
	}

	toEditRoute(id) {
		this.context.router.push({
			pathname: '/activity/route/edit',
			query: {
				id: id
			}

		})
	}

	handleRemove(id) {
		this.props.actions.delRouteList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const nameProps = getFieldProps('name', {
			
		})
		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["activity-route-add"]}>
						<Button onClick={::this.toAddRoute} type="primary">
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>					
					<FormItem  label="名称：">
	    	        	<Input {...nameProps}/>
		        	</FormItem>
						<Button onClick={::this.handleSearch}>
							<Icon type="search" />
							 查询
						</Button>	
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const toEditRoute = id => _ => {
			return this.toEditRoute(id)
		}

		const columns = [{
			title: '所属公众号',
			dataIndex: 'acname',
			key: 'acname'
		}, {
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '访问链接地址',
			dataIndex: 'access_url',
			key: 'access_url',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["activity-route-check"]}>
							<a onClick={toEditRoute(obj.id)}>编辑</a>
						</Auth>
						<span> </span>
						<Auth type={["activity-route-delete"]}>
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