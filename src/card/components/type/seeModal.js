import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Upload from 'antd/lib/upload'
import format from 'Application/utils/formatDate'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'

const FormItem = Form.Item


@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_3')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
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


		return(
			<Form horizontal>
		        <FormItem
		          {...formItemLayout}
		          label="名称："
		          hasFeedback
		          >
		           <Input value={info.name} readOnly/>
		        </FormItem>

	        	<div hidden={!info.cover_image}>
		        	<FormItem
			          {...formItemLayout}
			          label="封面图："
			          hasFeedback
			          >
			           <img className='head-img' src={info.cover_image? this.props.assetsUrl + info.cover_image: this.props.img}/>
			        </FormItem>
				</div>
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
				onOk={::this.handleCancel}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}