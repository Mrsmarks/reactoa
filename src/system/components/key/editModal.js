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
			loading: true
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_3')
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			this.props.handleEdit(this.props.info.id, values)			
		})
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.info.type == 1 && this.state.loading ){
			this.setState({account: nextProps.account})
		}
		if (nextProps.visible === false) {
			this.props.form.resetFields()
			this.setState({
				ready: false,
				loading: true
			})	
		}

		if(!Object.is(nextProps.info, this.props.info) && Object.keys(nextProps.info).length && !this.state.ready) {
			this.setState({
				isWx: nextProps.info.type,
				ready: true
			})
		}
	}

	getAcid(value) {
		const { setFieldsValue } = this.props.form
		setFieldsValue({'acid': ''})
		this.props.fetchAcidByCid(value).then(resolve => {
			this.setState({
				account: resolve.result.accountList,
				loading: false
			})
		})
	}

	getType(value) {
		const { setFieldsValue, getFieldValue } = this.props.form
		setFieldsValue({'acid': ''})
		if(value == 1){
			const cpid = getFieldValue('cpid')
				this.props.fetchAcidByCid(cpid).then(resolve => {
					this.setState({
						account: resolve.result.accountList,
						loading: false

					})
			})
		}
		this.setState({
			isWx: value
		})
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
			onChange: ::this.getType
		})

		const cpidProps = getFieldProps('cpid', {
			rules: [
				{ required: true, message: '请选择企业' }
			],
			initialValue: info.cpid+'',
			onChange: ::this.getAcid
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
					<div hidden={this.state.isWx != 1}>
						<FormItem
						{...formItemLayout}
						label="公众号："
						hasFeedback
						>
							<Select {...getFieldProps('acid', {
								initialValue: this.state.account.length > 0? info.acid+'': ''
							}) } size="large" placeholder="请选择" >
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
				title="编辑"
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