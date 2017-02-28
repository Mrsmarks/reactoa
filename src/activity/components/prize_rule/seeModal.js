import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import DatePicker from 'antd/lib/date-picker'
import TimePicker from 'antd/lib/time-picker'
import Modal from 'antd/lib/modal'

import format from 'Application/utils/formatDate'


const FormItem = Form.Item
const RadioGroup = Radio.Group

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_3')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
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
				span: 14
			}
		}

		return(
			<Form horizontal >
		        <FormItem
		          {...formItemLayout}
		          label="名称："
		          disabled
		          hasFeedback
		          >
		          <Input value={info.name} readOnly/>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="奖品核销密码："
		          disabled
		          hasFeedback
		          >
		          <Input value={info.password} readOnly/>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="关联活动："
		          hasFeedback
		          >
		           <Select value={+info.r_aid} readOnly>
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
		           <Select value={info.validity_type} readOnly>
		           	 	{
		           	 		select.validityType.map(item => {
		           	 			return (
		           	 				<Option key={item.id} value={item.id+''}>{item.name}</Option>
		           	 			)
		           	 		})
		           	 	}
		           </Select>
		        </FormItem>

		         <div hidden={info.validity_type != 2}>
		        	<FormItem
		        	  {...formItemLayout}
		        	  label="开始时间："
		        	  hasFeedback
		        	  >
				         <DatePicker value={new Date(info.start_time)} readOnly/>
				         <TimePicker value={new Date(info.start_time)} style={{marginLeft: 10}} readOnly/>
		        	</FormItem>

		        	<FormItem
		        	  {...formItemLayout}
		        	  label="结束时间："
		        	  hasFeedback
		        	  >
				         <DatePicker value={new Date(info.end_time)} readOnly/>
				         <TimePicker value={new Date(info.end_time)} style={{marginLeft: 10}} readOnly/>
		        	</FormItem>
		        </div>

		        <div hidden={info.validity_type != 3}>
		        	<FormItem
		        	  {...formItemLayout}
		        	  label="延期生效时间："
		        	  disabled
		        	  hasFeedback
		        	  >
		        	  <Input  value={info.valid_day} readOnly/>
		        	</FormItem>
		        </div>

		        <div hidden={info.validity_type != 4}>
		        	<FormItem
		        	  {...formItemLayout}
		        	  label="几天内有效："
		        	  disabled
		        	  hasFeedback
		        	  >
		        	  <Input value={info.days} readOnly/>
		        	</FormItem>
		        </div>

		        <FormItem
		          {...formItemLayout}
		          label="是否使用兑换码："
		          hasFeedback
		          >
		          <RadioGroup value={info.use_redeem_code} readOnly>
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
		          <RadioGroup value={info.use_white_list} readOnly>
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
		          <RadioGroup value={info.use_black_list} readOnly>
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
		          <RadioGroup value={info.credit+''} readOnly>
		           		{
		           			select.creditRule.map(item => {
		           				return(
		           					<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		           				)
		           			})
		           		}
		          </RadioGroup>
		        </FormItem>

		        <div hidden={info.credit != 1}>
			        <FormItem
			        	  {...formItemLayout}
			        	  label="积分类型："
			        	  disabled
			        	  hasFeedback
			        	  >
			        	  <Select value={info.credit_type+''} readOnly>
			        	  	{
			           	 		select.creditType.map(item => {
			           	 			return (
			           	 				<Option key={item.id} value={item.id+''}>{item.name}</Option>
			           	 			)
			           	 		})
			           	 	}
			        	  </Select>
			        </FormItem>
		        </div>
			</Form>
		)
	}

	render() {
		return(
			<Modal 
				title="查看"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				onOk={::this.handleCancel}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}