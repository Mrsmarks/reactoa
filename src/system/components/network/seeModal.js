import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'

import Radio from 'antd/lib/radio'


const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

@Form.create()

export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_2')
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			console.log(values)
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
	}


	renderForm() {

		const { getFieldProps } = this.props.form
		const  option = this.props.option
		const info = this.props.info
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}
		const departmentProps = getFieldProps('contact', {
			
			initialValue: +this.props.info.dpid  
		})

		const contactProps = getFieldProps('contact', {
			
			initialValue: this.props.info.contact 
		})

		const nameProps = getFieldProps('name', {
			
			initialValue: this.props.info.name 

		})

		const emailProps = getFieldProps('email', {
			
			initialValue: this.props.info.email

		})

		const telProps = getFieldProps('tel', {
			
			initialValue: this.props.info.tel

		})

		const positionProps = getFieldProps('position', {
			
			initialValue: [this.props.info.province, this.props.info.city, this.props.info.district]
		})

		const stateProps = getFieldProps('use_state', {
			
			initialValue: this.props.info.use_state

		})

		const introProps = getFieldProps('intro', {
			
			initialValue: this.props.info.intro

		})

		return(
			<Form horizontal>
				<FormItem
					{...formItemLayout}
					label="所属部门："
					hasFeedback
				>
					<Select disabled={this.props.user.get('level') == 2} {...departmentProps} readOnly placeholder="请选择" style={{ width: 150 }}>
		        		{
		        			option.departmentList.map(item => {
		        				return(
		        					<Option key={item.id} value={+item.id+''}>{item.name}</Option>
		        				)
		        			})
		        		}
	    	        </Select>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="网点名称："
					hasFeedback
				>
					<Input readOnly {...nameProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="部门联系人："
					hasFeedback
				>
					<Input readOnly {...contactProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="联系人邮箱："
					hasFeedback
				>
					<Input readOnly {...emailProps} />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="联系人电话："
					hasFeedback
				>
					<Input readOnly {...telProps} />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="所在位置："
					hasFeedback
				>
					<Input {...positionProps}  readOnly />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="网点简介："
					hasFeedback
				>
					<Input readOnly {...introProps} type='textarea' rows="6"/>
				</FormItem>
				 <FormItem  {...formItemLayout} label="使用状态：">
    	        	<RadioGroup {...stateProps} readOnly>
			            {	
			            	option.userState.map(item => {
			            		return (
			            			<Radio key={item.id} value={+item.id+''}>{item.name}</Radio>
			            		)
			            	})
			            }
		            </RadioGroup>
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
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}