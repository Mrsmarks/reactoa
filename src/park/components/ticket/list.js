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
	      	this.context.router.push({
				pathname: '/park/ticket/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchTicketList({page, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/park/ticket/list',
			query: query
		})
		this.props.actions.fetchTicketList(query)
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
					<FormItem  label="数据源类型：">
	    	        	<Select {...getFieldProps('source')} placeholder="请选择响应状态" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			option.sourceList.map(item => {
	    	        				return (
	    	        					<Option id={item.id} key={item.id}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<FormItem  label="使用状态类型：">
	    	        	<Select {...getFieldProps('use_status')} placeholder="请选择状态" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			option.statusList.map(item => {
	    	        				return (
	    	        					<Option id={item.id} key={item.id}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
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
			key: 'mobile',
		}, {
			title: '优惠券编号',
			dataIndex: 'serial',
			key: 'serial',
		}, {
			title: '交易时间',
			dataIndex: 'date',
			key: 'date',
		}, {
			title: '数据源',
			dataIndex: 'source',
			key: 'source',
			render(status) {
				return(
					<span>{status == 1? '导入': '实时'}</span>
				)
			}
		}, {
			title: '使用状态',
			dataIndex: 'use_status',
			key: 'use_status',
			render(status) {
				return(
					<span>{status? '使用': '未使用'}</span>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return(
					<a onClick={showModal(obj)}>查看</a>
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

	handleCancel() {
		this.setState({
			visible: false
		})
	}

	showModal(obj) {
		this.setState({
			visible: true,
			info: obj
		})
	}

	renderModal() {
		const info = this.state.info
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}
		const content = (
				<Form horizontal >
			        <FormItem
			          {...formItemLayout}
			          label="手机号："
			          disabled
			          hasFeedback
			          >
			          <Input value={info.mobile} readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="优惠券编号："
			          disabled
			          hasFeedback
			          >
			          <Input value={info.serial} readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="交易时间："
			          disabled
			          hasFeedback
			          >
			          <Input value={info.date} readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="请求id："
			          disabled
			          hasFeedback
			          >
			          <Input value={info.id} readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="数据源："
			          disabled
			          hasFeedback
			          >
			          <Input value={info.source} readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="使用状态："
			          disabled
			          hasFeedback
			          >
			          <Input value={info.use_status} readOnly/>
			        </FormItem>
			    </Form>
		)
		return(
			<Modal 
				title="查看"
				visible={this.state.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				onOk={::this.handleCancel}
			>
				{content}
			</Modal>
		)
	}

	render() {
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				{this.renderModal()}
			</div>
		)
	}
}