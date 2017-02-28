import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import Spin from 'antd/lib/spin'
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
    	this.state={
    		ready: false,
    		check_pay: '',
    		photo_wall:'',
    		customer_service: '',
    		img_url: '',
    		info: {}    	}
  	}

  	static propTypes = {
  		select: PropTypes.instanceOf(Immutable.Map).isRequired,
  		info: PropTypes.instanceOf(Immutable.Map).isRequired
  	}

  	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	componentWillReceiveProps(nextProps) {
		const info = nextProps.info.toJS()
		const id = this.context.location.query.id
		if(!this.state.ready && info.id == id) {
			this.setState({
				img_url: info.head_img,
				check_pay: info.pay_mode,
				photo_wall: info.photo_wall,
				customer_service: info.customer_service,
				ready: true	
			})
		}
	}

  	handleSubmit(e) {
  		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	values.id = this.context.location.query.id
	  		values.head_img = this.state.img_url
	      	values.pay_mode = this.state.check_pay
	      	values.customer_service = this.state.customer_service
	      	values.photo_wall = this.state.photo_wall
	      	this.props.actions.updatePublicList(values, values.id).then(reslove => {
	      		message.success(reslove.errormsg)
	      		this.context.router.push('/wechat/public/list')
	      		this.props.form.resetFields()
	      	})
    	})
  	}

  	onChangePay(e) {
  		e.preventDefault()
  		const value = e.target.value
  		this.setState({
  			check_pay: value
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

  	handleReset(e) {
  	    e.preventDefault();
  	    this.props.form.resetFields()
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
		const info = this.props.info.toJS()
		const { getFieldProps } = this.props.form
		/*验证开始*/
		const publicNumberProps = getFieldProps('nick_name', {
			rules: [
		       { required: true, message: '请输入公众号昵称' },
			],
			initialValue: info.nick_name
		})

		const originIdProps = getFieldProps('original_id', {
			rules: [
		       { required: true, message: '请输入oId' },
			],
			initialValue: info.original_id
		})

		const appIdProps = getFieldProps('appId', {
			rules: [
		       { required: true, message: '请输入appId' },
			],
			initialValue: info.appId
		})

		const secretProps = getFieldProps('appSecret', {
			rules: [
				{ required: true, message: '请输入appSecret' },
			],
			initialValue: info.appSecret
		})

		const tokenProps = getFieldProps('token', {
			initialValue: info.token
		})

		const apiProps = getFieldProps('api_key', {
			initialValue: info.api_key
		})

		const wechatProps = getFieldProps('wechat_account', {
			rules: [
			   { required: true, message: '请输入微信号' },
			],
			initialValue: info.wechat_account
		})

		const shNumberProps = getFieldProps('mch_id', {
			initialValue: info.mch_id
		})

		const zzKeyProps = getFieldProps('pay_key', {
			initialValue: info.pay_key
		})

		const select1Props = getFieldProps('auth_status', {
			rules: [
				        { required: true,  message: '请选择授权状态' }
				],
		     initialValue: info.auth_status + ''
		})

		const select2Props = getFieldProps('service_type_info', {
			rules: [
				        { required: true,  message: '请选择公众号类型' }
				],
		     initialValue: info.service_type_info + ''
		})

		const select3Props = getFieldProps('verify_type_info', {
			rules: [
				        { required: true,  message: '请选择认证类型' }
				],
		    initialValue: info.verify_type_info + ''
		})

		const radio1Props = getFieldProps('pay_mode', {
			rules: [
				        { required: true,  message: '请选择支付模式' }
			],
			initialValue: info.pay_mode+''
		})

		const radio2Props = getFieldProps('photo_wall', {
			rules: [
				        { required: true,  message: '请选择是否开启照片墙' }
			],
			initialValue: info.photo_wall+''
		})

		const radio3Props = getFieldProps('photo_print', {
			rules: [
				        { required: true, message: '请选择是否开启照片打印' }
				],
			initialValue: info.photo_print+''
		})

		const radio4Props = getFieldProps('customer_service', {
			rules: [
				        { required: true,  message: '请选择是否开启客服服务' }
				],
			initialValue: info.customer_service+''
		})

		const photoKeywordProps = getFieldProps('photo_wall_keyword', {
			initialValue: info.photo_wall_keyword
		})

		const photoWallCheckProps = getFieldProps('photo_wall_check', {
			initialValue: info.photo_wall_check
		})

		const photoExpiresProps = getFieldProps('photo_wall_keyword_expires', {
			initialValue: info.photo_wall_keyword_expires
		})

		const photoRimgProps = getFieldProps('photo_wall_image_rmsg', {
			initialValue: info.photo_wall_image_rmsg
		})

		const photoRtextProps = getFieldProps('photo_wall_text_rmsg', {
			initialValue: info.photo_wall_text_rmsg
		})

		const serviceKeywordProps = getFieldProps('customer_service_keyword', {
			initialValue: info.customer_service_keyword
		})

		const servicePromptProps = getFieldProps('customer_service_prompt_message', {
			initialValue: info.customer_service_prompt_message
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
			          <Input size="large"  {...originIdProps} type="text" readOnly/>
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
			          label="token："
			          hasFeedback
			          >
			          <Input size="large" {...tokenProps} type="text" readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="接口地址："
			          hasFeedback
			          >
			          <Input size="large" {...apiProps} type="text" readOnly/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="微信号："
			          hasFeedback
			          >
			          <Input {...wechatProps} size="large" type="text" readOnly/>
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
	    	        	<RadioGroup  {...radio1Props}  value={this.state.check_pay+''} onChange={::this.onChangePay} >
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
	    	        	<RadioGroup {...radio2Props} value={this.state.photo_wall+''}  onChange={::this.onChangePhoto}>
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
	    	        	<RadioGroup {...radio4Props} value={this.state.customer_service+''} onChange={::this.onChangeService}>
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


 