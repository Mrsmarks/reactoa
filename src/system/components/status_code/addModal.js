import React, { PropTypes } from 'react'

import Immutable from 'immutable'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
const FormItem = Form.Item

@Form.create()

export default class MainModal extends React.Component{

	static propTypes = {
		user: PropTypes.instanceOf(Immutable.Map).isRequired
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			this.props.handleAdd(values)
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
		const codeProps = getFieldProps('code', {
				rules: [
					{ required: true, message: '请输入状态码' }
				]
				
		})
		const contactProps = getFieldProps('msg', {
				rules: [
					{ required: true, message: '请输入状态码说明' }
				]
			
		})
		return(
			<Form horizontal>
				<FormItem
					{...formItemLayout}
					label="错误码："
					hasFeedback
				>
					<Input {...codeProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="说明："
					hasFeedback
				>
					<Input {...contactProps} type="textarea" rows="6"/>
				</FormItem>
			</Form>
		)
	}

	render() {
		return(
			<Modal 
				title="新增"
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