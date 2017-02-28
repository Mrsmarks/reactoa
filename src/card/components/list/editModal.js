import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
import Icon from 'antd/lib/icon'
import Cascader from 'antd/lib/cascader'
import message from 'antd/lib/message'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_2')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			values.type = values.option[0]
			values.example = values.option[1]
			delete values.option
			this.props.handleUpdate(values, this.props.info.id)
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
				span: 14
			}
		}
		const mobileProps = getFieldProps('mobile', {
			rules: [
				{ required: true, message: '请输入标题' }
			],
			initialValue: info.mobile
		})

		const optionProps = getFieldProps('option', {
			rules: [
				{ required: true, type: 'array',message: '请选择贺卡类型/实例' }
			],
			initialValue: [info.type + '', info.example + '']
		})

		return(
			<Form horizontal>
		        <FormItem
		          {...formItemLayout}
		          label="手机号："
		          hasFeedback
		          >
		           <Input {...mobileProps}/>
		        </FormItem>

		        <FormItem  {...formItemLayout} label="贺卡类型/实例：" hasFeedback>
		        	<Cascader {...optionProps} options={select.CardsType} placeholder="请选择"/>
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