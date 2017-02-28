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
		this.state = {
			share: false,
			ruleType: 0,
			ready: false
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_2')
	}

	onChange(event) {
		this.setState({
			share: event.target.value,
		})
	}

	changeRuleType(value) {
		const { setFieldsValue } = this.props.form
		this.setState({
			ruleType: value
		})
		setFieldsValue({'win_num':''})

	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
			this.setState({
				ready: false
			})
		}
		if(!Object.is(nextProps.info, this.props.info) && Object.keys(nextProps.info).length > 0 && !this.state.ready) {
			this.setState({
				share: nextProps.info.open_share_rule,
				ruleType: nextProps.info.rule_type,
				ready: true
			})
		}
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			console.log(values)
			this.props.handleUpdate(values, this.props.info.id)
		})
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

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入规则名称' }
			],
			initialValue: info.name
		})

		const ruleNameProps = getFieldProps('rule_type', {
			rules: [
				{ required: true, type:'number', message: '请选择规则类型' }
			],
			initialValue: +info.rule_type,
			onChange: ::this.changeRuleType
		})

		const numProps = getFieldProps('partake_num', {
			rules: [
				{ required: true, message: '请输入参与次数' }
			],
			initialValue: info.partake_num + ''

		})

		const partakeProps = getFieldProps('partake_num_type', {
			rules: [
				{ required: true, type:'number', message: '请选择参与次数有效期' }
			],
			initialValue: +info.partake_num_type
		})
		
		const shareProps = getFieldProps('open_share_rule', {
			rules: [
				{ required: true, type:'number', message: '请选择是否分享' }
			],
			initialValue: +info.open_share_rule,
			onChange: ::this.onChange
		})

		const attentionProps = getFieldProps('attention', {
			rules: [
				{ required: true,type:'number',  message: '请选择是否关注' }
			],
			initialValue: +info.attention
		})

		const phoneProps = getFieldProps('bind_phone', {
			rules: [
				{ required: true,type:'number',  message: '请选择是否绑定手机' }
			],
			initialValue: +info.bind_phone
		})

		const whiteProps = getFieldProps('open_white_list', {
			rules: [
				{ required: true, type:'number', message: '请选择白名单' }
			],
			initialValue: +info.open_white_list
		})

		const blackProps = getFieldProps('open_black_list', {
			rules: [
				{ required: true, type:'number', message: '请选择黑名单' }
			],
			initialValue: +info.open_black_list
		})

		const helpTypeProps = getFieldProps('share_help_type', {
			initialValue: info.share_help_type+''
		})

		const openShare = this.state.share > 0 &&  Object.keys(info).length > 0?  (<div><FormItem
		          {...formItemLayout}
		          label="分享增加次数："
		          hasFeedback
		          >
		          <Input {...getFieldProps('share_add_num', {
		          	rules: [
		          		{ required: true, message: '请选择输入增加次数' }
		          	],
		          	initialValue: info.share_add_num? info.share_add_num + '': ''
		          })} />
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label="分享增加次数上限："
		          hasFeedback
		          >
		          <Input {...getFieldProps('share_add_toplimit', {
		          	rules: [
		          		{ required: true, message: '请选择分享增加次数上限' }
		          	],
		          	initialValue: info.share_add_toplimit? info.share_add_toplimit + '': ''
		          })} />
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label="分享次数有效期："
		          hasFeedback
		          >
		           <RadioGroup  {...getFieldProps('share_num_validity', {
			          	rules: [
							{ required: true, message: '请选择分享次数有效期' }
						],
		          		initialValue: info.share_num_validity? info.share_num_validity + '': ''
			          })}>
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

		const winNum = this.state.ruleType > 2? (<div>
			 	<FormItem
		          {...formItemLayout}
		          label="中奖次数："
		          hasFeedback
		          >
		          <Input {...getFieldProps('win_num', {
		          	rules: [
						{ required: true, message: '请输入中奖次数' }
					],
					initialValue: info.win_num? info.win_num + '': ''
		          })}/>
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
		          <Input {...nameProps} />
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="规则类型："
		          hasFeedback
		          >
		           <Select {...ruleNameProps}>
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
		          <Input {...numProps} />
		        </FormItem>

	        	<FormItem
		          {...formItemLayout}
		          label="参与次数有效期："
		          hasFeedback
		          >
		          <RadioGroup {...partakeProps}>
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
		          <RadioGroup {...shareProps}>
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
		          <RadioGroup {...attentionProps}>
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
		          <RadioGroup {...phoneProps}>
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
		          <RadioGroup {...whiteProps}>
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
		          <RadioGroup {...blackProps}>
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
		          <Select {...helpTypeProps}>
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
				title="编辑"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				confirmLoading={this.props.updateLoading}
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}