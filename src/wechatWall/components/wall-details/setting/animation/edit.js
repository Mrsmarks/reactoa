import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'


import Select from 'antd/lib/select'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'
import Spin from 'antd/lib/spin'
import Auth from 'Application/components/auth'
import Radio from 'antd/lib/radio'
import IconFont from 'Application/components/iconFont'
import Popover from 'antd/lib/popover'
import Table from 'antd/lib/table'
import Slider from 'antd/lib/slider'
import ColorPicker from 'react-colors-picker'
import image404 from 'Application/resources/404.png'
import styles from '../../screen-ctrl/virtualRole/index.scss'
import 'react-colors-picker/assets/index.css'
import safeString from 'safeString'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

@Form.create()
export default class EditComp extends React.Component {
	constructor(props, context) {
    	super(props, context)
    	this.state = {
    		msg_color: '',
    		text_color:'',
			popover1: false,
			popover2: false,
			support_img:'',
			s_bump: '',
			bg_bump: '',
			ms_bump:'',
			head_bump:'',
			logo_bump:'',
			qr_bump:'',
			supportList: [],
			ready: false
    	}
  	}

  	static propTypes = {
  		// select: PropTypes.instanceOf(Immutable.Map).isRequired
  	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	} 

	componentWillReceiveProps(nextProps) {
		const info = nextProps.info.toJS()
		if(!this.state.ready && Object.keys(info).length) {
			info.sponsor.forEach(item => {
				item['key'] = Math.random().toString(32).substr(2, 8)
			})
			this.setState({
				msg_color: info.msg_frame_color,
				text_color: info.text_color,
				support_img: info.support_img,
				s_bump: info.thumb,
				bg_bump: info.bgimg,
				ms_bump: info.msg_frame,
				head_bump: info.head_frame,
				logo_bump: info.logo,
				qr_bump: info.qr_code,
				supportList: info.sponsor,
				ready: true	
			})
		}
	}

	handleSubmit() {
		const sponsor_image = []
		const sponsor_name = []
		const id = this.context.location.query.id
		this.props.form.validateFields((errors, values) => {
			values.thumb = this.state.s_bump
			values.bgimg = this.state.bg_bump
			values.msg_frame = this.state.ms_bump
			values.head_frame = this.state.head_bump
			values.logo = this.state.logo_bump
			values.qr_code = this.state.qr_bump
			values.msg_frame_color = this.state.msg_color
			values.text_color = this.state.text_color
			this.state.supportList.forEach(item => {
				sponsor_name.push(item.name)
				values.sponsor_name = sponsor_name.join()
				sponsor_image.push(item.image)
				values.sponsor_image = sponsor_image.join()
			})
			this.props.actions.updateTemplateList('update', values, id).then(resolve => {
				message.success(resolve.errormsg)
	      		this.context.router.push('/wall/activity-setting/template')
			})
		})
	}

	removeSupport(key) {
		const supportList = this.state.supportList.filter(item => 
			item.key != key
		)
		this.setState({
			supportList: supportList
		})
		
	}

	uploadFile(type, file) {
		this.props.actions.uploadFile(file).then(resolve => {
			message.success('图片上传成功！')
			this.setState({
				[type]: resolve.result.file_url
			})
		})
	}


	handlePopover(popover) {
		this.setState({
			[popover]: !this.state[popover]
		})
	}


  	changeHandler(type, obj) {
  		this.setState({
  			[type]: obj.color
  		})
	}

	addSupport() {
		const { setFieldsValue, getFieldsValue }  = this.props.form
		const values = getFieldsValue()
		const name = values.support_name
		const key = Math.random().toString(32).substr(2, 8)
		const image = this.state.support_img
		const supportList = this.state.supportList
		supportList.push({ name, image, key })
		setFieldsValue({'support_name': ''})
		this.setState({
			popover1: false,
			support_img: '',
			supportList: supportList
		})
	}

	renderSupportTable() {
		if(Object.keys(this.props.info).length && this.state.ready) {
			const dataSource = this.state.supportList		
			const assetsUrl = this.props.assetsUrl 
			const removeSupport = key => _ => {
				return this.removeSupport(key)
			}
			const columns = [{
				title: '赞助商名称',
				dataIndex: 'name',
				key: 'name',
			}, {
				title: 'logo',
				dataIndex: 'image',
				key: 'image',
				render(url) {
					return(
						<img className='head-img'src={url? assetsUrl + url: image404}/>
					)
				}
			}, {
				title: '操作',
				key: 'operation',
				render(_, obj) {
					return(
						<a onClick={removeSupport(obj.key)}>删除</a>
					)
				}
			}]
			return(
				<div>
			 		<div onClick={this.handlePopover.bind(this, 'popover2')} className={styles['icon-close']}><IconFont type="icon-close"/></div>
					<Table
						dataSource = {dataSource}
						style={{width: 400,marginTop: 10}}
						columns={columns}
						pagination={false}
					/>
				</div>
			)
		}
	}

