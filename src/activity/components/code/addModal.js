import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import TimePicker from 'antd/lib/time-picker'
import Modal from 'antd/lib/modal'
import Cascader from 'antd/lib/cascader'
import Button from 'antd/lib/button'

import format from 'Application/utils/formatDate'


const FormItem = Form.Item


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
			values.change_status = 0
			values.aid = values.active[0]
			values.prize_id = values.active[1]
			this.props.handleAdd(values)
		})
	}


	renderForm() {

		const { getFieldProps } = this.props.form
		const select = this.props.select

		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}
		const aidProps = getFieldProps('active', {
			
		})

		const codeProps = getFieldProps('redeem_code', {
			rules: [
				{ required: true, message: '请输入兑换码' }
			]
		})

		return(
			<Form horizontal >
		        <FormItem
		          {...formItemLayout}
		          label="所属活动："
		          hasFeedback
		          >
		           <Cascader {...aidProps} options={select} />
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="兑换码："
		          disabled
		          hasFeedback
		          >
		          <Input  {...codeProps} />
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