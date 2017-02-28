import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'



import Select from 'antd/lib/select'




import DatePicker from 'antd/lib/date-picker'
import TimePicker from 'antd/lib/time-picker'
import Modal from 'antd/lib/modal'
import Cascader from 'antd/lib/cascader'
import format from 'Application/utils/formatDate'

const FormItem = Form.Item
const Option = Select.Option


@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			prizeList: []
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

	handleSelect(value) {
		const select = this.props.select.activityList
		this.props.form.setFieldsValue({'prize_id':''})
		const index = select.findIndex(item => item.aid == value)
		if(index > -1) {
			this.setState({
				prizeList: select[index].children
			})
		}
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const formData = {}
			const activeStartDate = format(values.date.getTime())
			const activeStartTime = format(values.time.getTime(), 'hh:mm:ss')
			formData.validity_period = activeStartDate +' '+ activeStartTime
			formData.type = values.type
			formData.value = values.value
			formData.aid = values.aid
			formData.prize_id = values.prize_id
			console.log(formData)
			this.props.handleAdd(formData)
		})
	}

	renderForm() {

		const { getFieldProps } = this.props.form

		const select = this.props.select

		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const typeProps = getFieldProps('type', {
			rules: [
				{ required: true, type:'number', message: '请选择类型' }
			]
		})

		const valueProps = getFieldProps('value', {
			rules: [
				{ required: true,  message: '请输入号码' }
			]
		})

		const dateProps = getFieldProps('date', {
			rules: [
				{ required: true, type:'date', message: '请选择有效期日期' }
			]
		})

		const timeProps = getFieldProps('time', {
			rules: [
				{ required: true, type:'date', message: '请选择有效期时间' }
			]
		})

		const activeProps = getFieldProps('aid', {
			rules: [
				{ required: true, message: '请选择活动' }
			],
			onChange: ::this.handleSelect

		})

		const prizeProps = getFieldProps('prize_id', {
			
		})
		const prizeList = this.state.prizeList
		return(
			<Form horizontal >
		         <FormItem
		          {...formItemLayout}
		          label="所属活动："
		          disabled
		          hasFeedback
		          >
		         <Select {...activeProps} placeholder="请选择活动" >
		         	{
		         		select.activityList.map(item => {
		         			return(
		         				<Option key={item.aid} value={item.aid+''}>{item.name}</Option>
		         			)
		         		})
		         	}
		         </Select>
		        </FormItem>

		         <FormItem
		          {...formItemLayout}
		          label="所属奖品："
		          disabled
		          hasFeedback
		          >
		         <Select {...prizeProps}  placeholder="请选择奖品">
		         	{
		         		prizeList.map(item => {
		         			return (
		         				<Option key={item.id} value={item.id+''}>{item.name}</Option>
		         			)
		         		})
		         	}
		         </Select>
		        </FormItem>

	        	<FormItem
		          {...formItemLayout}
		          label="类型："
		          hasFeedback
		          >
		          <Select {...typeProps} placeholder="请选择类型">
		           	 {
		           	 	select.type.map(item => {
		           	 		return (
		           	 			<Option key={item.id} value={item.id+''}>{item.name}</Option>
		           	 		)
		           	 	})
		           	 }
		          </Select>
		        </FormItem>

		         <FormItem
		          {...formItemLayout}
		          label="号码："
		          disabled
		          hasFeedback
		          >
		          <Input {...valueProps} />
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="有效期："
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
			<Modal
				title="新增"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				confirmLoading={this.props.addLoading}
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}
