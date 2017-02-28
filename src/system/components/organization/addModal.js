import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Radio from 'antd/lib/radio'
const RadioGroup = Radio.Group
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

		const oidProps = getFieldProps('institu_code', {
			rules: [
				{ required: true, message: '请输入机构编码' }
			]
		})

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入机构名称' }
			]

		})

		const introProps = getFieldProps('intro', {
			rules: [
				{ required: true, message: '请输入简介' }
			]
		})

		const parentidProps = getFieldProps('parentid', {
			
		})

		const addressProps = getFieldProps('address', {
			
		})

		const enableProps = getFieldProps('enable', {
			rules: [
				{ required: true, message: '请选择启用状态' }
			]
		})

		return(
			<Form horizontal>
				<FormItem
					{...formItemLayout}
					label="外部机构编码："
					hasFeedback
				>
					<Input  {...oidProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="机构名称："
					hasFeedback
				>
					<Input  {...nameProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="机构简介："
					hasFeedback
				>
					<Input  {...introProps} />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="上级机构编码："
					hasFeedback
				>
					<Input  {...parentidProps} />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="机构地址："
					hasFeedback
				>
					<Input   {...addressProps}  />
				</FormItem>

				<FormItem
					{...formItemLayout}
					label="启用状态状态："
					hasFeedback
				>
					<RadioGroup {...enableProps}>
				        <Radio key="a" value="1">开启</Radio>
				        <Radio key="b" value="2">关闭</Radio>
				    </RadioGroup>
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
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}