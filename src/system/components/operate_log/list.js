import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import format from 'Application/utils/formatDate'

import Button from 'antd/lib/button'

import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
import DatePicker from 'antd/lib/date-picker'
import Input from 'antd/lib/input'
import Key from 'Application/decorators/key'


const FormItem = Form.Item

@Key(['content'])
@Form.create()
export default class UserAnsComp extends React.Component {
	constructor(props, context) {
		super(props, context)
	}

	static propTypes= {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		location: PropTypes.object.isRequired,
		router: PropTypes.object.isRequired
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/system/operate-log/list',
			query: query
		})
		this.props.actions.fetchSystemLog(query)
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const start_time = values.start_time? format(values.start_time.getTime()): ''
	      	const end_time = values.end_time? format(values.end_time.getTime()): ''
	      	const name = values.name
	      	const page = 1
	      	this.context.router.push({
				pathname: '/system/operate-log/list',
				query: {
					page: page,
					start_time: start_time,
					end_time: end_time,
					name: name
				}
			})
			this.props.actions.fetchSystemLog({page, start_time, end_time, name})
    	})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form

		return (
			<div className="toolbar">
				<Form inline>
					<FormItem  label="时间：">
	    	        	<DatePicker {...getFieldProps('start_time')} placeholder="开始时间"/>
	    	        	<span> </span>
	    	        	<DatePicker {...getFieldProps('end_time')} placeholder="结束时间"/>
		        	</FormItem>
		        	<FormItem  label="用户名称：">
	    	        	<Input {...getFieldProps('name')} placeholder="请输入用户名称"/>
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
		const columns = [{
			title: '用户名称',
			dataIndex: 'uname',
			key: 'uname'
		}, {
			title: '企业名称',
			dataIndex: 'cpname',
			key: 'cpname'
		}, {
			title: 'ip地址',
			dataIndex: 'ip',
			key: 'ip',
		}, {
			title: '详情',
			dataIndex: 'remark',
			key: 'remark',
		}, {
			title: '创建时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render(time) {
				return(
					<span>{format(time*1000)}</span>
				)
			}
		}]
		const params = this.props.params.toJS()
		const { page = 1 } = params
		const pagination = {
			total: params.count,
			current: params.page,
			onChange: ::this.handlePageChange,
			showSizeChanger: true,
			pageSize: params.psize,
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
				loading={this.props.listLoading}
			/>
		)
	}

	render() {
		return(
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
			</div>
		)
	}

}