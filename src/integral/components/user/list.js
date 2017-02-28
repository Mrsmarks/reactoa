import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router' 
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
				pathname: '/integral/user/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchIntergralUserList({page, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/integral/user/list',
			query: query
		})
		this.props.actions.fetchIntergralUserList(query)
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
		        	<FormItem  label="时间：">
	    	        	<DatePicker {...getFieldProps('start_time')}/>
	    	        	<span> ~ </span>
	    	        	<DatePicker {...getFieldProps('end_time')}/>
		        	</FormItem>
		        	<FormItem  label="类型：">
	    	        	<Select {...getFieldProps('type')} placeholder="请选择状态" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			option.userType.map(item => {
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
			title: '手机号',
			dataIndex: 'mobile',
			key: 'mobile',
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			render(type) {
				const list = ['未注册', '已注册', '已绑卡']
				return(
					<span>{list[type]}</span>
				)
			}
		}, {
			title: '身份证',
			dataIndex: 'credit',
			key: 'credit',
		}, {
			title: '创建时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render(time) {
				return(
					<span>{format(time*1000)}</span>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return(
					<Link to={{pathname: '/integral/user/user_credit', query:{userid: obj.wuid}}}>查看</Link>
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