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

    checkMenuName(rule, value = '', callback) {
        const { validateFields } = this.props.form
        if (value.replace(/[^\x00-\xff]/g, "**").length > 10) {
          callback('一级菜单名称不得大于15字节')
        }
        if(value.replace(/[^\x00-\xff]/g, "**").length > 16) {
          callback('二级级菜单名称不得大于24字节')
        }
        callback()
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
				{ required: true, message: '请输入名称' },
                { validator: ::this.checkMenuName }
			]
		})

		const remarkProps = getFieldProps('remark', {
			rules: [
				{ required: true, message: '请输入备注' }
			]
		})

		return(
			<Form horizontal >
				<FormItem
		          {...formItemLayout}
		          label="名称："
		          hasFeedback
		          >
		          <Input {...nameProps} type="text" />
			    </FormItem>
			    <FormItem
		          {...formItemLayout}
		          disabled
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