import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Table from 'antd/lib/table'
import Select from 'antd/lib/select'
import Modal from 'antd/lib/modal'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
import message from 'antd/lib/message'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import onError from 'Application/decorators/onError'
import Icon from 'antd/lib/icon'

const FormItem = Form.Item
const Option = Select.Option

@Key(['content'])
@Form.create()
@onError('fetchCustomerManagementList')
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			visible: false,
			info: ''
		}
	}

	static propTypes= {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		wait: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	toggleModal(info) {
		if(!info) {
			this.setState({
				visible: !this.state.visible
			})
		}
		else{
			this.setState({
				visible: !this.state.visible,
				info: info
			})
		}
		
	}

	handleLoading() {
		this.props.actions.fetchCustomerManagementList()
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			values.account = this.state.info.account
			this.props.actions.customerManagementSwitch(values).then(resolve => {
				message.success(resolve.errormsg)
				this.toggleModal()
			})
		})
	}
	
	renderTable() {
		const dataSource = this.props.content.toJS()
		const count = this.props.wait.toJS().count
		const toggleModal = (obj) => _ => {
			return this.toggleModal(obj)
		}
		const columns = [{
			title: '客服账号',
			dataIndex: 'account',
			key: 'account',
		}, {
			title: '客服名称',
			dataIndex: 'kf_name',
			key: 'kf_name',
		}, {
			title: '接待会话数',
			dataIndex: 'accepted_case',
			key: 'accepted_case',
		}, {
			title: '最大会话数',
			dataIndex: 'auto_accept',
			key: 'auto_accept',
		}, {
			title: '在线状态',
			dataIndex: 'status',
			key: 'status',
		}, {
			title: '操作',
			key: 'opeation',
			render(_, obj) {
				return(
					<a onClick={toggleModal(obj)}>转接</a>
				)
			}
		} ]

		return (
			<div>
				<Form inline>
					<FormItem>
						<Button type="primary" size="default" onClick={::this.handleLoading}><Icon type="reload"/>刷新</Button>
					</FormItem>
					<FormItem>
						<div style={{marginBottom: 10,fontWeight: 'bold',textAlign:'right'}}>等待接入用户：<i style={{fontSize: 15, color:'#2db7f5'}}>{count}</i></div>
					</FormItem>
					<FormItem style={{float: "right"}}>
						<a target="_blank" href="https://mpkf.weixin.qq.com">登录微信客服</a>
					</FormItem>
				</Form>
				<Table 
					dataSource={dataSource}
					columns={columns}
					pagination={false}
					loading={this.props.loading}
				/>
			</div>
		)
	}

	renderForm() {
		const option = this.props.wait.toJS().list
		const { getFieldProps } = this.props.form

		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const accountProps = Object.keys(this.state.info).length > 0? (<FormItem
			          {...formItemLayout}
			          label="客服账号："
			          hasFeedback
			          >
			          <Input defaultValue={this.state.info.account} type="text" disabled/>
			        </FormItem>): ''

		const usersProps = getFieldProps('openid', {
			rules: [
				{ required: true, type:'array', message: '请选择待接入用户' }
			],
		})

		return(
			<Form horizontal >
					{accountProps}
			        <FormItem
			          {...formItemLayout}
			          label="待接入用户："
			          disabled
			          hasFeedback
			          >
			         <Select {...usersProps} multiple>
			         	{
			         		option.map(item => {
			         			return(
			         				<Option key={item.openid} value={item.openid}>{item.name}</Option>
			         			)
			         		})
			         	}
			         </Select>
			        </FormItem>
			        
		        	<FormItem
			          {...formItemLayout}
			          label="附加信息："
			          hasFeedback
			          >
			          <Input {...getFieldProps('text')} type="textarea" rows="6"/>
			        </FormItem>
				</Form>
		)
	}

	renderModal() {
		return(
			<Modal 
				title="转接"
				visible={this.state.visible}
				cancelText='返回'
				onCancel={::this.toggleModal}
				confirmLoading={this.props.updateLoading}
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}

	render() {
		return (
			<div>
				{this.renderTable()}
				{this.renderModal()}
			</div>
		)
	}
}