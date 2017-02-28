import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import TimePicker from 'antd/lib/time-picker'
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

		return(
			<Form horizontal >
		        <FormItem
		          {...formItemLayout}
		          label="主题名称："
		          disabled
		          hasFeedback
		          >
		          <Input value={info.name} readOnly/>
		        </FormItem>
		         <FormItem
		          {...formItemLayout}
		          label="备注："
		          disabled
		          hasFeedback
		          >
		          <Input value={info.remark} readOnly/>
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