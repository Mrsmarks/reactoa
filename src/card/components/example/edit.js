import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Checkbox from 'antd/lib/checkbox'
import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import Table from 'antd/lib/table'
import Popconfirm from 'antd/lib/popconfirm'
import Tag from 'antd/lib/tag'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import message from 'antd/lib/message'
import Spin from 'antd/lib/spin'
import Cascader from 'antd/lib/cascader'
import Modal from 'antd/lib/modal'
import Auth from 'Application/components/auth'
import ColorPicker from 'react-colors-picker'
import 'react-colors-picker/assets/index.css'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

@Form.create()
export default class MainModal extends React.Component{
	constructor(props, context) {
		super(props, context)
		this.state = {
			bg_img: '',
			cover_img: '',
			music: '',
			video: '',
			color: '',
			ready: false
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	componentWillReceiveProps(nextProps) {
		const info = nextProps.info.toJS()
		const id = this.context.location.query.id
		if(!this.state.ready && Object.keys(info).length > 0 && info.id == id) {
			this.setState({
				video: info.video,
				music: info.music,
				color: info.color,
				cover_img: info.cover_image,
				bg_img: info.bg_image,
				ready: true
			})
		}
	}

	changeHandler(obj) {
  		this.setState({
  			color: obj.color
  		})
  	}


	handleSumbit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			values.color = this.state.color
			values.bg_image = this.state.bg_img
			values.cover_image = this.state.cover_img
			values.music = this.state.music
			values.video = this.state.video
			this.props.actions.updateExampleList(values, this.context.location.query.id).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push('/card/example/list')
			})
		})
	}


	toggleModal(visible) {
		this.setState({
			[visible]: !this.state[visible]
		})
	}

	bgUploadFile(file) {
		this.props.actions.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				bg_img:resolve.result.file_url
			})
		})
	}

	coverUploadFile(file) {
		this.props.actions.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				cover_img:resolve.result.file_url
			})
		})
	}

	musicUploadFile(file) {
		this.props.actions.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				music:resolve.result.file_url
			})
		})
	}

	videoUploadFile(file) {
		this.props.actions.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				video:resolve.result.file_url
			})
		})
	}


	renderForm() {
		const { getFieldProps } = this.props.form
		const info = this.props.info.toJS()
		const option = this.props.options.toJS()
		const formItemLayout = {
		    labelCol: { span: 4 },
		    wrapperCol: { span: 12 }
		}

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称' }
			],
			initialValue: info.name
		})

		const typeProps = getFieldProps('type', {
			rules: [
				{ required: true, message: '请选择类型' }
			],
			initialValue: info.type
		})

		const introProps = getFieldProps('intro', {
			rules: [
				{ required: true, message: '请输入简介' }
			],
			initialValue: info.intro

		})

		const heightProps = getFieldProps('height', {
			rules: [
				{required: true, message: '请输入高度'}
			],
			initialValue: info.height

		})

		const widthProps = getFieldProps('width', {
			rules: [
				{required: true, message: '请输入宽度'}
			],
			initialValue: info.width

		})

		const topProps = getFieldProps('top', {
			rules: [
				{required: true, message: '请输入top值'}
			],
			initialValue: info.top

		})

		const leftProps = getFieldProps('left', {
			rules: [
				{required: true, message: '请输入left值'}
			],
			initialValue: info.left

		})

		const sizeProps = getFieldProps('size', {
			rules: [
				{required: true, message: '请输入字体大小'}
			],
			initialValue: info.size

		})

		const tidProps = getFieldProps('tid', {
			rule: [
				{required: true, message: '请选择模板'}
			],
			initialValue: info.tid

		})


		const toggleModal = visible => _ => {
			return this.toggleModal(visible)
		}

		const bgUploadProps = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.bgUploadFile.bind(this),
			fileList: this.state.bg_img ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.bg_img
			}] : []
		}

		const coverUploadProps = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.coverUploadFile.bind(this),
			fileList: this.state.cover_img ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.cover_img
			}] : []
		}
		const musicUploadProps = {
			beforeUpload: this.musicUploadFile.bind(this)
		}

		const videoUploadProps = {
			beforeUpload: this.videoUploadFile.bind(this)
		}

		return(
			<Form horizontal style={{marginTop: 30}}>
		        <FormItem  {...formItemLayout} label="名称：" hasFeedback>
    	        	<Input {...nameProps}/>
	        	</FormItem>

	        	 <FormItem  {...formItemLayout} label="类型：" hasFeedback>
	        	 	<Select {...typeProps} placeholder="请选择类型">
	        	 		{
	        	 			option.CardsType.map(item => {
	        	 				return (
	        	 					<Option key={item.value} value={item.value+''}>{item.label}</Option>
	        	 				)
	        	 			})
	        	 		}
	        	 	</Select>
	        	</FormItem>

	       		<FormItem  {...formItemLayout} label="上传背景图：" hasFeedback>
	        	 	<Upload {...bgUploadProps}>
			          	<Icon type="plus" />
			          	<div className="ant-upload-text">背景图片</div>
			         </Upload>
	        	</FormItem>

	        	<FormItem  {...formItemLayout} label="上传封面图：" hasFeedback>
	        	 	 <Upload {...coverUploadProps}>
			          	<Icon type="plus" />
			          	<div className="ant-upload-text">封面图片</div>
			         </Upload>
	        	</FormItem>

				<FormItem  {...formItemLayout} label="上传音乐文件：" hasFeedback>
	        	 	 <Upload {...musicUploadProps} showUploadList={false}>
	                  <Button type="primary" loading={this.props.fileLoading}>
	                    <Icon type="upload" /> 点击上传
	                  </Button>
		            </Upload>
	        	</FormItem>

	        	<FormItem  {...formItemLayout} label="音乐文件路径：" hasFeedback>
	        	 	 <Input value={this.state.music} readOnly/>
	        	</FormItem>

	        	<FormItem  {...formItemLayout} label="上传视频文件：" hasFeedback>
	        	 	 <Upload {...videoUploadProps} showUploadList={false}>
		                  <Button type="primary" loading={this.props.fileLoading}>
		                    <Icon type="upload" /> 点击上传
		                  </Button>
		            </Upload>
	        	</FormItem>

	        	<FormItem  {...formItemLayout} label="视频文件路径：" hasFeedback>
	        	 	 <Input value={this.state.video} readOnly/>
	        	</FormItem>

	        	 <FormItem  {...formItemLayout} label="文字显示区域设定：" hasFeedback>
    	        	<span>宽：</span><Input {...widthProps} style={{width: 100}}/>
    	        	<span style={{marginLeft:10}}></span>
    	        	<span>高：</span><Input {...heightProps} style={{width: 100}}/>
	        	</FormItem>

	        	 <FormItem  {...formItemLayout} label="文字显示位置设定：" hasFeedback>
    	        	<span>top：</span><Input {...topProps} style={{width: 100}}/>
    	        	<span style={{marginLeft: 10}}></span>
    	        	<span>left：</span><Input {...leftProps} style={{width: 100}}/>
	        	</FormItem>

	        	<FormItem  {...formItemLayout} label="文字大小设定：" hasFeedback>
    	        	<Input {...sizeProps} style={{width: 100}}/><span> px</span>
	        	</FormItem>

	        	<FormItem
		          {...formItemLayout}
		          label="奖品颜色："
		          hasFeedback
		          >
		           
		          <Input value={this.state.color} placeholder="点击拾取颜色按钮选择颜色" readyOnly/>
		          <ColorPicker
					      animation="slide-up"
					      color={this.state.color? this.state.color:'#17bdd4'}
					      onChange={::this.changeHandler}
					      trigger={<Button type="primary" size="small"><Icon type="edit"/>拾取颜色</Button>}
				    />
		        </FormItem>

		         <FormItem  {...formItemLayout} label="模板：" hasFeedback>
		         	<Select {...tidProps} placeholder="请选择模板">
		         		{
		         			option.CardsTemplate.map(item => {
		         				return (
		         					<Option key={item.id} value={item.id+''}>{item.name}</Option>
		         				)
		         			})
		         		}
		         	</Select>
	        	</FormItem>

	        	<FormItem  {...formItemLayout} label="简介：" hasFeedback>
    	        	<Input {...introProps} type="textarea" rows="6"/>
	        	</FormItem>

	        	<FormItem  {...formItemLayout}>
		        	<Col offset="10">
		        	<Auth type={['cards-example-update']}>
        	        	<Button type="primary" onClick={::this.handleSumbit} size="large" >确定</Button>
        	        </Auth>
        	        	<Button type="ghost" size="large" onClick={() => {history.back()}} style={{ marginLeft: 40 }}>返回</Button>
        			</Col>
			    </FormItem>
			</Form>
		)
	}
	render() {
		return (
			<div>
				{this.renderForm()}
			</div>
		)
	}
}