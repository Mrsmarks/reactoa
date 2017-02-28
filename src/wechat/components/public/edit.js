import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Spin from 'antd/lib/spin'
import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

/**
 * 微信－公众号－编辑
 */
@Form.create()
export default class EditComp extends React.Component {
	constructor(props, context) {
    	super(props, context)
    	this.state = {
    		check_pay: '',
    		img_url: '',
    		photo_wall:'',
    		customer_service: ''
    	}
  	}

  	static propTypes = {
  		select: PropTypes.instanceOf(Immutable.Map).isRequired
  	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	} 

  	onChange(e) {
  		e.preventDefault()
  		const payStyle = e.target.value
  		this.setState({
  			check_pay: payStyle
  		})
  	}

  	onChangePhoto(e) {
  		e.preventDefault()
  		const value = e.target.value
  		this.setState({
  			photo_wall: value
  		})
  	}

  	onChangeService(e) {
  		e.preventDefault()
  		const value = e.target.value
  		this.setState({
  			customer_service: value
  		})
  	}

  	handleSubmit(e) {
  		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	values.head_img = this.state.img_url
	      	values.pay_mode = this.state.check_pay
	      	values.photo_wall = this.state.photo_wall
	      	values.customer_service = this.state.customer_service
	      	this.props.actions.addPublicList(values).then(reslove => {
	      		message.success(reslove.errormsg)
	      		this.context.router.push('/wechat/public/list')
	      	})
    	})
  	}

  	handleReset(e) {
  	    e.preventDefault();
  	    this.props.form.resetFields();
  	}  	


	uploadFile(file) {
		this.props.actions.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				img_url:resolve.result.file_url
			})
		})
	}

	render() {
		const select = this.props.select.toJS()
		if(select){
			const { getFieldProps } = this.props.form
			/*验证开始*/
			//
			const publicNumberProps = getFieldProps('nick_name', {
				rules: [
			       { required: true, message: '请输入公众号昵称' },
				]
			})

			const originIdProps = getFieldProps('original_id', {
				rules: [
			       { required: true, message: '请输入oId' },
				]
			})

			const appIdProps = getFieldProps('appId', {
				rules: [
			       { required: true, message: '请输入appId' },
				]
			})

			const secretProps = getFieldProps('appSecret', {
				rules: [
					{ required: true, message: '请输入appSecret' },
				]
			})

			const wechatProps = getFieldProps('wechat_account', {
				rules: [
				   { required: true, message: '请输入微信号' },
				]
			})

			const shNumberProps = getFieldProps('mch_id', {
						
			})

			const zzKeyProps = getFieldProps('pay_key', {
				
			})

			const select1Props = getFieldProps('auth_status', {
			     rules: [
				    { required: true,  message: '请选择授权状态' }
				 ]
			})

			const select2Props = getFieldProps('service_type_info', {
			    
			     rules: [
				    { required: true,  message: '请选择公众号类型' }
				 ]
			})

			const select3Props = getFieldProps('verify_type_info', {
			   
			   rules: [
				    { required: true,  message: '请选择认证类型' }
				 ]
			})

			const radio1Props = getFieldProps('pay_mode', {
				 rules: [
				    { required: true, message: '请选择认证类型' }
				 ],
				 onChange: ::this.onChange
			})

			const radio2Props = getFieldProps('photo_wall', {
				rules: [
				        { required: true,  message: '请选择是否开启照片墙' }
				],
				onChange: ::this.onChangePhoto
			})

			const radio3Props = getFieldProps('photo_print', {
				
				rules: [
				        { required: true,  message: '请选择是否开启照片打印' }
				],
				
			})

			const radio4Props = getFieldProps('customer_service', {
				rules: [
				    { required: true,  message: '请选择客服服务' }
				 ],
				 onChange: ::this.onChangeService
				
			})

			const photoKeywordProps = getFieldProps('photo_wall_keyword', {
			})

			const photoWallCheckProps = getFieldProps('photo_wall_check', {
			})

			const photoExpiresProps = getFieldProps('photo_wall_keyword_expires', {
			})

			const photoRimgProps = getFieldProps('photo_wall_image_rmsg', {
			})

			const photoRtextProps = getFieldProps('photo_wall_text_rmsg', {
			})

			const serviceKeywordProps = getFieldProps('customer_service_keyword', {
			})

			const servicePromptProps = getFieldProps('customer_service_prompt_message', {
			})



			/*验证结束*/


			const formItemLayout = {
			    labelCol: { span: 4 },
			    wrapperCol: { span: 12 }
			}

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

			return (
				<Spin tip="正在上传图片..." spinning={this.props.fileLoading}>
					<Form horizontal  style={{ marginTop: 40 }}>
						<FormItem
				          {...formItemLayout}
				          label="公众号："
				          hasFeedback
				          >
				          <Input id="pbNumber" {...publicNumberProps} size="large" type="text" />
				       </FormItem>

				        <FormItem
				          {...formItemLayout}
				          label="原始id："
				          hasFeedback
				          >
				          <Input size="large"  {...originIdProps} type="text" />
				        </FormItem>

				        <FormItem
				          {...formItemLayout}
				          label="Appid："
				          hasFeedback
				          >
				          <Input size="large" {...appIdProps} type="text" />
				        </FormItem>

				        <FormItem
				          {...formItemLayout}
				          label="Appsecret："
				          hasFeedback
				          >
				          <Input size="large" {...secretProps} type="text" />
				        </FormItem>

				        <FormItem
				          {...formItemLayout}
				          label="微信号："
				          hasFeedback
				          >
				          <Input {...wechatProps} size="large" type="text" />
				        </FormItem>

				        <FormItem  {...formItemLayout} label="授权状态：" hasFeedback>
		    	        	<Select {...select1Props} size="large" placeholder="请选择授权状态" style={{ width: 150 }}>
		    	        		{
		    	        			select.authState.map(item => {
		    	        				return (
		    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
		    	        				)
		    	        			})
		    	        		}
		    	        	</Select>
				        </FormItem>

				        <FormItem  {...formItemLayout} label="公众号类型：" hasFeedback>
		    	        	<Select {...select2Props} size="large" placeholder="请选择公众号类型" style={{ width: 150 }}>
		    	        		{
		    	        			select.serviceType.map(item => {
		    	        				return (
		    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
		    	        				)
		    	        			})
		    	        		}
		    	        	</Select>
				        </FormItem>

				        <FormItem  {...formItemLayout} label="认证类型：" hasFeedback>
		    	        	<Select {...select3Props} size="large" placeholder="请选择认证类型" style={{ width: 150 }}>
		    	        		{
		    	        			select.verifyType.map(item => {
		    	        				return (
		    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
		    	        				)
		    	        			})
		    	        		}
		    	        	</Select>
				        </FormItem>

				         <FormItem  {...formItemLayout} label="支付模式：" hasFeedback>
		    	        	<RadioGroup  {...radio1Props}  >
					            {
		    	        			select.payModel.map(item => {
		    	        				return (
		    	        					 <Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		    	        				)
		    	        			})
		    	        		}
				            </RadioGroup>
				        </FormItem>
			        	<div  hidden={this.state.check_pay == 1? false: true}>
					        <FormItem
					          {...formItemLayout}
					          label="商户号："
					          hasFeedback
					          >
					          <Input {...shNumberProps} size="large" type="text" />
					        </FormItem>

					        <FormItem 
					          {...formItemLayout}
					          label="最终秘钥："
					          hasFeedback
					          >
					          <Input {...zzKeyProps} size="large" type="text" />
					        </FormItem>
			        	</div>
				        <FormItem  {...formItemLayout} label="照片墙：" hasFeedback>
		    	        	<RadioGroup {...radio2Props}>
					            {
		    	        			select.photoWall.map(item => {
		    	        				return (
		    	        					 <Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		    	        				)
		    	        			})
		    	        		}
				            </RadioGroup>
				        </FormItem>

				        <div  hidden={this.state.photo_wall == 1? false: true}>
					        <FormItem
					          {...formItemLayout}
					          label="照片墙关键字："
					          hasFeedback
					          >
					          <Input {...photoKeywordProps}  size="large" type="text" />
					        </FormItem>

					        <FormItem  {...formItemLayout} label="照片墙照片审核：" hasFeedback>
			    	        	<RadioGroup {...photoWallCheckProps} >
			    	        		<Radio key={0} value={0}>不开启</Radio>
			    	        		<Radio key={1} value={1}>开启</Radio>
					            </RadioGroup>
				        	</FormItem>

				        	<FormItem
					          {...formItemLayout}
					          label="照片墙关键字有效期："
					          hasFeedback
					          >
					          <Input {...photoExpiresProps}  size="large" type="text" />
					        </FormItem>

					        <FormItem
					          {...formItemLayout}
					          label="照片墙上传图片回复消息："
					          hasFeedback
					          >
					          <Input {...photoRimgProps} size="large" type="text" />
					        </FormItem>

					        <FormItem
					          {...formItemLayout}
					          label="照片墙上传描述回复消息："
					          hasFeedback
					          >
					          <Input {...photoRtextProps} size="large" type="text" />
					        </FormItem>
			        	</div>

				         <FormItem  {...formItemLayout} label="照片打印：" hasFeedback>
		    	        	<RadioGroup {...radio3Props}>
					            {
		    	        			select.photoPrintType.map(item => {
		    	        				return (
		    	        					 <Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		    	        				)
		    	        			})
		    	        		}
				            </RadioGroup>
				        </FormItem>

				        <FormItem  {...formItemLayout} label="客户服务：" hasFeedback>
		    	        	<RadioGroup {...radio4Props} >
					            {
		    	        			select.customerService.map(item => {
		    	        				return (
		    	        					 <Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		    	        				)
		    	        			})
		    	        		}
				            </RadioGroup>
				        </FormItem>

				         <div  hidden={this.state.customer_service == 1? false: true}>
				         	<FormItem
					          {...formItemLayout}
					          label="客服关键字："
					          hasFeedback
					          >
					          <Input {...serviceKeywordProps} size="large" type="text" />
					        </FormItem>

					        <FormItem
					          {...formItemLayout}
					          label="未有客服在线提示信息："
					          hasFeedback
					          >
					          <Input {...servicePromptProps} size="large" type="text" />
					        </FormItem>
				         </div>

				         <FormItem
	       		          {...formItemLayout}
	       		          label="上传公众号头像："
	       		          hasFeedback
	       		          >
	       		            <Upload {...fileProps}>
								<Icon type="plus" />
								<div className="ant-upload-text">头像</div>
							</Upload>
	       		        </FormItem>
	       		       
				        
				        <FormItem  {...formItemLayout}>
				        	<Col offset="8">
		        	        	<Button type="primary" style={{width: 100}} onClick={::this.handleSubmit}>确定</Button>
		        	        	<Button type="ghost" style={{width: 100, marginLeft: 20}} onClick={() => { history.back() }}>返回</Button>
		        			</Col>
				        </FormItem>
					</Form>
				</Spin>
			)
		}
	}
}


 