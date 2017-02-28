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
		this.state = {
			visible: false,
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

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	values.start_time = values.start_time? format(values.start_time): '',
	      	values.end_time = values.end_time? format(values.end_time): ''
	      	this.context.router.push({
				pathname: '/teacher/message/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchTeacherMessageList({page, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/teacher/message/list',
			query: query
		})
		this.props.actions.fetchTeacherMessageList(query)
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
		        	<FormItem  label="手机号：">
	    	        	<Input {...getFieldProps('mobile')}/>
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
		const showModal = obj => _ => {
			return this.showModal(obj)
		}
		const columns = [{
			title: '手机号',
			dataIndex: 'mobile',
			key: 'mobile'
		}, {
			title: '消息记录',
			dataIndex: 'send_msg',
			key: 'send_msg'
		}, {
			title: '返回消息',
			dataIndex: 'response_msg',
			key: 'response_msg',
		}, {
			title: '过期时间',
			dataIndex: 'validity_period',
			key: 'validity_period'
		}, {
			title: '使用状态',
			dataIndex: 'use_status',
			key: 'use_status',
			render(status) {
				return(
					<span>{status? '已使用': '未使用'}</span>
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