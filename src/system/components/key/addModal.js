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

	constructor(props, context) {
		super(props, context)
		this.state ={
			isWx: '',
			account: []
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			if(values.type == 2)  values.acid = ''
			this.props.handleAdd(values)
			
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()	
		}
		if(this.props.visible === false) {
			this.setState({
				isWx: '',
				account: []
			})
		}
	}

	getAcid(value) {
		const { setFieldsValue } = this.props.form
		setFieldsValue({'acid': ''})
		this.props.fetchAcidByCid(value).then(resolve => {
			this.setState({
				account: resolve.result.accountList
			})
		})
	}

	getType(value) {
		this.setState({
			isWx: value
		})
	}

	renderForm() {

		const { getFieldProps } = this.props.form
		const  select = this.props.select
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
				{ required: true, message: '请输入名称' }
			]
		})

		const typeProps = getFieldProps('type', {
			rules: [
				{ required: true, message: '请选择类型' }
			],
			onChange: ::this.getType
		})

		const cpidProps = getFieldProps('cpid', {
			rules: [
				{ required: true, message: '请选择企业' }
			],
			onChange: ::this.getAcid
		})

		const keyProps = getFieldProps('key', {
			rules: [
				{ required: true, message: '请输入key' }
			],
		})

		const remarkProps = getFieldProps('remark', {
			
		}) 

		const acidItem = this.state.isWx == 1? (<FormItem
					{...formItemLayout}
					label="公众号："
					hasFeedback
				>
					<Select {...getFieldProps('acid', {
								rules: [
									{ required: true, message: '请选择公众号' }
								],
					}) } size="large" placeholder="请选择" >
		        		{
		        			this.state.account.map(item => {
		        				return(
		        					<Option key={item.id} value={item.id+''}>{item.nick_name}</Option>
		        				)
		        			})
		        		}
	    	        </Select>
				</FormItem>):''

		return(
		
				<Form horizontal>

					<FormItem
						{...formItemLayout}
						label="名称："
						hasFeedback
					>
						<Input  {...nameProps}/>
					</FormItem>

					<FormItem
						{...formItemLayout}
						label="类型："
						hasFeedback
					>
						<Select {...typeProps} size="large" placeholder="请选择" >
			        		{
			        			select.thirdPartyKeyType.map(item => {
			        				return(
			        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
			        				)
			        			})
			        		}
		    	        </Select>
					</FormItem>
					
					<FormItem
						{...formItemLayout}
						label="企业："
						hasFeedback
					>
						<Select {...cpidProps} size="large" placeholder="请选择">
			        		{
			        			select.companyList.map(item => {
			        				return(
			        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
			        				)
			        			})
			        		}
		    	        </Select>
					</FormItem>
					{acidItem}
					<FormItem
						{...formItemLayout}
						label="key："
						hasFeedback
					>
						<Input  {...keyProps}/>
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="备注："
						hasFeedback
					>
						<Input {...remarkProps} type="textarea" rows="6"/>
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
				confirmLoading={this.props.updateLoading}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}