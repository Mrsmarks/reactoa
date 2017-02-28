import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'



const FormItem = Form.Item
const Option = Select.Option
const roleList = ['微信操作员', '微信管理员', '运营人员']

@Form.create()

export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			id: '',
			name: '',
			ready: false
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
		// if(Object.keys(nextProps.info).length > 0 && this.state.ready) {
		// 	this.setState({
		// 		type: nextProps.info.type
		// 	})
		// }
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_2')
	}

	//编辑
	handleEdit () {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			// values.cpid = this.props.info.cpid
			// values.dpid = this.props.info.dpid
			// values.nid = this.props.info.nid
			this.props.editAdmin(values, this.props.info.id)
		})
		
	}

	checkPass(rule, value, callback) {
		const { validateFields } = this.props.form
		if (value) {
			validateFields(['rePasswd'])
		}
		callback()
	}

	checkPass2(rule, value, callback) {
		const { getFieldValue } = this.props.form
			if (value !== getFieldValue('password')) {
				callback('两次输入密码不一致！')
			} else {
				callback()
			}
	}

	compareList(array1, array2) {
		array1.forEach(item => {
			array2.forEach(item1 => {
				if(item.id+'' == item1.id){
					item['disabled'] = false
				}
			})
		})
		return array1
	}

	renderForm() {
		const select = this.props.option
		const groupList = this.compareList(this.props.option.adminGroupList, this.props.select.adminGroupList)
		const packageList = this.compareList(this.props.option.authPackageList, this.props.select.authPackageList)
		const user = this.props.user
		const obj = select.authPackageList.find(item => item.id+'' == this.props.info.role)
		const { getFieldProps } = this.props.form

		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const data = this.props.info

		const usernameProps = getFieldProps('username', {
			rules: [
				{ required: true, message: '请输入用户名' }
			],
			initialValue: data.username
		})

		const roleProps = getFieldProps('role', {
			initialValue: +data.role
		})

		

		const passwdProps = getFieldProps('password', {
			rules: [
				{ required: false, pattern:/^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,20}$/, whitespace: true, message: '请填写6-20位数数字字母混合的密码' },
				{ validator: ::this.checkPass }
			],
		})
		const rePasswdProps = getFieldProps('rePasswd', {
			rules: [
				{
					required: false,
					whitespace: true,
					pattern:/^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,20}$/,
					message: '请填写6-20位数数字字母混合的密码'
				}, {
					validator: ::this.checkPass2
				}
			]
		})

		var companyList = Object.keys(data).length && data.level<3? (<FormItem
					{...formItemLayout}
					label="所属企业："
					hasFeedback
					required
				>
					<Select
						placeholder="请选择所属企业：" 
						disabled
						{...getFieldProps('cpid', {
							initialValue: +data.cpid
						})}
					>
						{
		        			select.companyList.map(item => {
		        				return(
		        					<Option key={item.id} value={+item.id+''}>{item.name}</Option>
		        				)
		        			})
		        		}
					</Select>
				</FormItem>):(<div>
				{{
					'1': (
				<FormItem
					{...formItemLayout}
					label="所属企业："
					hasFeedback
					required
				>
					<Select
						placeholder="请选择所属企业：" 
						disabled
						{...getFieldProps('cpid', {
							initialValue: +data.cpid
						})}
					>
						{
		        			select.companyList.map(item => {
		        				return(
		        					<Option key={item.id} value={+item.id+''}>{item.name}</Option>
		        				)
		        			})
		        		}
					</Select>
				</FormItem>),
				'2':(<div><FormItem
					{...formItemLayout}
					label="账号类型："
					hasFeedback
					required
				>
					<Select 
						placeholder="请选择账号类型" 
						disabled
						{...getFieldProps('type', {
							initialValue: data.type+''
						})}>
    	        		<Option  key={1} value="1">企业管理员</Option>
    	        		<Option  key={2} value="2">运营管理员</Option>
    	        	</Select>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="组织机构编码："
					hasFeedback
					required
				>
					<Input {...getFieldProps('organization', {
						initialValue: data.organization,
					})} disabled/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="所属群组："
					hasFeedback
					required
				>
					<Select
						placeholder="请选择所属群组：" 
						allowClear
						{...getFieldProps('admin_group_id', {
							initialValue: +data.admin_group_id
						})}
					>
						{
		        			groupList.map(item => {
		        				return(
		        					<Option disabled={item.disabled !== false} key={item.id} value={+item.id+''}>{item.name}</Option>
		        				)
		        			})
		        		}
					</Select>
				</FormItem></div>)}[data.type]}</div>)
				

		return(
			<Form horizontal>
				<FormItem
					{...formItemLayout}
					label="账户："
					hasFeedback
				>
					<Input  {...usernameProps}/>
				</FormItem>
		
				<FormItem
					{...formItemLayout}
					label="权限包："
					hasFeedback
					required
				>
					<Select {...roleProps} size="large" placeholder="请选择所属权限包" >
		        		{
		        			packageList.map(item => {
		        				return(
		        					<Option disabled={item.disabled !== false} key={item.id} value={+item.id+''}>{item.name}</Option>
		        				)
		        			})
		        		}
	    	        </Select>
				</FormItem>
				<div hidden={data.level == 1}>{companyList}</div>
				{/*<div hidden={this.props.user.level == 3}>
					<FormItem
						{...formItemLayout}
						label={`${this.state.name}：`}
						hasFeedback
					>
						<Select {...departmentProps} size="large" placeholder="请选择" disabled style={{ width: 150 }}>
			        		{
			        			select.departmentList.map(item => {
			        				return(
			        					<Option key={+item.id+''} value={+item.id+''}>{item.name}</Option>
			        				)
			        			})
			        		}
		    	        </Select>
					</FormItem>
				</div>*/}
				<FormItem
					{...formItemLayout}
					label="密码："
					hasFeedback
				>
					<Input {...passwdProps} type="password"/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="确认密码："
					hasFeedback
				>
					<Input {...rePasswdProps} type="password"/>
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
				onOk={::this.handleEdit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}