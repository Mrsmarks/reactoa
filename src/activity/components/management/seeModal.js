import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'



import Select from 'antd/lib/select'




import DatePicker from 'antd/lib/date-picker'
import TimePicker from 'antd/lib/time-picker'
import Modal from 'antd/lib/modal'

import format from 'Application/utils/formatDate'

import safeString from 'safeString'
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
		this.props.toggle(undefined, 'visible_3')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
	}

	renderForm() {

		const { getFieldProps } = this.props.form

		const select = this.props.editSelect
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
				{ required: true, message: '请输入活动名称' }
			],
			initialValue: info.name
		})

		const typeProps = getFieldProps('type', {
			rules: [
				{ required: true, message: '请选择活动类型' }
			],
			initialValue: safeString(info.type)
		})

		const ruleProps = getFieldProps('rule', {
			rules: [
				{ required: true, message: '请选择活动规则' }
			],
			initialValue: safeString(info.rule)
		})

		const dateProps = getFieldProps('date', {
			rules: [
				{ required: true, type:'date', message: '请选择活动结束日期' }
			],
			initialValue: new Date(info.end_time)

		})

		const timeProps = getFieldProps('time', {
			rules: [
				{ required: true, type:'date', message: '请选择活动结束时间' }
			],
			initialValue: new Date(info.end_time)

		})

		const detailProps = getFieldProps('detail', {
			rules: [
				{ required: true, message: '请输入活动明细' }
			],
			initialValue: info.detail
		})

		return(
			<Form horizontal >
		        <FormItem
		          {...formItemLayout}
		          label="活动名称："
		          disabled
		          >
		          <Input {...nameProps} readOnly/>
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label="活动类型："
		          >
		           <Select {...typeProps} readOnly>
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
		          >
		          <Select {...ruleProps} readOnly>
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
		          >
		         <DatePicker {...dateProps} readOnly/>
		         <TimePicker {...timeProps} style={{marginLeft: 10}} readOnly/>
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label="活动明细："
		          disabled
		          >
		          <Input {...detailProps} type="textarea" rows="6" readOnly/>
		        </FormItem>
			</Form>
		)
	}

	render() {
		return(
			<Modal 
				title={'查看'}
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