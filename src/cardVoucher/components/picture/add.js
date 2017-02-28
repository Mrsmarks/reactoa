import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import message from 'antd/lib/message'
import Icon from 'antd/lib/icon'
import Form from 'antd/lib/form'
import Upload from 'antd/lib/upload'
import Input from 'antd/lib/input'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'

const FormItem = Form.Item
@Form.create()
export default class addPicComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			picImg: ''
		}
	}

	static propTypes = {

	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	uploadFile(type, file){
		this.props.actions.uploadFile(file).then(resolve => {
			message.success('图片上传成功')
			this.setState({
				[type]:resolve.result.file_url
			})
		})
	}

	handleSubmit = () => {
		this.props.form.validateFields((errors) => {
			if(!!errors){
				return
			}
			let values = {}
			values.name = this.props.form.getFieldValue(['name'])
			values.img_url = this.state.picImg
			this.props.actions.addCardVoucherPhotos(values).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push('/card-voucher/picture/index')
			})
		})
	}

	renderTable() {
		const { getFieldProps } = this.props.form

		const formItemProps = {
			labelCol: { span: 3 },
			wrapperCol: { span:6 }
		}

		const acnameProps =  getFieldProps('acname',{
			initialValue: this.props.acname
		})
		
		const nameProps = getFieldProps('name', {
			rules: [
				{ required:true, message: '请输入图片名称' }
			]
		})		


		const fileUploadProps = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload:this.uploadFile.bind(this, 'picImg'),
			fileList: this.state.picImg ? [{
				uid: -1,
				state: 'done',
 				url: this.props.assetsUrl + this.state.picImg
			}] : [],
			onPreview: file =>{
				window.open(file.url)
			}
		}
		return (
			<div>
				<Form horizontal style={{marginTop: 40 }}>
					<FormItem
						{...formItemProps}
						label="公众号："						
					>
						<Input disabled {...acnameProps}/>
					</FormItem>
					<FormItem
					 	{...formItemProps}
					 	label="图片名称："
					 	hasFeedback
					 	required
					>
						<Input  {...nameProps} placeholder="请输入图片名称"/>
					</FormItem>
					<FormItem
						{...formItemProps}
						label="上传图片："
						hasFeedback
						required
					>
						<Upload {...fileUploadProps} >
							<Icon type="plus" />
						</Upload>
					</FormItem>

					<FormItem
					>
						<Col offset="3">
							<Button type="primary" onClick={this.handleSubmit}>确定</Button>
							<Button type="ghost" style={{marginLeft:10}} onClick={() => {history.back()}}>返回</Button>
						</Col>	
					</FormItem>
				</Form>
			</div>
		)

	}

	render() {
		return (
			<div>
				{this.renderTable()}
			</div>
		)
	}

}