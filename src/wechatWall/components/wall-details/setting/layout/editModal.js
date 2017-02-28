import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'




import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'

import TimePicker from 'antd/lib/time-picker'
import Modal from 'antd/lib/modal'

const FormItem = Form.Item


@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			img_url:'',
			ready: false
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_2')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
		if(!this.props.visible && Object.keys(nextProps.info).length) {
			this.setState({
				img_url: nextProps.info.thumb
			})
		}
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			values.thumb = this.state.img_url
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
				{ required: true, message: '请输入布局名称' }
			],
			initialValue: info.name 
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
		          label="布局名称："
		          disabled
		          hasFeedback
		          >
		          <Input {...nameProps} />
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="文件上传："
		          hasFeedback
		          >
		            <Upload {...fileProps}>
						<Icon type="plus" />
						<div className="ant-upload-text">缩略图</div>
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