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

const FormItem = Form.Item
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group

@Form.create()
export default class MainModal extends React.Component{
	constructor(props, context) {
		super(props, context)
		this.state = {
			index_visible: false,
			list_visible: false,
			greeting_visible: false,
			index_id: '',
			index_name: '',
			list_id: '',
			list_name: '',
			greeting_id: '',
			greeting_name: '',
			cover_img: '',
			water_img: ''
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	handleChangeRadio(listName, e) {
		this.setState({
			[`${listName}_id`]: e.target.value,
		})
	}

	handleOk(listName) {
		const option = this.props.option.toJS()
		option[listName].forEach(item => {
			if(item.id == this.state[`${listName}_id`]) {
				this.setState({
					[`${listName}_name`]: item.name,
					[`${listName}_visible`]: false
				})
			}
		})
	}


	handleSumbit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			values.index = this.state.index_id
			values.list = this.state.list_id
			values.greeting = this.state.greeting_id
			values.cover_image = this.state.cover_img
			values.watermark = this.state.water_img
			this.props.actions.addSettingList(values).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push('/card/setting/list')
			})
		})
	}

	renderModal(listName) {
		const option = this.props.option.toJS()

		var i = Math.ceil(option[listName].length/4)
		var array = []
		for(let n = 1; n < i + 1; n++) {
			array.push(n)
		}
		return(
			<div style={{maxHeight:350, overflow:'auto'}}>
				{
					array.map(index => {
						return (
							<Row key={index} type="flex" style={{height: 110}} justify="start">
								{
									option[listName].slice((index-1)*4, index*4).map((item, index1) => {
										if(index1 < 4*index ) {
											return (
												<Col key={index1} span={6} style={{textAlign: 'center'}}>
													 <div><img className='head-img' src={this.props.assetsUrl + item.img_url}/></div>
													 <input type="radio" onChange={(e) => {this.handleChangeRadio(listName, e)}}   key={item.id} value={item.id} name="name"/> {item.name}
												</Col>
											)
										}
									})
								}
							</Row>
						)
					})
				}
			</div>
		)
	}

	toggleModal(visible) {
		this.setState({
			[visible]: !this.state[visible]
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

	waterUploadFile(file) {
		this.props.actions.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				water_img:resolve.result.file_url
			})
		})
	}


	renderForm() {
		const { getFieldProps } = this.props.form
		const option = this.props.option.toJS()
		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 12 }
		}

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称' }
			]
		})

		const toggleModal = visible => _ => {
			return this.toggleModal(visible)
		}

			const waterUploadProps = {
				accept: 'image/*',
				listType: 'picture-card',
				beforeUpload: this.waterUploadFile.bind(this),
				fileList: this.state.water_img ? [{
					uid: -1,
					status: 'done',
					url: this.props.assetsUrl + this.state.water_img
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
				}] : [],
				onRemove: (file) => {
					this.setState({
						water_img: ''
					})
				}
			}



		return(
			<Form horizontal style={{marginTop: 30}}>
		        <FormItem  {...formItemLayout} label="名称：" hasFeedback>
    	        	<Input {...nameProps}/>
	        	</FormItem>

	        	 <FormItem  {...formItemLayout} label="首页模板：" hasFeedback>
	        	 	<Input onClick={toggleModal('index_visible')} placeholder="点击选择首页模板" value={this.state.index_name} readOnly/>
	        	</FormItem>

	        	<FormItem  {...formItemLayout} label="列表页模板：" hasFeedback>
	        	 	<Input onClick={toggleModal('list_visible')}placeholder="点击选择列表页模板" value={this.state.list_name} readOnly/>
	        	</FormItem>

	        	<FormItem  {...formItemLayout} label="祝福语页模板：" hasFeedback>
	        	 	<Input onClick={toggleModal('greeting_visible')} placeholder="点击选择祝福语页模板" value={this.state.greeting_name} readOnly/>
	        	</FormItem>

	       		<FormItem  {...formItemLayout} label="封面图：" hasFeedback>
	        	 	<Upload {...coverUploadProps}>
			          	<Icon type="plus" />
			          	<div className="ant-upload-text">封面图片</div>
			         </Upload>
	        	</FormItem>

	        	<FormItem  {...formItemLayout} label="水印图：" hasFeedback>
	        	 	<Upload {...waterUploadProps}>
			          	<Icon type="plus" />
			          	<div className="ant-upload-text">水印图片</div>
			         </Upload>
	        	</FormItem>

	        	<FormItem  {...formItemLayout} label="简介：" hasFeedback>
    	        	<Input {...getFieldProps('intro')} type="textarea" rows="6"/>
	        	</FormItem>
		        	
	        	<FormItem  {...formItemLayout}>
		        	<Col offset="6">
        	        	<Button type="primary" onClick={::this.handleSumbit} size="large" >确定</Button>
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
				<Modal
					title="首页模板"
					visible={this.state.index_visible}
					cancelText='返回'
					width={600}
					onCancel={this.toggleModal.bind(this, 'index_visible')}
					onOk={() => {this.handleOk('index')}}
				>
					{this.renderModal('index')}
				</Modal>
				<Modal
					title="列表页模板"
					visible={this.state.list_visible}
					cancelText='返回'
					width={600}
					onCancel={this.toggleModal.bind(this, 'list_visible')}
					onOk={() => {this.handleOk('list')}}
				>
					{this.renderModal('list')}
				</Modal>
				<Modal
					title="祝福语页模板"
					visible={this.state.greeting_visible}
					cancelText='返回'
					width={600}
					onCancel={this.toggleModal.bind(this, 'greeting_visible')}
					onOk={() => {this.handleOk('greeting')}}
				>
					{this.renderModal('greeting')}
				</Modal>
			</div>
		)
	}
}