import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'


import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'

import DatePicker from 'antd/lib/date-picker'
import Modal from 'antd/lib/modal'

import format from 'Application/utils/formatDate'


const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			validity_type: '',
			score: '',
			ready: false
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
			this.setState({
				ready: false,
				validity_type: '',
				score: ''
			})
		}
		if(!Object.is(nextProps.info, this.props.info) && Object.keys(nextProps.info).length > 0 && !this.state.ready) {
			this.setState({
				validity_type: nextProps.info.validity_type,
				score: nextProps.info.credit+'',
				ready: true
			})
		}
	}

	changeValidity(value) {
		this.setState({
			validity_type: value
		})
	}

	changeScore(event) {
		this.setState({
			score: event.target.value+''
		})
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const formatData = {}
			formatData.name = values.name
			formatData.password = values.password
			formatData.r_aid = values.r_aid
			formatData.validity_type = values.validity_type
			formatData.use_redeem_code = values.use_redeem_code
			formatData.use_white_list = values.use_white_list
			formatData.use_black_list = values.use_black_list
			formatData.credit = values.credit
			formatData.credit_type = values.credit_type
			if(this.state.validity_type == 2) {
				formatData.start_time = format(values.date[0], 'yyyy-MM-dd hh:mm:ss')
				formatData.end_time = format(values.date[1], 'yyyy-MM-dd hh:mm:ss')
			}
			if(this.state.validity_type == 3) {
				formatData.valid_day = values.valid_day
			}
			if(this.state.validity_type == 4) {
				formatData.days = values.days
			}
			this.props.handleUpdate(formatData, this.props.info.id)
		})
	}

	renderForm() {

		const { getFieldProps } = this.props.form
		const select = this.props.select
		const info = this.props.info
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 16
			}
		}

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称' }
			],
			initialValue: info.name
		})

		const passwordProps = getFieldProps('password', {
			
			initialValue: info.password
		})

		const aidProps = getFieldProps('r_aid', {
			
			initialValue: info.r_aid? info.r_aid: ''

		})

		const validityProps = getFieldProps('validity_type', {
			
			initialValue: info.validity_type,
			onChange: ::this.changeValidity

		})
		
		const redeemProps = getFieldProps('use_redeem_code', {
			
			initialValue: info.use_redeem_code
		})

		const whiteProps = getFieldProps('use_white_list', {
			
			initialValue: info.use_white_list
		})

		const blackProps = getFieldProps('use_black_list', {
			
			initialValue: info.use_black_list
		})

		const scoreTypeProps = getFieldProps('credit', {
			initialValue: info.credit+'',
			onChange: ::this.changeScore
		})

		const validDayProps = this.state.validity_type == 3? (<FormItem
		        	  {...formItemLayout}
		        	  label="延期生效时间："
		        	  disabled
		        	  hasFeedback
		        	  >
		        	  <Input  {...getFieldProps('valid_day', {
		        	  	rules: [
							{ required: true,  message: '请输入延迟生效时间' }
						],
						initialValue: info.valid_day
		        	  })} /></FormItem>):''


		const dateProps =  this.state.validity_type == 2? (<FormItem
		        	  {...formItemLayout}
		        	  label="开始/结束时间："
		        	  hasFeedback
		        	  required
		        	  >
				     <RangePicker {...getFieldProps('date', {
						rules: [
							{ required: true, type:'array', message: '请选择时间' }
						],
						initialValue: [info.start_time, info.end_time]
						})} 
				     showTime format="yyyy-MM-dd HH:mm:ss" style={{ width: '100%' }} />
		        	</FormItem>): ''

		const daysProps = this.state.validity_type == 4? (<FormItem
		        	  {...formItemLayout}
		        	  label="几天内有效："
		        	  disabled
		        	  hasFeedback
		        	  >
		        	  <Input  {...getFieldProps('days', {
		        	  	rules: [
							{ required: true,  message: '请输入有效天数' }
						],
						initialValue: info.days
		        	  })} /></FormItem>):''

		const scoreProps = this.state.score == 1? (<FormItem
		        	  {...formItemLayout}
		        	  label="积分类型："
		        	  disabled
		        	  hasFeedback
		        	  >
		        	  <Select  {...getFieldProps('credit_type', {
						initialValue: info.credit_type? info.credit_type+'': ''
					  })}>
		        	  	{
		           	 		select.creditType.map(item => {
		           	 			return (
		           	 				<Option key={item.id} value={item.id+''}>{item.name}</Option>
		           	 			)
		           	 		})
		           	 	}
		        	  </Select></FormItem>):''

		return(
			<Form horizontal >
		        <FormItem
		          {...formItemLayout}
		          label="名称："
		          disabled
		          hasFeedback
		          >
		          <Input {...nameProps} />
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="奖品核销密码："
		          disabled
		          hasFeedback
		          >
		          <Input  {...passwordProps} />
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="触发活动白名单："
		          hasFeedback
		          >
		           <Select {...aidProps}>
		           	 	{
		           	 		select.activityList.map(item => {
		           	 			return (
		           	 				<Option key={item.aid} value={item.aid+''}>{item.name}</Option>
		           	 			)
		           	 		})
		           	 	}
		           </Select>
		        </FormItem>

		         <FormItem
		          {...formItemLayout}
		          label="有效期类型："
		          hasFeedback
		          >
		           <Select {...validityProps}>
		           	 	{
		           	 		select.validityType.map(item => {
		           	 			return (
		           	 				<Option key={item.id} value={item.id+''}>{item.name}</Option>
		           	 			)
		           	 		})
		           	 	}
		           </Select>
		        </FormItem>

		        <div hidden={this.state.validity_type != 2}>{dateProps}</div>

		        <div hidden={this.state.validity_type != 3}>{validDayProps}</div>

		      	<div hidden={this.state.validity_type != 4}>{daysProps}</div>

		        <FormItem
		          {...formItemLayout}
		          label="是否使用兑换码："
		          hasFeedback
		          >
		          <RadioGroup {...redeemProps}>
		           		{
		           			select.redeemCode.map(item => {
		           				return(
		           					<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		           				)
		           			})
		           		}
		          </RadioGroup>
		        </FormItem>



	        	<FormItem
		          {...formItemLayout}
		          label="是否使用白名单："
		          hasFeedback
		          >
		          <RadioGroup {...whiteProps}>
		           		{
		           			select.whiteList.map(item => {
		           				return(
		           					<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		           				)
		           			})
		           		}
		          </RadioGroup>
		        </FormItem>

		       <FormItem
		          {...formItemLayout}
		          label="是否使用黑名单："
		          hasFeedback
		          >
		          <RadioGroup {...blackProps}>
		           		{
		           			select.balckList.map(item => {
		           				return(
		           					<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		           				)
		           			})
		           		}
		          </RadioGroup>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="是否使用积分："
		          hasFeedback
		          >
		          <RadioGroup {...scoreTypeProps}>
		           		{
		           			select.creditRule.map(item => {
		           				return(
		           					<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		           				)
		           			})
		           		}
		          </RadioGroup>
		        </FormItem>

		      	{scoreProps}

			</Form>
		)
	}

	render() {
		return(
			<Modal 
				title="编辑"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				confirmLoading={this.props.addLoading}
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}