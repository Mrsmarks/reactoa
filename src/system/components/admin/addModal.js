import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'
import Tooltip from 'antd/lib/tooltip'
import Alert from 'antd/lib/alert'
import Tag from 'antd/lib/tag'
const FormItem = Form.Item
const Option = Select.Option

@Form.create()

export default class MainModal extends React.Component{

	constructor(props) {
		super(props)
		this.state={
			type: "1",
			name: ""
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_3')
	}

	handleChangeType(value) {
		this.setState({
			type: value
		})
	}

	getOrganizationDetail(e) {
		if(e.target.value.length != 9) {
			this.setState({
				name:''
			})
			return
		}
		this.props.getOrganizationDetail(e.target.value).then(resolve => {
			this.setState({
				name: resolve.result.name
			})
		})
	}

	//添加
	handleAdd () {
		const user = this.props.user
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			// switch(user.level){
			// 	case -1:
			// 	values.dpid = user.dpid
			// 	values.nid = user.nid
			// 	break
			// 	case 1:
			// 	values.cpid = user.cpid
			// 	values.nid = user.nid
			// 	break
			// 	case 2:
			// 	values.cpid = user.cpid
			// 	values.dpid = user.dpid
			// 	break
			// 	case 3:
			// 	values.cpid = user.cpid
			// 	values.dpid = user.dpid
			// 	values.nid = user.nid
			// }
			this.props.addAdmin(values)
		})
		
	}

	renderForm() {
		const select = this.props.select
		const user = this.props.user
		const { getFieldProps } = this.props.form

		const pwdProps = getFieldProps('password', {
			rules: [
				{
					required: true,
					pattern:/^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{6,20}$/,
					message: '请填写6-20位的数字字母混合密码'
				}
			]
		})

		const typeProps = getFieldProps('type', {
			onChange: ::this.handleChangeType
		})


		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const adminAuth = (<FormItem
					{...formItemLayout}
					label="所属企业："
					hasFeedback
					required
				>
					<Select
						placeholder="请选择所属企业：" 
						allowClear
						{...getFieldProps('cpid')}
					>
						{
		        			select.companyList.map(item => {
		        				return(
		        					<Option  key={item.id} value={item.id+''}>{item.name}</Option>
		        				)
		        			})
		        		}
					</Select>
				</FormItem>)

		const managementAuth = (<div><FormItem
					{...formItemLayout}
					label="账号类型："
					hasFeedback
					required
				>
					<Select 
						placeholder="请选择账号类型" 
						allowClear
						{...getFieldProps('type')}>
    	        		<Option  key={1} value="1">企业管理员</Option>
    	        		<Option  key={2} value="2">运营管理员</Option>
    	        	</Select>
				</FormItem>
				{{
					'1': '',
					'2': (<div><FormItem
						{...formItemLayout}
						label="组织机构编码："
						hasFeedback
						required
					>
						<Input {...getFieldProps('organization',{
							onChange: ::this.getOrganizationDetail
						})} />
						{this.state.name? <Tag color="blue">{this.state.name}</Tag>: null}
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
							{...getFieldProps('admin_group_id')}
						>
							{
			        			select.adminGroupList.map(item => {
			        				return(
			        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
			        				)
			        			})
			        		}
						</Select>
					</FormItem></div>)
				}[this.state.type]}</div>)

		var yuyinAuth = (<div><FormItem
						{...formItemLayout}
						label="组织机构编码："
						hasFeedback
						required
					>
						<Input {...getFieldProps('organization', {
							onChange: ::this.getOrganizationDetail
						})}/>
						{this.state.name? <Tag color="blue">{this.state.name}</Tag>: null}
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
							{...getFieldProps('admin_group_id')}
						>
							{
			        			select.adminGroupList.map(item => {
			        				return(
			        					<Option  key={item.id} value={item.id+''}>{item.name}</Option>
			        				)
			        			})
			        		}
						</Select>
					</FormItem></div>)

		var authDom = null
		switch(user.level) {
			case 1:
			authDom =  adminAuth
			break
			case 2:
			authDom =  managementAuth
			break
			case 3:
			authDom =  yuyinAuth
		}
				
		
		return(
			<Form horizontal>
				<FormItem
					{...formItemLayout}
					label="账户："
					hasFeedback
				>
					<Input {...getFieldProps('username')}/>
				</FormItem>
				
				<FormItem
					{...formItemLayout}
					label="权限包："
					hasFeedback
					required
				>
					<Select 
						placeholder="请选择权限包：" 
						allowClear
						{...getFieldProps('role')}>
    	        		{
		        			select.authPackageList.map(item => {
		        				return(
		        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
		        				)
		        			})
		        		}
    	        	</Select>
				</FormItem>
				{authDom}
				<FormItem
					{...formItemLayout}
					label="密码："
					hasFeedback
				>
					<Input {...pwdProps} type="password"/>
				</FormItem>
				{/*<div hidden={user.level == -1? false: true}>
					<FormItem
						{...formItemLayout}
						label="所属企业："
						hasFeedback
					>
						<Select 
							{...getFieldProps('cpid')} 
							placeholder="管理员创建后所属企业不可修改" 
							allowClear>
							{
								select.departmentList.map(item => {
			        				return(
			        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
			        				)
		        				})
							}
						</Select>
					</FormItem>
				</div>
				<div hidden={user.level == 1? false: true}>
					<FormItem
						{...formItemLayout}
						label="选择所属部门："
						hasFeedback
					>
						<Select 
							placeholder="管理员创建后所属部门不可修改"
							{...getFieldProps('dpid')}
							allowClear
							>
							{
								select.departmentList.map(item => {
			        				return(
			        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
			        				)
		        				})
							}
						</Select>
					</FormItem>
				</div>
				<div hidden={user.level == 2? false: true}>
					<FormItem
						{...formItemLayout}
						label="选择所属网点："
						hasFeedback
					>
						<Select 
							placeholder="管理员创建后所属网点不可修改"
							{...getFieldProps('nid')}
							allowClear
							>
							{
								select.departmentList.map(item => {
			        				return(
			        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
			        				)
		        				})
							}
						</Select>
					</FormItem>
				</div>*/}
				
				
			</Form>
		)
	}

	render() {
		return(
			<Modal 
				title="添加"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				onOk={::this.handleAdd}
				confirmLoading={this.props.addLoading}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}