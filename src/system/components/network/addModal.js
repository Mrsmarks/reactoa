import React, { PropTypes } from 'react'

import Immutable from 'immutable'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'

import Radio from 'antd/lib/radio'
import Cascader from 'antd/lib/cascader'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

@Form.create()

export default class MainModal extends React.Component{

	static propTypes = {
		user: PropTypes.instanceOf(Immutable.Map).isRequired
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			values.province = values.position[0]
			values.city = values.position[1]
			values.district = values.position[2]
			this.props.handleAdd(values)
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
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const user = this.props.user
		const departmentProps = getFieldProps('dpid', {
			rules: [
				{ required: true, message: '请选择部门' }
			]
		})

		const contactProps = getFieldProps('contact', {
			
		})

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入网点名称' }
			],
		})

		const emailProps = getFieldProps('email', {
			
		})

		const telProps = getFieldProps('tel', {
			
		})

		const positionProps = getFieldProps('position', {
			
		})

		const stateProps = getFieldProps('use_state', {
			rules: [
				{ required: true, type:'number', message: '请选择状态' }
			],
		})

		const introProps = getFieldProps('intro', {
			
		})

		return(
			<Form horizontal>
				<FormItem
					{...formItemLayout}
					label="所属部门："
					hasFeedback
				>
					<Select {...departmentProps} size="large" placeholder="请选择" style={{ width: 150 }}>
		        		{
		        			option.departmentList.map(item => {
		        				return(
		        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
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
					<Input  {...nameProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="部门联系人："
					hasFeedback
				>
					<Input  {...contactProps}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="联系人邮箱："
					hasFeedback
				>
					<Input {...emailProps} />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="联系人电话："
					hasFeedback
				>
					<Input {...telProps} />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="所在位置："
					hasFeedback
				>
				<Cascader {...positionProps} options={this.props.city} />
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="网点简介："
					hasFeedback
				>
					<Input {...introProps} type='textarea' rows="6"/>
				</FormItem>
				 <FormItem  {...formItemLayout} hasFeedback label="使用状态：">
    	        	<RadioGroup {...stateProps} >
			            {	
			            	option.userState.map(item => {
			            		return (
			            			<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
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
				title="新增"
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