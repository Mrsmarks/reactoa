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
		this.props.toggle(undefined, 'visible_2')
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
		const cpnameProps = getFieldProps('cpname', {
			
			initialValue: info.cpname  
		})

		const oidProps = getFieldProps('oid', {
			
			initialValue: info.institu_code 
		})

		const nameProps = getFieldProps('name', {
			
			initialValue: info.name 

		})

		const introProps = getFieldProps('intro', {
			
			initialValue: info.intro

		})

		const parentidProps = getFieldProps('parentid', {
			
			initialValue: info.parentid

		})

		const addressProps = getFieldProps('address', {
			
			initialValue: info.address

		})
		const enableProps = getFieldProps('enable', {
			
			initialValue: info.enable+'' 
		})

		return(
			<Form horizontal>
				<FormItem
					{...formItemLayout}
					label="企业名称："
				>
					<Input readOnly {...cpnameProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="外部机构编码："
				>
					<Input readOnly {...oidProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="机构名称："
				>
					<Input readOnly {...nameProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="机构简介："
				>
					<Input readOnly {...introProps} />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="上级机构："
				>
					<Input readOnly {...parentidProps} />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="机构地址："
				>
					<Input readOnly  {...addressProps}  />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="启用状态状态："
				>
					<RadioGroup readOnly {...enableProps}>
				        <Radio key="1" value="1">开启</Radio>
				        <Radio key="2" value="2">关闭</Radio>
				    </RadioGroup>
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