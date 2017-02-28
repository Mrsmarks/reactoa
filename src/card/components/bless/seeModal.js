import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Upload from 'antd/lib/upload'
import format from 'Application/utils/formatDate'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'

const FormItem = Form.Item
const Option = Select.Option

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

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
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
		

		return(
			<Form horizontal>
		        <FormItem
		          {...formItemLayout}
		          label="标题："
		          hasFeedback
		          >
		           <Input value={info.title} readOnly/>
		        </FormItem>

		        <FormItem  {...formItemLayout} label="类型：" hasFeedback>
	        	 	<Select value={info.type+''} placeholder="请选择贺卡类型" readOnly>
	        	 		{
	        	 			select.map(item => {
	        	 				return (
	        	 					<Option key={item.value} value={item.value+''}>{item.label}</Option>
	        	 				)
	        	 			})
	        	 		}
	        	 	</Select>
	        	</FormItem>
	        	
	        	 <FormItem
		          {...formItemLayout}
		          label="祝福语："
		          hasFeedback
		          >
		           <Input value={info.content} type="textarea" rows="6" readOnly/>
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