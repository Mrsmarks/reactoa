import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import TimePicker from 'antd/lib/time-picker'
import Modal from 'antd/lib/modal'

import format from 'Application/utils/formatDate'


const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

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
		const option = this.props.option
		const info = this.props.info
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const openShare = Object.keys(info).length > 0 && info.open_share_rule > 0?  (<div><FormItem
		          {...formItemLayout}
		          label="分享增加次数："
		          hasFeedback
		          >
		          <Input {...getFieldProps('share_add_num')} value={info.share_add_num} readOnly/>
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label="分享增加次数上线："
		          hasFeedback
		          >
		          <Input {...getFieldProps('share_add_toplimit')} value={info.share_add_toplimit} readOnly/>
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label="分享次数有效期："
		          hasFeedback
		          >
		          <RadioGroup value={info.share_num_validity} readOnly>
		           		{
		           			option.numValidity.map(item => {
		           				return(
		           					<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		           				)
		           			})
		           		}
		          </RadioGroup>
		        </FormItem>
		        </div>): ''

		const winNum = Object.keys(info).length > 0 && info.rule_type > 2? (<div>
			 	<FormItem
		          {...formItemLayout}
		          label="中奖次数："
		          hasFeedback
		          >
		          <Input {...getFieldProps('win_num')} value={info.win_num} readOnly/>
		        </FormItem>
			</div>): ''

		return(
			<Form horizontal >
		        <FormItem
		          {...formItemLayout}
		          label="规则名称："
		          disabled
		          hasFeedback
		          >
		          <Input value={info.name} readOnly/>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="规则类型："
		          hasFeedback
		          >
		           <Select value={+info.rule_type} readOnly>
		           	 	{
		           	 		option.ruleType.map(item => {
		           	 			return (
		           	 				<Option key={item.id} value={item.id+''}>{item.name}</Option>
		           	 			)
		           	 		})
		           	 	}
		           </Select>
		        </FormItem>
		        {winNum}
		         <FormItem
		          {...formItemLayout}
		          label="参与次数："
		          disabled
		          hasFeedback
		          >
		          <Input value={info.partake_num} readOnly/>
		        </FormItem>

	        	<FormItem
		          {...formItemLayout}
		          label="参与次数有效期："
		          hasFeedback
		          >
		          <RadioGroup value={+info.partake_num_type} readOnly>
		           		{
		           			option.numValidity.map(item => {
		           				return(
		           					<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		           				)
		           			})
		           		}
		          </RadioGroup>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="分享："
		          hasFeedback
		          >
		          <RadioGroup value={+info.open_share_rule} readOnly>
		           		{
		           			option.shareRule.map(item => {
		           				return(
		           					<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		           				)
		           			})
		           		}
		          </RadioGroup>
		        </FormItem>
		        {openShare}
		        <FormItem
		          {...formItemLayout}
		          label="关注："
		          hasFeedback
		          >
		          <RadioGroup value={+info.attention} readOnly>
		           		{
		           			option.attentionRule.map(item => {
		           				return(
		           					<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		           				)
		           			})
		           		}
		          </RadioGroup>
		        </FormItem>
		        
		        <FormItem
		          {...formItemLayout}
		          label="手机绑定："
		          hasFeedback
		          >
		          <RadioGroup value={+info.bind_phone} readOnly>
		           		{
		           			option.bindPhone.map(item => {
		           				return(
		           					<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		           				)
		           			})
		           		}
		          </RadioGroup>
		        </FormItem>


		        <FormItem
		          {...formItemLayout}
		          label="白名单："
		          hasFeedback
		          >
		          <RadioGroup value={+info.open_white_list} readOnly>
		           		{
		           			option.whiteList.map(item => {
		           				return(
		           					<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		           				)
		           			})
		           		}
		          </RadioGroup>
		        </FormItem>

		         <FormItem
		          {...formItemLayout}
		          label="黑名单："
		          hasFeedback
		          >
		          <RadioGroup value={+info.open_black_list} readOnly>
		           		{
		           			option.blackList.map(item => {
		           				return(
		           					<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		           				)
		           			})
		           		}
		          </RadioGroup>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="分享助力："
		          hasFeedback
		          >
		          <Select value={info.share_help_type+''} readOnly>
		           		{
		           			option.shareHelpType.map(item => {
		           				return(
		           					<Option key={item.id} value={item.id+''}>{item.name}</Option>
		           				)
		           			})
		           		}
		          </Select>
		        </FormItem>
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