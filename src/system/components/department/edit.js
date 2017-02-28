import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
const Option = Select.Option
import Col from 'antd/lib/col'

import message from 'antd/lib/message'
import Cascader from 'antd/lib/cascader'
import Switch from 'antd/lib/switch'

import cityOptions from 'Application/utils/city'

import Radio from 'antd/lib/radio'
import Auth from 'Application/components/auth'

const RadioGroup = Radio.Group

const FormItem = Form.Item

@Form.create()
export default class DepartmentEditComp extends React.Component{
	static propTypes = {
		deptData: PropTypes.instanceOf(Immutable.Map).isRequired,
		deptSelector: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired,
		editId: PropTypes.any
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {
		deptType: undefined,
		use_state: undefined,
		network_data_exchange: undefined
	}

	handleSubmit() {
		this.props.form.validateFields((error, values) => {
			if (error) {
				return
			}

			values.acid = values.acid ? values.acid.join(',') : undefined
			if (values.position) {
				const position = values.position
				values.province = position[0]
				values.city = position[1]
				values.district = position[2]
			}

			let act, id
			if (this.props.deptData.size) {
				act = 'update',
				id = this.props.deptData.get('id')
			} else {
				act = 'add'
			}
			Object.assign(values, {
				network_data_exchange: values.network_data_exchange != undefined ? +values.network_data_exchange : (this.props.deptData.get('network_data_exchange') || 0),
				use_state: values.use_state != undefined ? +values.use_state : (this.props.deptData.get('use_state') || 0)
			})
			this.props.actions.editDepartment({
				data: values,
				act,
				id
			}).then(x => {
				message.success(x.errormsg)
				this.props.form.resetFields()
				this.context.router.replace('/system/department/list')
			})
		})
	}

	typeChange({ target: { value } }) {
		this.setState({
			deptType: value
		})
	}

	stateChange(name, v) {
		this.setState({
			[name]: v
		})
	}


	renderForm() {
		const formItemLayout = {
		    labelCol: { span: 4 },
		    wrapperCol: { span: 20 }
		}
		const { getFieldProps } = this.props.form

		const deptData = this.props.deptData.toJS()

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称' }
			],
			initialValue: deptData.name
		})

		const typeProps = getFieldProps('type', {
			rules: [
				{ type: 'number', required: true, message: '请选择部门类型' }
			],
			initialValue: deptData.type ? +deptData.type : undefined,
			onChange: ::this.typeChange
		})

		// const acidProps = getFieldProps('acid', {
		// 	rules: [
		// 		{ type: 'array', required: true, message: '请选择公众号' }
		// 	],
		// 	initialValue: deptData.acid ? deptData.acid.split(',') : undefined
		// })

		const orgNumProps = getFieldProps('org_num', {
			rules: [
				{ required: true, message: '请输入机构编码' }
			],
			initialValue: deptData.org_num
		})
		const contactProps = getFieldProps('contact', {
			
			initialValue: deptData.contact
		})

		const emailProps = getFieldProps('email', {
			rules: [
				{ type: 'email', message: '请输入正确的邮箱地址' }
			],
			initialValue: deptData.email
		})

		const telProps = getFieldProps('tel', {
			
			initialValue: deptData.tel
		})

		let posVal = undefined
		if(Object.keys(deptData).length) {
			const { province, city, district } = deptData
			posVal = [province, city, district]
		} 
		
		const positionProps = getFieldProps('position', {
			
			initialValue: posVal
		})

		const addressProps = getFieldProps('address', {
			
			initialValue: deptData.address
		})

		const introProps = getFieldProps('intro', {
			
			initialValue: deptData.intro
		})

		const deptProps = getFieldProps('parentid', {
			
			initialValue: deptData.parentid
		})

		const useStateProps = getFieldProps('use_state', {
			onChange: this.stateChange.bind(this, 'use_state')
		})
		const netProps = getFieldProps('network_data_exchange', {
			onChange: this.stateChange.bind(this, 'network_data_exchange')
		})
		const {
			type,
			wechat,
			departList
		} = this.props.deptSelector.toJS()
		console.log(type)
		return (
			<div className="pure-form">
				<Form horizontal>
					<FormItem  {...formItemLayout} label="名称："
						hasFeedback>
						<Input type="text" {...nameProps}/>
					</FormItem>

					<FormItem  {...formItemLayout} label="部门类型："
						hasFeedback>
						<RadioGroup 
							{...typeProps}
						>
							{
								type.map(item => 
									<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
								)
							}
						</RadioGroup>
					</FormItem>

					{{
						'1': (
							<FormItem  {...formItemLayout} label="上级部门："
								hasFeedback>
								<Select
									{...deptProps}
								>
									{
										departList.map(item =>
											<Option key={item.id} value={item.id+''}>{item.name}</Option>
										)
									}
								</Select>
							</FormItem>
						)
					}[this.state.deptType || deptData.type]}

					{/*<FormItem  {...formItemLayout} label="部门列表："
						hasFeedback>
						<RadioGroup 
							{...typeProps}
						>
							{
								type.map(item => 
									<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
								)
							}
						</RadioGroup>
					</FormItem>*/}

					{/*<FormItem  {...formItemLayout} label="公众号："
						hasFeedback>
						<Select
							{...acidProps}
							multiple
							
						>
							{
								wechat.map(item =>
									<Option key={item.id} value={item.id+''}>{item.nick_name}</Option>
								)
							}
						</Select>
					</FormItem>*/}

					<FormItem  {...formItemLayout} label="机构编码："
						hasFeedback>
						<Input type="text" {...orgNumProps}/>
					</FormItem>

					<FormItem  {...formItemLayout} label="部门联系人："
						hasFeedback>
						<Input type="text" {...contactProps}/>
					</FormItem>

					<FormItem  {...formItemLayout} label="联系人邮箱："
						hasFeedback>
						<Input type="text" {...emailProps}/>
					</FormItem>

					<FormItem  {...formItemLayout} label="联系人电话："
						hasFeedback>
						<Input type="text" {...telProps}/>
					</FormItem>

					<FormItem  {...formItemLayout} label="所在位置：">
						<Cascader options={cityOptions} {...positionProps}/>
					</FormItem>

					<FormItem  {...formItemLayout} label="详细地址："
						hasFeedback>
						<Input type="text" {...addressProps}/>
					</FormItem>

					<FormItem  {...formItemLayout} label="部门简介："
						hasFeedback>
						<Input type="textarea" {...introProps}/>
					</FormItem>

					<FormItem  {...formItemLayout} label="使用状态：">
						<Switch checkedChildren="开" unCheckedChildren="关" {...useStateProps} checked={this.state.use_state != undefined ? this.state.use_state : !!+deptData.use_state}/>
					</FormItem>

					<FormItem  {...formItemLayout} label="数据互通状态：">
						<Switch checkedChildren="开" unCheckedChildren="关" {...netProps} checked={this.state.network_data_exchange != undefined ? this.state.network_data_exchange : !!+deptData.network_data_exchange}/>
					</FormItem>
					
					<FormItem  {...formItemLayout}>
						<Col offset="5">
							<Auth type={["department-update"]}>
								<Button type="primary" size="large" loading={this.props.btnLoading} onClick={::this.handleSubmit}>{Object.keys(deptData).length ? '更新' : '确定'}</Button>
							</Auth>
						</Col>
					</FormItem>
				</Form>
			</div>
		)
	}

	render() {
		return(
			<div>
				{this.renderForm()}
			</div>
		)
	}
}