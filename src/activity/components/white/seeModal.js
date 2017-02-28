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
		const index = select.activityList.findIndex(item => item.aid == this.props.info.aid)
		const prizeList = index > -1 ? select.activityList[index].children:[]
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
		          label="所属活动："
		          disabled
		          hasFeedback
		          >
		         <Select value={this.props.info.aid+''} placeholder="请选择活动" readOnly>
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
		         <Select value={this.props.info.prize_id+''}  placeholder="请选择奖品" readOnly>
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
		          <Select value={info.type+''} readOnly>
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
		          <Input value={info.value} readOnly/>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="有效期："
		          hasFeedback
		          >
		         <DatePicker value={new Date(info.validity_period*1000)} readOnly/>
		         <TimePicker value={new Date(info.validity_period*1000)} style={{marginLeft: 10}} readOnly/>
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