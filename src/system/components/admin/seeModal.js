import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'


const FormItem = Form.Item
const Option = Select.Option

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
		// if(!this.state.ready) {
		// 	const user = nextProps.user
		// 	var id = ''
		// 	var name = ''
		// 	switch(user.level) {
		// 		case -1:
		// 		id = 'cpid'
		// 		name = '所属企业'
		// 		break
		// 		case 1:
		// 		id = 'dpid'
		// 		name = '所属部门'
		// 		break
		// 		case 2:
		// 		id = 'nid'
		// 		name= '所属网点'
		// 	}
		// 	this.setState({
		// 		id: id,
		// 		name: name,
		// 		ready:true
		// 	})
		// }
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
	}

	renderForm() {
		const select = this.props.select
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

		var companyList = this.props.info.level<3 ? (<FormItem
					{...formItemLayout}
					label="所属企业："
				>
					<Select
						placeholder="请选择所属企业：" 
						
						{...getFieldProps('cpid', {
							
							initialValue: +this.props.info.cpid
						})}
						disabled
					>
						{
		        			select.companyList.map(item => {
		        				return(
		        					<Option key={item.id} value={+item.id+''}>{item.name}</Option>
		        				)
		        			})
		        		}
					</Select>
				</FormItem>):(<div><FormItem
					{...formItemLayout}
					label="组织机构编码："
				>
					<Input {...getFieldProps('organization', {
						
						initialValue: this.props.info.organization
					})} readOnly/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="所属群组："
				>
					<Select
						placeholder="请选择所属群组：" 
						
						{...getFieldProps('admin_group_id', {
							
							initialValue: +this.props.info.admin_group_id
						})}
						disabled
					>
						{
		        			select.adminGroupList.map(item => {
		        				return(
		        					<Option key={item.id} value={+item.id+''}>{item.name}</Option>
		        				)
		        			})
		        		}
					</Select>
				</FormItem></div>)

		return(
			<Form horizontal>
				<FormItem
					{...formItemLayout}
					label="账户："
					hasFeedback
				>
					<Input value={this.props.info.username} readOnly/>
				</FormItem>
				
				<FormItem
					{...formItemLayout}
					label="权限包："
					hasFeedback
				>
					<Select value={+this.props.info.role} size="large" readOnly placeholder="请选择所属权限包"  style={{ width: 150 }}>
		        		{
		        			select.authPackageList.map(item => {
		        				return(
		        					<Option key={item.id} value={+item.id+''}>{item.name}</Option>
		        				)
		        			})
		        		}
	    	        </Select>
				</FormItem>
				<div hidden={this.props.info.level == 1}>{companyList}</div>
				{/*<div hidden={this.props.user.level == 3}>
					<FormItem
						{...formItemLayout}
						label={`${this.state.name}：`}
						hasFeedback
					>
						<Select value={+this.props.info[this.state.id]} size="large" placeholder="请选择" disabled style={{ width: 150 }}>
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