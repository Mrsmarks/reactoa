import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import Spin from 'antd/lib/spin'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'


const FormItem = Form.Item




@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			img_url: '',
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
			this.setState({img_url: ''})
		}
		if(nextProps.visible && Object.keys(nextProps.info).length > 0) {
			
			this.setState({
				img_url: nextProps.info.content_txt_pictrue,
			})
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible')
	}

	handleSubmit() {
		const info = this.props.info
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			if(!this.state.img_url) {
				message.error('图片地址不能为空！')
			}else{
				values.content_txt_pictrue = this.state.img_url
				Object.keys(info).length > 0? values.key = info.key: values.key = ''
				this.props.setDataSource(values)
				this.setState({
					img_url: ''
				})
			}
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

		const titleProps = getFieldProps('content_txt_title', {
			rules: [
				{ required: true, message: '请输入标题' }
			],
			initialValue: Object.keys(info).length > 0? this.props.info.content_txt_title+'': ''

		})

		const urlProps = getFieldProps('content_txt_url', {
			rules: [
				{ required: true, message: '请输入链接地址' }
			],
			initialValue: Object.keys(info).length > 0? this.props.info.content_txt_url+'': ''
		})

		const descriptionProps = getFieldProps('content_txt_description', {
			initialValue: Object.keys(info).length > 0? this.props.info.content_txt_description+'': ''
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
			<Spin tip="正在上传图片..." spinning={this.props.fileLoading}>
				<Form horizontal >
			        <FormItem
			          {...formItemLayout}
			          label="标题："
			          disabled
			          hasFeedback
			          >
			          <Input {...titleProps} type="text" />
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="链接地址："
			          disabled
			          hasFeedback
			          >
			          <Input {...urlProps} type="text" />
			        </FormItem>
			         <FormItem
			          {...formItemLayout}
			          label="描述："
			          disabled
			          hasFeedback
			          >
			          <Input {...descriptionProps}  type="textarea" rows="6"/>
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="上传封面："
			          hasFeedback
			          required
			          >
			         	<Upload {...fileProps}>
							<Icon type="plus" />
							<div className="ant-upload-text">图片</div>
						</Upload>
			        </FormItem>
				</Form>
			</Spin>
		)
	}

	render() {
		return(
			<Modal 
				title="新增图文"
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