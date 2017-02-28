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
			account: [],
			ready: false,
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_2')
	}

	componentWillReceiveProps(nextProps) {
		this.setState({account: nextProps.account})
		if (nextProps.visible === false) {
			this.props.form.resetFields()
			this.setState({
				ready: false,
			})	
		}

		if(!Object.is(nextProps.info, this.props.info) && Object.keys(nextProps.info).length && !this.state.ready) {
			this.setState({
				isWx: nextProps.info.type,
				ready: true
			})
		}
	}

	renderForm() {

		const { getFieldProps } = this.props.form
		const  select = this.props.select
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
				{ required: true, message: '请输入名称' }
			],
			initialValue: info.name 
		})

		const typeProps = getFieldProps('type', {
			rules: [
				{ required: true, message: '请选择类型' }
			],
			initialValue: info.type+'', 
		})

		const cpidProps = getFieldProps('cpid', {
			rules: [
				{ required: true, message: '请选择企业' }
			],
			initialValue: info.cpid+'',
		})

		const keyProps = getFieldProps('key', {
			rules: [
				{ required: true, message: '请输入key' }
			],
			initialValue: info.keys
		})

		const remarkProps = getFieldProps('remark', {
			initialValue: info.remark 
		}) 

		return(
			<Form horizontal>

				<FormItem
					{...formItemLayout}
					label="名称："
					hasFeedback
				>
					<Input  {...nameProps} readOnly/>
				</FormItem>

				<FormItem
					{...formItemLayout}
					label="类型："
					hasFeedback
				>
					<Select {...typeProps} size="large" placeholder="请选择" disabled>
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
					<Select {...cpidProps} size="large" placeholder="请选择" disabled>
		        		{
		        			select.companyList.map(item => {
		        				return(
		        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
		        				)
		        			})
		        		}
	    	        </Select>
				</FormItem>
				<div hidden={this.state.isWx != 1}>
					<FormItem
					{...formItemLayout}
					label="公众号："
					hasFeedback
					>
						<Select {...getFieldProps('acid', {
									initialValue: this.state.account.length > 0? info.acid+'': ''
						}) } size="large" placeholder="请选择" disabled>
			        		{
			        			this.state.account.map(item => {
			        				return(
			        					<Option key={item.id} value={item.id+''}>{item.nick_name}</Option>
			        				)
			        			})
			        		}
		    	        </Select>
					</FormItem>
				</div>
				<FormItem
					{...formItemLayout}
					label="key："
					hasFeedback
				>
					<Input  {...keyProps} readOnly/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="备注："
					hasFeedback
				>
					<Input {...remarkProps} type="textarea" rows="6" readOnly/>
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