import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'


import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'



import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'
import Alert from 'antd/lib/alert'



const FormItem = Form.Item
const RadioGroup = Radio.Group


@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
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
			this.props.handleAdd(values)
		})
	}

	renderForm() {

		const { getFieldProps } = this.props.form

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
				{ required: true, message: '请输入名称' }
			]
		})

		const typeProps = getFieldProps('type', {
			rules: [
				{ required: true, message: '请选择分组类型' }
			]
		})

		const remarkProps = getFieldProps('remark', {
			rules: [
				{ required: true, message: '请输入备注内容' }
			]
		})

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
		          label="分组类型："
		          hasFeedback
		          >
    				<RadioGroup {...typeProps} >
	                  	<Radio  value='1'>微信分组</Radio>
	                  	<Radio  value='2'>虚拟分组</Radio>
	                  	<Alert message="分组类型一旦选定，不可修改！"  type="warning" showIcon/>
		            </RadioGroup>		            
					
		        </FormItem>
	        	<FormItem
		          {...formItemLayout}
		          label="备注："
		          hasFeedback
		          >
		          <Input {...remarkProps} type="textarea" rows="6"/>
		        </FormItem>
			</Form>
		)
	}

	render() {
		return(
			<Modal 
				title="新建分组"
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