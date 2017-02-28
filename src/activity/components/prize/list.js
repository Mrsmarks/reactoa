import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
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

	componentWillMount() {
		if(!this.props.pending){
			this.props.actions.fetchPrizeList({page: 1})
		}
	}


	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/prize/list',
			query: query
		})
		this.props.actions.fetchPrizeList(query)
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const aid = values.aid
	      	const page = 1
	      	this.context.router.push({
				pathname: '/activity/prize/list',
				query: {
					page: page,
					aid: aid
				}
			})
			this.props.actions.fetchPrizeList({page, aid})
    	})
	}

	handleAdd(info) {
		this.props.actions.addPrizeList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchPrizeSelect()
		})	
	}

	handleUpdate(info, id) {
		this.props.actions.updatePrizeList(info, id).then(resolve => {
			message.success(resolve.errormsg)
		})	
	}

	handleRemove(id) {
		this.props.actions.delPrizeList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	toEditRoute(id) {
		// this.props.actions.getPrizeDetail({id:id}).then(resolve => {
				this.context.router.push({
				pathname: '/activity/prize/edit',
				query: {
					id:id,
				}
			})
		// })
	}

	toAddRoute() {
		this.context.router.push({
			pathname: '/activity/prize/add',
		})
	}


	renderToolbar() {
		const { getFieldProps } = this.props.form
		const select = this.props.select.toJS().activityList
		const aidProps = getFieldProps('aid', {
			
		})
		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["activity-prize-add"]}>
						<Button onClick={::this.toAddRoute} type="primary">
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>					
					<FormItem  label="活动类型：">
	    	        	<Select {...aidProps} size="large" placeholder="请选择活动" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			select.map(item => {
	    	        				return (
	    	        					<Option key={item.aid} value={item.aid+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<Button onClick={::this.handleSearch} >
						<Icon type="search" />
						查询
					</Button>
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const select = this.props.select.toJS().activityList
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const toEditRoute = id => _ => {
			return this.toEditRoute(id)
		}

		const columns = [{
			title: '奖品名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '活动名称',
			dataIndex: 'aid',
			key: 'aid',
			render(id, obj) {
				const info = select.find(item => item.aid == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '兑奖规则',
			dataIndex: 'prize_rule',
			key: 'prize_rule',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["activity-prize-check"]}>
							<a onClick={toEditRoute(obj.id)} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["activity-prize-delete"]}>
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