	render() {
		const { getFieldProps } = this.props.form
		const option = this.props.option.toJS()
		const info = this.props.info.toJS()
		/*验证开始*/
		const fileProps1 = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this, 'support_img'),
			fileList: this.state.support_img ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.support_img
			}] : []
		}

		const file1Props = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this, 's_bump'),
			fileList: this.state.s_bump ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.s_bump
			}] : []
		}

		const file2Props = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this, 'bg_bump'),
			fileList: this.state.bg_bump ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.bg_bump
			}] : []
		}

		const file3Props = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this, 'ms_bump'),
			fileList: this.state.ms_bump ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.ms_bump
			}] : []
		}

		const file4Props = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this, 'head_bump'),
			fileList: this.state.head_bump ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.head_bump
			}] : []
		}

		const file5Props = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this, 'logo_bump'),
			fileList: this.state.logo_bump ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.logo_bump
			}] : []
		}

		const file6Props = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this, 'qr_bump'),
			fileList: this.state.qr_bump ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.qr_bump
			}] : []
		}

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入模板名称' }
			],
			initialValue: info.name
		})

		const lidProps = getFieldProps('lid', {
			rules: [
				{ required: true, message: '请选择布局类型' }
			],
			initialValue: info.lid+''
		})

		const titleProps = getFieldProps('title', {
			rules: [
				{ required: true, message: '请输入模板标题' }
			],
			initialValue: info.title
		})

		const stidProps = getFieldProps('stid', {
			rules: [
				{ required: true, message: '请选择主题类型' }
			],
			initialValue: info.stid+''
		})

		const sponsorLayoutProps = getFieldProps('sponsor_layout', {
			rules: [
				{ required: true, message: '请选择赞助商布局' }
			],
			initialValue: info.sponsor_layout+''
		})

		const headFrameProps = getFieldProps('head_frame_type', {
			rules: [
				{ required: true, message: '请选择头像框类型' }
			],
			initialValue:info.head_frame_type+''
		})

		const msgFrameProps = getFieldProps('msg_frame_type', {
			rules: [
				{ required: true, message: '请选择消息框类型' }
			],
			initialValue: info.msg_frame_type+''
		})

		const flipTypeProps = getFieldProps('flip_type', {
			rules: [
				{ required: true, message: '翻页效果类型' }
			],
			initialValue: info.flip_type+''
		})

		const msgNumProps = getFieldProps('msg_num', {
			rules: [
				{ required: true, message: '请选择消息条目数' }
			],
			initialValue: info.msg_num+''
		})

		const explainProps = getFieldProps('screen_explain', {
			initialValue: info.screen_explain
		})

		const qrDescProps = getFieldProps('qr_code_desc', {
			initialValue: info.qr_code_desc
		})

		const clarityProps= getFieldProps('msg_frame_clarity', {
			initialValue: info.msg_frame_clarity ? +info.msg_frame_clarity : 0
		})

		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 12 }
		}

		const fileProps = {
		  listType: 'picture-card',
		  fileList: [],
		}

		const createSupport = (
			<div>
		 		<div onClick={this.handlePopover.bind(this, 'popover1')} className={styles['icon-close']}><IconFont type="icon-close"/></div>
			 	<Form  horizontal style={{width: 400,marginTop: 10}}>
			 		<FormItem 
			 		  labelCol={{ span: 6 }}
     				  wrapperCol={{ span: 14 }}
			 		  label="赞助商名称："
			 		  required
			 		  >
			 			<Input {...getFieldProps('support_name')}/>
			 		</FormItem>

			 		<FormItem
			          labelCol={{ span: 6 }}
     				  wrapperCol={{ span: 14 }}
			          label="上传图片："
			          hasFeedback
			          required
			          >
			            <Upload {...fileProps1}>
							<Icon type="plus" />
						</Upload>
			        </FormItem>
			        <div style={{textAlign: 'right'}}>
			        	<Button type="primary" onClick={::this.addSupport}>添加</Button>
			        </div>
			 	</Form>
		 	</div>
		)

		return (
			<div>
				<Form horizontal style={{ marginTop: 40 }}>
					<FormItem
			          {...formItemLayout}
			          label="模板名称："
			          hasFeedback
			          >
			          <Input {...nameProps}/>
			       </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="布局类型："
			          hasFeedback
			          >
			          <Select {...lidProps} label="所选择布局类型：" hasFeedback>
				          {
				          		option.templateLayout.map(item => {
				          			return(
				          				<Option key={item.id} value={item.id+''}>{item.name}</Option>
				          			)
				          		})
				          }
			          </Select>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="标题："
			          hasFeedback
			          >
			          <Input {...titleProps}/>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="主题类型：" hasFeedback>
	    	        	<Select {...stidProps} placeholder="请选择主题类型：" >
	    	        		 {
				          		option.templateStyleType.map(item => {
				          			return(
				          				<Option key={item.id} value={item.id+''}>{item.name}</Option>
				          			)
				          		})
			         		 }
	    	        	</Select>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="缩略图：" hasFeedback>
    	        		<Upload {...file1Props} >
		                  <Icon type="plus" />
	                	</Upload>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="背景图：" hasFeedback>
    	        		<Upload  {...file2Props}>
		                  <Icon type="plus" />
	                	</Upload>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="消息框图片：" hasFeedback>
    	        		<Upload {...file3Props} >
		                  <Icon type="plus" />
	                	</Upload>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="头像框图片：" hasFeedback>
    	        		<Upload {...file4Props} >
		                  <Icon type="plus" />
	                	</Upload>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="log：" hasFeedback>
    	        		<Upload  {...file5Props}>
		                  <Icon type="plus" />
	                	</Upload>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="二维码图片：" hasFeedback>
    	        		<Upload  {...file6Props}>
		                  <Icon type="plus" />
	                	</Upload>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="赞助商布局：" hasFeedback>
    	        		<RadioGroup {...sponsorLayoutProps}>
					        {
					        	option.alignList.map(item => {
					        		return(
					        			<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
					        		)
					        	})
					        }
					    </RadioGroup>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="赞助商：" hasFeedback>
	    	        	<Popover 
	    	        		content={createSupport}
	    	        		visible={this.state.popover1} 
				   	 		placement="bottomLeft" 
				   	 		trigger="click" 
				   	 		onClick={this.handlePopover.bind(this, 'popover1')}
	    	        	>
	    	        		<a >添加</a>
	    	        	</Popover>
	    	        	<span style={{marginLeft: 5}}></span>
	    	        	<Popover
	    	        		content={this.renderSupportTable()}
	    	        		visible={this.state.popover2} 
				   	 		placement="bottomLeft" 
				   	 		trigger="click" 
				   	 		onClick={this.handlePopover.bind(this, 'popover2')}
				   	 	>
	    	        		<a >查看</a>
	    	        	</Popover>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="头像框类型：" hasFeedback>
	    	        	<Select  {...headFrameProps} size="large" placeholder="请选择头像框类型" >
	    	        		{
				          		option.headFram.map(item => {
				          			return(
				          				<Option key={item.id} value={item.id+''}>{item.name}</Option>
				          			)
				          		})
			         		 }
	    	        	</Select>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="消息框类型：" hasFeedback>
	    	        	<Select  {...msgFrameProps} size="large" placeholder="请选择消息框类型" >
	    	        		{
				          		option.msgFram.map(item => {
				          			return(
				          				<Option key={item.id} value={item.id+''}>{item.name}</Option>
				          			)
				          		})
			         		 }
	    	        	</Select>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="翻页效果类型：" hasFeedback>
	    	        	<Select  {...flipTypeProps} size="large" placeholder="请选择翻页效果类型" >
	    	        		{
				          		option.flipType.map(item => {
				          			return(
				          				<Option key={item.id} value={item.id+''}>{item.name}</Option>
				          			)
				          		})
			         		 }
	    	        	</Select>
			        </FormItem>

			        <FormItem  {...formItemLayout} label="消息条目数：" hasFeedback>
	    	        	<Select  {...msgNumProps} size="large" placeholder="请选择翻页效果类型" >
	    	        		{
				          		option.numList.map(item => {
				          			return(
				          				<Option key={item.id} value={item.id+''}>{item.name}</Option>
				          			)
				          		})
			         		 }
	    	        	</Select>
			        </FormItem>

			         <FormItem  {...formItemLayout} label="消息框透明度：" hasFeedback>
	    	        	<Slider {...clarityProps} style={{wdith:350}}/>
			        </FormItem>


			        <FormItem
			          {...formItemLayout}
			          label="消息框颜色："
			          hasFeedback
			          >
			           
			          <Input value={this.state.msg_color} placeholder="点击拾取颜色按钮选择颜色"/>
			          <ColorPicker
						      animation="slide-up"
						      color={this.state.msg_color? this.state.msg_color:'#17bdd4'}
						      onChange={this.changeHandler.bind(this, 'msg_color')}
						      trigger={<Button type="primary" size="small"><Icon type="edit"/>拾取颜色</Button>}
					    />
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="文本颜色："
			          hasFeedback
			          >
			           
			          <Input value={this.state.text_color} placeholder="点击拾取颜色按钮选择颜色"/>
			          <ColorPicker
						      animation="slide-up"
						      color={this.state.text_color? this.state.text_color:'#17bdd4'}
						      onChange={this.changeHandler.bind(this, 'text_color')}
						      trigger={<Button type="primary" size="small"><Icon type="edit"/>拾取颜色</Button>}
					    />
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="二维码说明："
			          hasFeedback
			          >
			          <Input {...qrDescProps} type="textarea" rows="6"/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="大屏说明："
			          hasFeedback
			          >
			          <Input {...explainProps} type="textarea" rows="6"/>
			        </FormItem>

			        
			        <FormItem  {...formItemLayout}>
			        	<Col offset="9">
	        	        	<Button type="primary" size="large" onClick={::this.handleSubmit}>确定</Button>
	        	        	<Button onClick={() => {history.back()}}type="ghost" size="large"  style={{ marginLeft: 40 }}>返回</Button>
	        			</Col>
			        </FormItem>
				</Form>
			</div>
		)
	}
}


 