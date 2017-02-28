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
		this.props.toggle(undefined, 'visible_4')
	}

	handelEdit() {
		var fatherNode = this.props.info
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const input = values
			fatherNode.type == 1? input.type = 1: input.type = 2
			input.parent_id = fatherNode.parent_id
			if(fatherNode.parent_name) input.parent_name = fatherNode.parent_name
			this.props.handleEdit(fatherNode.id, input)
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
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
		if(typeof this.props.info.name == 'string'){
			this.props.info.name = this.props.info.name.replace(/.*\./g, '')
		}
		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称' }
			],
			initialValue: this.props.info.name
		})

		const remarkProps = getFieldProps('remark', {
			rules: [
				{ required: true, message: '请输入备注' }
			],
			initialValue: this.props.info.remark 
		})

		const renderTableName = () => {
			if(this.props.info.type == 2){
				return (
					<FormItem
					{...formItemLayout}
					label="表名："
					hasFeedback
					>
					<Input defaultValue={this.props.info.parent_name} disabled/>
					</FormItem>
				)
			}
		}

		return(
			<Form horizontal>
				{ renderTableName() }
				<FormItem
					{...formItemLayout}
					label={this.props.info.type == 1? '表名：': '字段名：'}
					hasFeedback
				>
					<Input {...nameProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="备注："
					hasFeedback
				>
					<Input {...remarkProps}/>
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
				confirmLoading={this.props.editChildLoading}
				onOk={::this.handelEdit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}