import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'



import Select from 'antd/lib/select'




import Modal from 'antd/lib/modal'


const FormItem = Form.Item




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
		const info = this.props.info
		return(
			<Form horizontal >
				<FormItem
		          {...formItemLayout}
		          label="名称："
		          hasFeedback
		          >
		          <Input value={info.name} readOnly type="text" />
			    </FormItem>
			    <FormItem
		          {...formItemLayout}
		          disabled
		          label="备注："
		          hasFeedback
		          >
		           <Input value={info.remark} readOnly type="textarea" rows="6"/>
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