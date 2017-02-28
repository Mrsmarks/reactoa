import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'
import Select from 'antd/lib/select'
import TimePicker from 'antd/lib/time-picker'
import Modal from 'antd/lib/modal'


const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
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

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入模板名称' }
			],
			initialValue: info.name 
		})

		const activityTypeProps = getFieldProps('activity_type', {
			rules: [
				{ required: true, message: '请选择活动类型' }
			],
			initialValue: info.activity_type+'' 

		})

		const screenTypeProps = getFieldProps('screen_type', {
			rules: [
				{ required: true, message: '请选择屏幕类型' }
			],
			initialValue: info.screen_type+'' 

		})

		const templateTypeProps = getFieldProps('template', {
			rules: [
				{ required: true, message: '请输入模板类型' }
			],
			initialValue: info.template

		})

		const remarkProps = getFieldProps('remark', {
			initialValue: info.remark
		})

		return(
			<Form horizontal >
		        <FormItem
		          {...formItemLayout}
		          label="模板名称："
		          disabled
		          hasFeedback
		          >
		          <Input value={info.name} readOnly/>
		        </FormItem>

		         <FormItem
		          {...formItemLayout}
		          label="活动类型："
		          disabled
		          hasFeedback
		          >
		          <Select value={info.activity_type+''} readOnly>
		          	{
		          		select.activityType.map(item => {
		          			return(
		          				<Option key={item.id} value={item.id+''}>{item.name}</Option>
		          			)
		          		})
		          	}
		          </Select>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="屏幕类型："
		          disabled
		          hasFeedback
		          >
		          <Select value={info.screen_type+''} readOnly>
		          	{
		          		select.screenType.map(item => {
		          			return(
		          				<Option key={item.id} value={item.id+''}>{item.name}</Option>
		          			)
		          		})
		          	}
		          </Select>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="模板类型："
		          disabled
		          hasFeedback
		          >
		          <Input value={info.template} readOnly />
		        </FormItem>

		       <FormItem
		          {...formItemLayout}
		          label="缩略图："
		          disabled
		          >
		          <img className='head-img'  src={info.thumb? this.props.assetsUrl + info.thumb: ''}/>
		        </FormItem>

		         <FormItem
		          {...formItemLayout}
		          label="备注："
		          disabled
		          hasFeedback
		          >
		          <Input value={info.remark} type="textarea" rows="6" readOnly/>
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