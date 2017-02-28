import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'









import TimePicker from 'antd/lib/time-picker'
import Modal from 'antd/lib/modal'
import Cascader from 'antd/lib/cascader'


import format from 'Application/utils/formatDate'


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

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			values.aid = values.active[0]
			values.prize_id = values.active[1]
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

		const aidProps = getFieldProps('active', {
			rules: [
				{ required: true, type:'array', message: '请选择活动' }
			],
			initialValue: [info.aid+'', info.prize_id+'']
		})

		const codeProps = getFieldProps('redeem_code', {
			rules: [
				{ required: true, message: '请输入兑换码' }
			],
			initialValue: info.redeem_code
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