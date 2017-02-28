import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Modal from 'antd/lib/modal'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
const Option = Select.Option

const FormItem = Form.Item

@Form.create()
export default class AddModal extends React.Component{
	static propTypes = {
		visible: PropTypes.bool.isRequired,
		onSubmit: PropTypes.func.isRequired,
		onCancel: PropTypes.func.isRequired,
		data: PropTypes.object.isRequired,
		menuType: PropTypes.instanceOf(Immutable.List).isRequired
	}

	constructor(props) {
		super(props)
	}

	validate() {
		this.props.form.validateFields((error, values) => {
			if (error) {
				return
			}
			values.parent_id = this.props.data.id
			values.level = Object.keys(this.props.data).length ? +this.props.data.level + 1 : 1
			this.props.onSubmit(values)
			
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

		const parentProps = getFieldProps('parentName', {
			initialValue: data.name
		})

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称：' }
			]
		})

		const authProps = getFieldProps('auth', {
			rules: [
				{ required: true, message: '请输入权限名：' }
			]
		})

		const typeProps = getFieldProps('type', {
			rules: [
				{ required: true, type: 'number', message: '请输入菜单类型：' }
			]
		})

		const sortProps = getFieldProps('sort', {
			rules: [
				{ required: true, message: '请输入排序：' }
			]
		})


		return (
			<Form horizontal>

			{
				data.level != undefined &&
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
				data.level == 1 &&
				<FormItem
					{...formItemLayout}
					label="菜单地址："
					hasFeedback
				>
					<Input 
						{...getFieldProps('url', {
							rules: [
								{ required: true, message: '请输入菜单地址：' }
							]
						})}
					/>
				</FormItem>
			}

				<FormItem
					{...formItemLayout}
					label="菜单类型："
					hasFeedback
				>
					<Select {...typeProps}>
						{
							this.props.menuType.map((item, index) => 
								<Option key={index} value={item.get('id')+''}>{item.get('name')}</Option>
							)
						}
					</Select>
				</FormItem>
			{
				data.level == 1 &&
				<FormItem
					{...formItemLayout}
					label="图标："
					hasFeedback
				>
					<Input 
						{...getFieldProps('icon', {
							rules: [
								{ required: true, message: '请输入图标' }
							]
						})}
					/>
				</FormItem>
			}
				<FormItem
					{...formItemLayout}
					label="排序："
					hasFeedback
				>
					<Input {...sortProps}/>
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
		return (
			<Modal 
				title="添加"
				visible={this.props.visible}
				onCancel={this.props.onCancel}
				footer={[
					<Button key="back" type="ghost" size="large" onClick={this.props.onCancel}>返 回</Button>,
					<Button key="submit" type="primary" size="large" loading={this.props.loading} onClick={::this.validate}>
						提 交
					</Button>
				]}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}