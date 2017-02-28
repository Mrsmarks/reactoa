import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Modal from 'antd/lib/modal'



const FormItem = Form.Item


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

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const input = values
			input.type = 1
			input.parent_id = 0
			this.props.handleAdd(input)
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
				{ required: true, message: '请输入表名' }
			],
		})

		const remarkProps = getFieldProps('remark', {
			rules: [
				{ required: true, message: '请输入备注' }
			],
		})

		return(
			<Form horizontal>
				<FormItem
					{...formItemLayout}
					label="表名："
					hasFeedback
				>
					<Input  {...nameProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="备注："
					hasFeedback
				>
					<Input {...remarkProps} />
				</FormItem>
			</Form>
		)
	}

	render() {
		return(
			<Modal 
				title="新增帮助"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				confirmLoading={this.props.addChildLoading}
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}