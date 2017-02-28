import React, { PropTypes } from 'react'
import  ReactDOM  from 'react-dom'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Editor from './editor'
import Simditor from 'simditor/lib/simditor'
import Select from 'antd/lib/select'
import DatePicker from 'antd/lib/date-picker'
import TimePicker from 'antd/lib/time-picker'
import Modal from 'antd/lib/modal'

import format from 'Application/utils/formatDate'


const FormItem = Form.Item

const Option = Select.Option

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			end_time: ''
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const d = format(values.date)
			const t = format(values.time, 'hh:mm:ss')
			values.end_time = d +' '+ t
			delete values.date
			delete values.time
			values.detail = Editor.getContent()
			this.props.handleAdd(values)
		})
	}

	renderForm() {

		const { getFieldProps } = this.props.form

		const select = this.props.editSelect

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
				{ required: true, message: '请输入活动名称' }
			]
		})

		const typeProps = getFieldProps('type', {
			rules: [
				{ required: true, message: '请选择活动类型' }
			]
		})

		const ruleProps = getFieldProps('rule', {
			rules: [
				{ required: true, message: '请选择活动规则' }
			]
		})

		const dateProps = getFieldProps('date', {
			rules: [
				{ required: true, type:'date', message: '请选择活动结束日期' }
			]
		})

		const timeProps = getFieldProps('time', {
			rules: [
				{ required: true, type:'date', message: '请选择活动结束时间' }
			]
		})

		return(
			<Form horizontal >
		        <FormItem
		          {...formItemLayout}
		          label="活动名称："
		          disabled
		          hasFeedback
		          >
		          <Input {...nameProps} />
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label="活动类型："
		          hasFeedback
		          >
		           <Select {...typeProps}>
		           	 {
		           	 	select.activityType.map(item => {
		           	 		return (
		           	 			<Option key={item.id} value={item.id+""} >{item.name}</Option>
		           	 		)
		           	 	})
		           	 }
		           </Select>
		        </FormItem>
	        	<FormItem
		          {...formItemLayout}
		          label="活动规则："
		          hasFeedback
		          >
		          <Select {...ruleProps}>
		           	 {
		           	 	select.actRuleList.map(item => {
		           	 		return (
		           	 			<Option key={item.id} value={item.id+""} >{item.name}</Option>
		           	 		)
		           	 	})
		           	 }
		          </Select>
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label="活动结束日期："
		          hasFeedback
		          >
		         <DatePicker {...dateProps}/>
		         <TimePicker {...timeProps} style={{marginLeft: 10}}/>
		        </FormItem>
			</Form>
		)
	}

	render() {
		return(
			<div>
				<Modal 
					title="新增"
					visible={this.props.visible}
					cancelText='返回'
					width="600px"
					onCancel={::this.handleCancel}
					confirmLoading={this.props.addLoading}
					onOk={::this.handleSubmit}
				>
					{this.renderForm()}
					<Editor/>
				</Modal>	
			</div>
		)
	}
}