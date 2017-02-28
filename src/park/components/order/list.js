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

	static propTypes = {
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
				pathname: '/park/order/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchOrderList({page, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/park/order/list',
			query: query
		})
		this.props.actions.fetchOrderList(query)
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
					<FormItem  label="充值状态：">
	    	        	<Select {...getFieldProps('deposit_status')} placeholder="请选择充值状态" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			option.orderStatus.map(item => {
	    	        				return (
	    	        					<Option id={item.id} key={item.id}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<FormItem  label="优惠券：">
	    	        	<Select {...getFieldProps('action')} placeholder="请选优惠券类型" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			option.orderType.map(item => {
	    	        				return (
	    	        					<Option id={item.id} key={item.id}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<FormItem  label="手机号码：">
	    	        	<Input {...getFieldProps('mobile')}/>
		        	</FormItem>
		        	<FormItem  label="订单编号：">
	    	        	<Input {...getFieldProps('orderid')}/>
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
			title: '订单编号',
			dataIndex: 'orderid',
			key: 'orderid',
		}, {
			title: '充值金额',
			dataIndex: 'pay',
			key: 'pay',
		}, {
			title: '优惠券',
			dataIndex: 'action',
			key: 'action',
			render(status) {
				const name = ['优惠券', '其他']
				return(
					<span>{name[status]}</span>
				)
			}
		}, {
			title: '优惠券编号',
			dataIndex: 'serial',
			key: 'serial',
		}, {
			title: '用户奖品',
			dataIndex: 'user_prize_id',
			key: 'user_prize_id',
		}, {
			title: '充值状态',
			dataIndex: 'deposit_status',
			key: 'deposit_status',
			render(status) {
				const name = ['通知失败','正在充值','充值成功','充值失败']
				return(
					<span>{name[status]}</span>
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
			          label="订单编号："
			          disabled
			          hasFeedback
			          >
			          <Input value={info.orderid} readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="充值金额："
			          disabled
			          hasFeedback
			          >
			          <Input value={info.pay} readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="优惠："
			          disabled
			          hasFeedback
			          >
			          <Input value={info.action? '其他': '优惠券'} readOnly/>
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
			          label="奖品："
			          disabled
			          hasFeedback
			          >
			          <Input value={info.user_prize_id} readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="充值状态："
			          disabled
			          hasFeedback
			          >
			          <Input value={info.status? '删除': '有效'} readOnly/>
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