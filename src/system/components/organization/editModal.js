import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Radio from 'antd/lib/radio'
const RadioGroup = Radio.Group
const FormItem = Form.Item
@Form.create()

export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_3')
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			this.props.handleUpdate(values, this.props.info.id)
		})
	}

	
	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
	}


	renderForm() {

		const { getFieldProps } = this.props.form
		const info = this.props.info
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}
		const cpnameProps = getFieldProps('cpname', {
			rules: [
				{ required: true, message: '请输入企业名称' }
			],
			initialValue: info.cpname 
		})

		const oidProps = getFieldProps('institu_code', {
			rules: [
				{ required: true, message: '请输入机构编码' }
			],
			initialValue: info.institu_code 
		})

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入机构名称' }
			],
			initialValue: info.name 
		})

		const introProps = getFieldProps('intro', {
			rules: [
				{ required: true, message: '请输入简介' }
			],
			initialValue: info.intro 
		})

		const parentidProps = getFieldProps('parentid', {
			
			initialValue: info.parentid 
		})

		const addressProps = getFieldProps('address', {
			initialValue: info.address 
		})

		const enableProps = getFieldProps('enable', {
			rules: [
				{ required: true, message: '请选择启用状态' }
			],
			initialValue: info.enable+'' 
		})

		return(
			<Form horizontal>
				<FormItem
					{...formItemLayout}
					label="企业名称："
					hasFeedback
				>
					<Input  {...cpnameProps} disabled/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="外部机构编码："
					hasFeedback
				>
					<Input  {...oidProps} disabled/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="机构名称："
					hasFeedback
				>
					<Input  {...nameProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="机构简介："
					hasFeedback
				>
					<Input  {...introProps} />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="上级机构编码："
					hasFeedback
				>
					<Input  {...parentidProps} disabled/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="机构地址："
					hasFeedback
				>
					<Input   {...addressProps}  />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="启用状态状态："
					hasFeedback
				>
					<RadioGroup {...enableProps}>
				        <Radio key="1" value="1">开启</Radio>
				        <Radio key="2" value="2">关闭</Radio>
				    </RadioGroup>
				</FormItem>
			</Form>
		)
	}

	render() {
		return(
			<Modal 
				title="修改"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}