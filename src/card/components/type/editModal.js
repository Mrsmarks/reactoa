import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Upload from 'antd/lib/upload'
import format from 'Application/utils/formatDate'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'

const FormItem = Form.Item


@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			img_url: ''
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_2')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
		if(!this.props.visible && nextProps.info.hasOwnProperty('id')) {
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

	fileUploadFile(file) {
		this.props.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				img_url:resolve.result.file_url
			})
		})
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
		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称' }
			],
			initialValue: info.name 
		})

		const introProps = getFieldProps('intro', {
			initialValue: info.intro
		})

		const fileUploadProps = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.fileUploadFile.bind(this),
			fileList: this.state.img_url ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.img_url
			}] : []
		}

		return(
			<Form horizontal>
		        <FormItem
		          {...formItemLayout}
		          label="名称："
		          hasFeedback
		          >
		           <Input {...nameProps}/>
		        </FormItem>

		        <FormItem  {...formItemLayout} label="上传封面图：" hasFeedback>
	        	 	<Upload {...fileUploadProps}>
			          	<Icon type="plus" />
			          	<div className="ant-upload-text">封面图片</div>
			        </Upload>
	        	</FormItem>
	        	
	        	 <FormItem
		          {...formItemLayout}
		          label="简介："
		          hasFeedback
		          >
		           <Input {...introProps} type="textarea" rows="6"/>
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