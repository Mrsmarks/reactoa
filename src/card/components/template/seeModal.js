import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Upload from 'antd/lib/upload'
import format from 'Application/utils/formatDate'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			img_url: ''
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_3')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
		if(!this.props.visible && Object.keys(nextProps.info).length > 0) {
			this.setState({
				img_url: nextProps.info.cover_image
			})
		}
	}


	renderForm() {

		const { getFieldProps } = this.props.form
		const select = this.props.select
		const info = this.props.info
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}
		
		const fileProps = {
			accept: 'image/*',
			listType: 'picture-card',
			fileList: this.state.img_url ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.img_url
			}] : []
		}

		return(
			<Form horizontal>
		        <FormItem
		          {...formItemLayout}
		          label="名称："
		          hasFeedback
		          >
		           <Input value={info.name} readOnly/>
		        </FormItem>

		        <FormItem  {...formItemLayout} label="类型：" hasFeedback>
	        	 	<Select value={+info.type} placeholder="请选择模板类型" readOnly>
	        	 		{
	        	 			select.map(item => {
	        	 				return (
	        	 					<Option key={item.id} value={+item.id+''}>{item.name}</Option>
	        	 				)
	        	 			})
	        	 		}
	        	 	</Select>
	        	</FormItem>
	        	
	        	 <FormItem
		          {...formItemLayout}
		          label="封面图："
		          hasFeedback
		          >
		          	<Upload {...fileProps}>
						<Icon type="plus" />
					</Upload>
		        </FormItem>

		         <FormItem
		          {...formItemLayout}
		          label="地址："
		          hasFeedback
		          >
		           <Input value={info.url} readOnly/>
		        </FormItem>

		         <FormItem
		          {...formItemLayout}
		          label="简介："
		          hasFeedback
		          >
		           <Input value={info.intro} type="textarea" rows="6" readOnly/>
		        </FormItem>


			</Form>
		)
	}

	render() {
		return(
			<Modal 
				title="查看"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				confirmLoading={this.props.updateLoading}
				onOk={::this.handleCancel}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}