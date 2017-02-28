import React, { PropTypes } from 'react'

import city from 'Application/utils/city'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Modal from 'antd/lib/modal'
import Cascader from 'antd/lib/cascader'


const FormItem = Form.Item

const Option = Select.Option


@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			if (values.position) {
				values.province = values.position[0]
				values.city = values.position[1]
			}
			
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
				{ required: true, message: '请输入规则名称' }
			]

		})

		const remarkProps = getFieldProps('remark', {
			
		})

		const menuIdProps = getFieldProps('menu_id', {
			rules: [
				{ required: true, message: '请选择菜单包类型' }
			]
		})

		const groupIdProps = getFieldProps('group_id', {
			rules: [
				{ required: true, message: '请选择微信分组' }
			]
			
		})

		const sexProps = getFieldProps('sex', {
			
		})

		const countryProps = getFieldProps('country', {
			
		})

		const positionProps = getFieldProps('position', {
			
		})

		const clientProps = getFieldProps('client_platform_type', {
			
		})

		const languageProps = getFieldProps('language', {
			
		}) 
		const select = this.props.select
		const cityList = this.props.cityList
		const fetchCityList = id => {
			this.props.fetchCityList(id)
		}

		return(
			<Form horizontal >
				<FormItem {...formItemLayout} hasFeedback label="名称：">
					<Input {...nameProps}/>
				</FormItem>
				<FormItem {...formItemLayout} hasFeedback label="备注：">
					<Input {...remarkProps} type="textarea" rows="6"/>
				</FormItem>
				<FormItem  {...formItemLayout} hasFeedback label="个性化菜单：">
    	        	<Select  {...menuIdProps} placeholder="请选择">
    	        		{
    	        			select.packageList.map(item => {
    	        				return <Option key={item.id} value={item.id+''}>{item.name}</Option>
    	        			})
    	        		}
    	        	</Select>
		        </FormItem>
		        <FormItem  {...formItemLayout} hasFeedback label="微信分组：">
    	        	<Select  {...groupIdProps} placeholder="请选择">
    	        		{
    	        			select.weixinGroup.map(item => {
    	        				return <Option key={item.group_id} value={item.group_id+''}>{item.name}</Option>
    	        			})
    	        		}
    	        	</Select>
		        </FormItem>
				<FormItem  {...formItemLayout} hasFeedback label="性别：">
    	        	<Select  {...sexProps} placeholder="请选择">
    	        		<Option key={0} value=''>未选择</Option>
    	        		{
    	        			select.sexList.map(item => {
    	        				return <Option key={item.id} value={item.id+''}>{item.name}</Option>
    	        			})
    	        		}
    	        	</Select>
		        </FormItem>
		        <FormItem  {...formItemLayout} hasFeedback label="国家：">
    	        	<Select  {...countryProps} placeholder="请选择">
    	        		<Option key={0} value=''>未选择</Option>
    	        		<Option key={1} value='中国'>中国</Option>
    	        	</Select>
		        </FormItem>
		         <FormItem {...formItemLayout} hasFeedback label="位置：">
		        	<Cascader {...positionProps} options={city}/>
		        </FormItem>
		        <FormItem  {...formItemLayout} hasFeedback label="客户端类别：">
    	        	<Select  {...clientProps} placeholder="请选择">
    	        		<Option key={0} value=''>未选择</Option>
    	        		{
    	        			select.clientType.map(item => {
    	        				return <Option  key={item.id} value={item.id+''}>{item.name}</Option>
    	        			})
    	        		}
    	        	</Select>
		        </FormItem>
				<FormItem  {...formItemLayout}  hasFeedback label="语言：">
    	        	<Select  {...languageProps} placeholder="请选择">
    	        		<Option key={0} value=''>未选择</Option>
    	        		{
    	        			select.languageList.map(item => {
    	        				return <Option key={item.key} value={item.key+''}>{item.value}</Option>
    	        			})
    	        		}
    	        	</Select>
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