import React, { PropTypes } from 'react'

import Modal from 'antd/lib/modal'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Button from 'antd/lib/button'
import Auth from 'Application/components/auth'

import Form from 'antd/lib/form'


const FormItem = Form.Item



@Form.create()
export default class EditModal extends React.Component{
	static propTypes = {
		visible: PropTypes.bool.isRequired,
		onSubmit: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired,
		data: PropTypes.object.isRequired
	}

	constructor(props) {
		super(props)
	}

	validate() {
		this.props.form.validateFields((error, values) => {
			if (error) {
				return
			}

			const postData = {
				...values,
				level: this.props.data.level,
				type: this.props.data.type
			}

			this.props.onSubmit(postData, 'update', this.props.data.id)
			
		})
	}

	renderForm() {
		const { getFieldProps } = this.props.form
		const data = this.props.data
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const parentProps = getFieldProps('parent', {
			initialValue: data.parentName
		})

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称' }
			],
			initialValue: data.name
		})

		const authProps = getFieldProps('auth', {
			rules: [
				{ required: true, message: '请输入权限名' }
			],
			initialValue: data.auth
		})

		// const typeProps = getFieldProps('type', {
		// 	rules: [
		// 		{ required: true, type: 'number', message: '请输入菜单类型' }
		// 	],
		// 	initialValue: data.type
		// })

		const sortProps = getFieldProps('sort', {
			rules: [
				{ required: true, type: 'number', message: '请输入排序' }
			],
			initialValue: +data.sort
		})
		return (
			<Form horizontal>
			{
				data.level != 1 &&
				<FormItem
					{...formItemLayout}
					label="父级："
				>
					<Input {...parentProps} disabled/>
				</FormItem>
			}
				<FormItem
					{...formItemLayout}
					label="名称："
					hasFeedback
				>
					<Input {...nameProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="权限名："
					hasFeedback
				>
					<Input {...authProps}/>
				</FormItem>
			{
				(data.type == 1 && data.level < 4) &&
				<FormItem
					{...formItemLayout}
					label="菜单地址："
					hasFeedback
				>
					<Input 
						{...getFieldProps('url', {
							rules: [
								{ required: true, message: '请输入菜单地址' }
							],
							initialValue: data.url
						})}
					/>
				</FormItem>
			}
			{
				(data.type == 1 && data.level < 4) &&
				<FormItem
					{...formItemLayout}
					label="图标："
					hasFeedback
				>
					<Input 
						{...getFieldProps('icon', {
							rules: [
								{ required: true, message: '请输入图标' }
							],
							initialValue: data.icon
						})}
					/>
				</FormItem>
			}
				<FormItem
					{...formItemLayout}
					label="排序："
					hasFeedback
				>
					<InputNumber {...sortProps}/>
				</FormItem>
			</Form>
		)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
	}

	render() {
		const data = this.props.data

		return (
			<Modal 
				title="编辑"
				visible={this.props.visible}
				onCancel={this.props.onCancel}
				footer={[
					<Button key="back" type="ghost" size="large" onClick={this.props.onCancel}>返 回</Button>,
					<Auth type={["system-menu-update"]}>
						<Button key="submit" type="primary" size="large" onClick={::this.validate}>
							提 交
						</Button>
					</Auth>
				]}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}