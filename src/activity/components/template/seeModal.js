import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'



import Select from 'antd/lib/select'





import TimePicker from 'antd/lib/time-picker'
import Modal from 'antd/lib/modal'

import format from 'Application/utils/formatDate'


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
		
		return(
			<Form horizontal >
		        <FormItem
		          {...formItemLayout}
		          label="活动类型："
		          hasFeedback
		          >
		           <Select value={info.type} readOnly>
		           	 	{
		           	 		select.map(item => {
		           	 			return (
		           	 				<Option key={item.id} value={item.id+''}>{item.name}</Option>
		           	 			)
		           	 		})
		           	 	}
		           </Select>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="名称："
		          disabled
		          hasFeedback
		          >
		          <Input value={info.name} readOnly/>
		        </FormItem>

	        	<FormItem
		          {...formItemLayout}
		          label="地址："
		          disabled
		          hasFeedback
		          >
		          <Input value={info.url} readOnly/>
		        </FormItem>

		        <div hidden={!info.cover_image}>
			        <FormItem
			          {...formItemLayout}
			          label="封面图片："
			          disabled
			          hasFeedback
			          >
			          <img className='head-img' src={info.cover_image? this.props.assetsUrl + info.cover_image: ''}/>
		        	</FormItem>
		        </div>
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