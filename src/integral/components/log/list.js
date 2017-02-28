import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import format from 'Application/utils/formatDate'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import DatePicker from 'antd/lib/date-picker'

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
	      	values.start_time = values.start_time? format(values.start_time): '',
	      	values.end_time = values.end_time? format(values.end_time): ''
	      	const page = 1
	      	this.context.router.push({
				pathname: '/integral/log/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchIntergralLogList({page, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/integral/log/list',
			query: query
		})
		this.props.actions.fetchIntergralLogList(query)
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const option = this.props.option.toJS()
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		return (
			<div className="toolbar">
				<Form inline >
					<span style={{marginLeft:5}}> </span>							        	
		        	<FormItem  label="时间：">
	    	        	<DatePicker {...getFieldProps('start_time')}/>
	    	        	<span> ~ </span>
	    	        	<DatePicker {...getFieldProps('end_time')}/>
		        	</FormItem>
		        	<FormItem  label="类型：">
	    	        	<Select {...getFieldProps('type')} placeholder="请选择状态" style={{ width: 150 }}>
	    	        		<Option key={'x'} value='-1'>全部</Option>
	    	        		{
	    	        			option.logType.map(item => {
	    	        				return (
	    	        					<Option value={item.id+''} key={item.id}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<Button type="primary" onClick={::this.handleSearch}>
		        		查询
		        	</Button>
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const option = this.props.option.toJS()
		const columns = [{
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			render(type) {
				const list = {'1': '新用户', '2': '活动', '3': '兑换', '4': '绑卡', '5': '签到'}
				return(
					<span>{list[type]}</span>
				)
			}
		}, {
			title: '积分',
			dataIndex: 'credit',
			key: 'credit',
		}, {
			title: '备注',
			dataIndex: 'remark',
			key: 'remark',
		}, {
			title: '时间',
			dataIndex: 'create_time',
			key: 'create_time'
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