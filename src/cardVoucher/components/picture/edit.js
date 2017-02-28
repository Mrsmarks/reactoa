import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'
import Upload from 'antd/lib/upload'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'

const FormItem = Form.Item
@Form.create()
export default class editPicComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info:[],
			img_url:''
		}
	}

	static propTypes = {
		info: PropTypes.instanceOf(Immutable.Map).isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	componentWillMount() {
		this.setState({
			img_url: this.props.info.get('img_url')
		})
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			img_url: nextProps.info.get('img_url')
		})
	}

	uploadFile(file) {
		this.props.actions.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				img_url:resolve.result.file_url
			})
		})
	}

	handleSubmit = () => {
		const id = this.props.info.get('id')
		this.props.form.validateFields((error) => {
			if(!!error){
				return 
			}
			let values = {}
			values.name = this.props.form.getFieldValue(['name'])
			values.img_url = this.state.img_url
		    this.props.actions.updateCardVoucherPhotos(values,id).then(response => {
			 	message.success(response.errormsg)
			}).then(() => {
				this.context.router.push('/card-voucher/picture/index')
			})		
		})	
	}
	
	render(){
		const { getFieldProps } = this.props.form
		const checkedInfo = this.props.info

		const formItemProps = {
			labelCol: { span: 3 },
			wrapperCol: { span:6 }
		}

		const acnameProps = getFieldProps('acname', {
			initialValue: checkedInfo.get('acname')
		})

		const nameProps = getFieldProps('name', {
			rules: [
				{ required:true, message: '请输入图片名称' }
			],
			initialValue: checkedInfo.get('name')
		})

		const fileUploadProps = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this),
			fileList: this.state.img_url ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.img_url
			}] : []
		}

		return (
			<div>
				<Form horizontal style={{marginTop: 40 }}>
					<FormItem
						{...formItemProps}
						label="公众号："						
					>
						<Input {...acnameProps} disabled/>
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
						<Upload  {...fileUploadProps}>
							<Icon type="plus"/>
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
}
