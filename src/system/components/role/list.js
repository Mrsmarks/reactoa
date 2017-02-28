import React, { PropTypes } from 'react'
import Immutable, { List, Map } from 'immutable'
import { Link } from 'react-router'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Modal from 'antd/lib/modal'
import Spin from 'antd/lib/spin'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Popconfirm from 'antd/lib/popconfirm'
import Auth from 'Application/components/auth'

import message from 'antd/lib/message'

import Key from 'Application/decorators/key'
import onError from 'Application/decorators/onError'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
@Key(['content'])
@onError('fetchRoleList')
export default class RoleComp extends React.Component{

	static propTypes = {
		actions: PropTypes.object.isRequired,

		params: PropTypes.instanceOf(Map).isRequired,
		content: PropTypes.instanceOf(List).isRequired,

		authPackageList: PropTypes.instanceOf(List).isRequired,

		user: PropTypes.instanceOf(Map).isRequired

	}

	state = {
		modalVisible: false,
		roleData: {}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	onPageChange(nextPage, pageSize) {
		const query = {
			psize: pageSize,
			page: nextPage
		}
		this.context.router.push({
			pathname: '/system/role/list',
			query
		})
		this.props.actions.fetchRoleList(query)
	}

	loadEditModal(roleData) {
		// if (this.props.authPackageList.size && this.props.companyList.size) {
		// 	// 只加载一次远程数据
		// 	return this.showModal(roleData)
		// }
		this.props.actions.fetchCompAndAuthList().then(() => {
			this.showModal(roleData)
		})
	}

	showModal(roleData) {
		this.setState({
			modalVisible: true,
			roleData
		})
	}

	hideModal() {
		this.setState({
			modalVisible: false,
			roleData: {}
		})
	}

	removeRole(id) {
		this.props.actions.editRole({}, 'delete', id).then(x => {
			message.success(x.errormsg)
		})
	}

	saveRole() {
		this.props.form.validateFields((error, values) => {
			if (error) {
				return
			}

			const roleData = this.state.roleData
			const act = roleData.id ? 'update' : 'add'

			this.props.actions.editRole(values, act, roleData.id).then(x => {
				this.props.form.resetFields()
				this.hideModal()
				message.success(x.errormsg)
			})
		})
	}

	editRole() {

	}



	renderToolBar() {
		return(
			<div className="toolbar">
				<Auth type={["system-role-add"]}>
					<Button type="primary" onClick={this.loadEditModal.bind(this, {})}>
						<Icon type="plus"/>
						添加
					</Button>
				</Auth>
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const removeRole = id => _ => {
			return this.removeRole(id)
		}
		const editRole = obj => _ => {
			return this.loadEditModal(obj)
		}
		const columns = [{
			title: '角色名',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '更新时间',
			dataIndex: 'last_update_time',
			key: 'last_update_time'
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["system-role-check"]}>
							<a onClick={editRole(obj)}>详情</a>
						</Auth>
						{' '}
						<Auth type={["system-role-delete"]}>
							<Popconfirm title="确定要删除吗？" onConfirm={removeRole(obj.id)}>
								<a>删除</a>
							</Popconfirm>
						</Auth>
					</div>
				)
			}
		}]

		const params = this.props.params
		const pagination = {
			pageSize: +params.get('psize'),
			current: +params.get('page'),
			onChange: ::this.onPageChange,
			showSizeChanger: true,
			onShowSizeChange: ::this.onPageChange,
			total: +params.get('count'),
			showTotal: function() {
				return `共${params.get('count')}条`
			}.bind(this)
		}
		return (
			<Table 
				dataSource={dataSource}
				columns={columns}
				pagination = {pagination}
				loading={this.props.loading}
			/>
		)
	}

	renderModal() {
		const formItemLayout = {
		    labelCol: { span: 4 },
		    wrapperCol: { span: 20 }
		}
		const roleData = this.state.roleData
		const { getFieldProps } = this.props.form
		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称' }
			],
			initialValue: roleData.name
		})
		const noteProps = getFieldProps('remark', {
			initialValue: roleData.remark
		})
		const authProps = getFieldProps('auth', {
			rules: [
				{ required: true, message: '请选择权限名' }
			],
			initialValue: roleData.auth ? roleData.auth + '' : undefined
		})

		const user = this.props.user.toJS()

		const { authPackageList } = this.props
		return (
			<Modal
				title={Object.keys(this.state.roleData).length? '详情': '添加'}
				visible={this.state.modalVisible}
				onCancel={::this.hideModal}
				width={400}
				footer={[
					<Button key="back" type="ghost" size="large" onClick={::this.hideModal}>返 回</Button>,
					<Auth key="submit" type={["system-role-update"]}>
						<Button type="primary" size="large"  onClick={::this.saveRole}>
							提 交
						</Button>
					</Auth>
				]}
			>
				<Form horizontal>
					<FormItem  {...formItemLayout} label="名称："
						hasFeedback>
						<Input {...nameProps} type="text"/>
					</FormItem>
					{
						user.level == 1 && [
							
							<FormItem key={2} {...formItemLayout} label="级别："
								hasFeedback>
								<Select
									{...getFieldProps('level', {
										rules: [
											{ required: true, message: '请选择级别' }
										],
										initialValue: roleData.level ? roleData.level + '' : undefined
									})}
								>
										<Option key={1} value="2">部门</Option>
										<Option key={2} value="3">网点</Option>
								</Select>
							</FormItem>
						]
					}
					
					<FormItem  {...formItemLayout} label="权限名："
						hasFeedback>
						<Select
							{...authProps}
						>
							{
								authPackageList.map(item =>
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
								)
							}
						</Select>
					</FormItem>
					<FormItem  {...formItemLayout} label="备注："
						hasFeedback>
						<Input {...noteProps} type="text"/>
					</FormItem>
				</Form>
			</Modal>
		)
	}

	render() {
		return (
			<div>
				{this.renderToolBar()}
				{this.renderTable()}
				{this.renderModal()}
			</div>
		)
	}
}