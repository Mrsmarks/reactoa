import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import Table from 'antd/lib/table'
import Popconfirm from 'antd/lib/popconfirm'
import Col from 'antd/lib/col'

import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'

import AddModal from './addImgTextModal'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const Option = Select.Option


@Form.create()
export default class MainModal extends React.Component{
	constructor(props, context) {
		super(props, context)
		this.state = {
			visible: false,
			dataSource: [],
			replyType: 1,
			eventType: 3,
			img_url:''
		}
	}

	onChangeReplyType(value) {
		this.setState({
			replyType: value
		})
	}

	onChangeEventType(value) {
		this.setState({
			eventType: value
		})
	}

	setDataSource(info) {
		const dataSource = this.state.dataSource
		dataSource.unshift(info)
		this.setState({
			dataSource: dataSource,
			visible: false
		})
	}

	handleUpdate(info) {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const dataSource = this.state.dataSource
			const content_txt_title = []
			const content_txt_description = []
			const content_txt_pictrue =[]
			const content_txt_url = []
			dataSource.forEach(item => {
				content_txt_title.push(item.title)
				content_txt_description.push(item.description)
				content_txt_pictrue.push(item.img)
				content_txt_url.push(item.url)
			})
			values.content_txt_title = content_txt_title
			values.content_txt_description = content_txt_description
			values.content_txt_pictrue = content_txt_pictrue
			values.content_txt_url = content_txt_url
			values.reply_type = this.state.replyType
			values.type = this.state.eventType
			values.content_pictrue = this.state.img_url
			
			this.props.actions.addReplyList(values).then(resolve => {
				message.success(resolve.errormsg)
			})	
		})
		
	}


	toggleModal(info, visible, cb) {
		if(info) {
			if(cb) {
				cb(info)
			}
			this.setState({
				[visible]: !this.state[visible],
				info: info
			})
		}else{
			this.setState({
				[visible]: !this.state[visible],
			})
		}	
	}


	renderForm() {
		const { getFieldProps } = this.props.form
		const editSelect = this.props.editSelect.toJS()
		const toggleModal = (obj, visible, fn) => _ => {
			return this.toggleModal(obj, visible, fn)
		}
		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 12 }
		}

		const keywordProps = getFieldProps('keyword', {
			
		})

		const signProps = getFieldProps('sign', {
			
		})

		const typeProps = getFieldProps('type', {
			
		})

		const replyTypeProps = getFieldProps('reply_type', {
			
		})

		const sceneProps = getFieldProps('scene', {

		})

		const contentProps = getFieldProps('content_text', {
			
		})

		const setImgUrl = (img_url) => {
			this.setState({
		      	img_url: img_url
		      })
		}

		const fileProps = {
		  	name: 'file',
		  	action: `${this.props.assetsUrl}/upload/upload`,
		  onChange(info) {
		    if (info.file.status !== 'uploading') {
		      
		    }
		    if (info.file.status === 'done') {
		    	const img_url = info.file.response.file_url
		      message.success(`${info.file.name} 上传成功。`)
		      setImgUrl(img_url)
		      
		    } else if (info.file.status === 'error') {
		      message.error(`${info.file.name} 上传失败。`)
		    }
		  }
		}

		return(
			<Form horizontal style={{marginTop: 30}} >
			       
			        <FormItem
			          {...formItemLayout}
			          label="签到："
			          hasFeedback
			          >
			            <RadioGroup {...signProps} >
		                  	{
			            		editSelect.signType.map(item => {
			            			return (
		                  				<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
			            			)
			            		})
			            	}
			            </RadioGroup>
			        </FormItem>
			        <FormItem  {...formItemLayout} label="事件类型：">
	    	        	<Select {...typeProps} size="large" value={this.state.eventType} onChange={::this.onChangeEventType} placeholder="请选择类型：" style={{ width: 150 }}>
	    	        		{
	    	        			editSelect.evenType.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<div hidden={this.state.eventType != 2}>
		        		 <FormItem
				          {...formItemLayout}
				          label="关键字："
				          disabled
				          hasFeedback
				          >
				          <Input {...keywordProps} type="text" />
			        	</FormItem>
		        	</div>
		        	<div hidden={this.state.eventType != 4}>
		        		<FormItem  {...formItemLayout} label="场景回复：">
		    	        	<Select {...sceneProps} size="large"  placeholder="请选择类型：" style={{ width: 150 }}>
		    	        		{
		    	        			editSelect.sceneList.map(item => {
		    	        				return (
		    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
		    	        				)
		    	        			})
		    	        		}
		    	        	</Select>
		        		</FormItem>
		        	</div>
		        	<FormItem  {...formItemLayout} label="回复类型：">
	    	        	<Select {...replyTypeProps} size="large" value={this.state.replyType} onChange={::this.onChangeReplyType} placeholder="请选择类型：" style={{ width: 150 }}>
	    	        		{
	    	        			editSelect.replyType.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<div hidden={this.state.replyType != 1}>
			        	<FormItem 
				          {...formItemLayout}
				          label="文本内容："
				          hasFeedback
				          >
				          <Input {...contentProps} type="textarea" rows="6"/>
				        </FormItem>
			 		</div>
			 		<div hidden={this.state.replyType != 2}>
			        	<FormItem 
				          {...formItemLayout}
				          label="图片内容："
				          hasFeedback
				          >
				          <Upload {...fileProps}>
				         	<Button size='large' type="primary">
		    	        		<Icon type="upload" />选择文件
		    	        	</Button>
				         </Upload>
				        </FormItem>
			 		</div>
			 		<div hidden={this.state.replyType != 3}>
			        	<FormItem 
				          {...formItemLayout}
				          label="图文内容："
				          hasFeedback
				          >
				          <Button  type="primary" onClick={toggleModal(undefined, 'visible')}>
				          	<Icon type="plus" />添加图文
				          </Button>
				        </FormItem>
			 		</div>
			 		<div>
			 			{this.renderTable()}
			 		</div>
			         <FormItem  {...formItemLayout}>
				        	<Col offset="10">
		        	        	<Button style={{width: 150}} type="primary" onClick={::this.handleAdd}  size="large">提交</Button>
		        			</Col>
				     </FormItem>
				</Form>
		)
	}

	renderTable() {
		const columns = [{
			title: '标题',
			dataIndex: 'title',
			key: 'title'
		}, {
			title: '图片地址',
			dataIndex: 'img',
			key: 'img',
		}, {
			title: '链接地址',
			dataIndex: 'url',
			key: 'url',
		}, {
			title: '描述',
			dataIndex: 'description',
			key: 'description',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<a>编辑</a><span style={{marginRight: 5}}></span>
						<Popconfirm title="确定要删除吗？">
							<a>删除</a>
						</Popconfirm>
					</div>
				)
			}
		}]

		return (
			<div hidden={this.state.replyType != 3} >
				<Table 
					columns={columns}
					dataSource={this.state.dataSource}
					pagination={false}
				/>
			</div>
		)
	}
	render() {
		return (
			<div>
				{this.renderForm()}
				<AddModal
					visible={this.state.visible}
				    toggle={::this.toggleModal}
				    setDataSource={::this.setDataSource}
				/>
			</div>
		)
	}
}