import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'


import Select from 'antd/lib/select'

import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'

import TimePicker from 'antd/lib/time-picker'
import Modal from 'antd/lib/modal'

import format from 'Application/utils/formatDate'


const FormItem = Form.Item


@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			img_url:''
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_2')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
		if(nextProps.info.hasOwnProperty('id') && nextProps.info.cover_image != this.props.info.cover_image) {
			this.setState({
				img_url: nextProps.info.cover_image
			})
		}
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			values.cover_image = this.state.img_url
			this.props.handleUpdate(values, this.props.info.id)
		})
	}

	uploadFile(file) {
		this.props.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				img_url:resolve.result.file_url
			})
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

		const typeProps = getFieldProps('type', {
			rules: [
				{ required: true, message: '请选择类型' }
			],
			initialValue: info.type 
		})

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称' }
			],
			initialValue: info.name
		})

		const urlProps = getFieldProps('url', {
			rules: [
				{ required: true, message: '请输入地址' }
			],
			initialValue: info.url 
		})

		const fileProps = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this),
			fileList: this.state.img_url ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.img_url
			}] : []
		}
		
		return(
			<Form horizontal >
		        <FormItem
		          {...formItemLayout}
		          label="活动类型："
		          hasFeedback
		          >
		           <Select {...typeProps}>
		           	 	{
		           	 		select.map(item => {
		           	 			return (
		           	 				<Option key={item.id} value={item.id+''}>{item.name}</Option>
		           	 			)
		           	 		})
		           	 	}
		           </Select>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="名称："
		          disabled
		          hasFeedback
		          >
		          <Input {...nameProps} />
		        </FormItem>

	        	<FormItem
		          {...formItemLayout}
		          label="地址："
		          disabled
		          hasFeedback
		          >
		          <Input {...urlProps} />
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="上传封面图片："
		          disabled
		          hasFeedback
		          >
		          	<Upload {...fileProps}>
						<Icon type="plus" />
						<div className="ant-upload-text">封面图</div>
					</Upload>
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