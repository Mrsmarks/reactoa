import React, { PropTypes } from 'react'
import Immutable, { List, Map } from 'immutable'
import { Link } from 'react-router'
	
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Spin from 'antd/lib/spin'

import Popconfirm from 'antd/lib/popconfirm'

import message from 'antd/lib/message'

import Key from 'Application/decorators/key'
import onError from 'Application/decorators/onError'
import Auth from 'Application/components/auth'


// @onError('fetchRoleList')
@Key(['content'])
export default class DepartmentComp extends React.Component{

	static propTypes = {

	}

	state = {
		modalVisible: false,
		roleData: {}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	handleEdit(id) {
		this.context.router.push({
			pathname: '/system/department/edit',
			query: {
				id
			}
		})
	}

	onPageChange(nextPage, pageSize) {
		const query = {
			...this.props.params.toJS(),
			psize: pageSize,
			page: nextPage,
		}
		delete query.count
		this.context.router.push({
			pathname: '/system/department/list',
			query
		})
		this.props.actions.fetchDepartmentList(query)
	}

	deleteDepartment(id) {
		this.props.actions.deleteDepartment(id).then(x => {
			message.success(x.errormsg)
		})
	}

	renderToolBar() {
		return(
			<div className="toolbar">
				<Auth type={["department-add"]}>
					<Link to="/system/department/edit">
						<Button type="primary">
							<Icon type="plus"/>
							添加
						</Button>
					</Link>
				</Auth>
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const user = this.props.user.toJS()
		const deleteDepartment = id => _ => {
			this.deleteDepartment(id)
		}

		const columns = [{
			title: '所属企业',
			dataIndex: 'cpid_name',
			key: 'cpid_name'
		},{
			title: '部门名称',
			dataIndex: 'name',
			key: 'name'
		},{
			title: '部门类型',
			dataIndex: 'type_name',
			key: 'type_name'
		},{
			title: '使用状态',
			dataIndex: 'use_state',
			key: 'use_state',
			render(status) {
				return(
					<span>{status == 1 ?  '开启': '关闭'}</span>
				)
			}
		},{
			title: '网点数据互通',
			dataIndex: 'network_data_exchange',
			key: 'network_data_exchange',
			render(status) {
				return(
					<span>{status == 1 ? '开启': '关闭'}</span>
				)
			}
		},{
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["department-group-check"]}>
							<Link to={{pathname: '/system/department/group-auth', query: {id: user.uid, dpid: obj.id} }}>查看微信分组权限</Link>
						</Auth>
						{' '}
						<Auth type={["department-check"]}>
							<Link to={{ pathname: '/system/department/edit', query: { id: obj.id } }}>编辑</Link>
						</Auth>
						{' '}
						<Auth type={["department-delete"]}>
							<Popconfirm title="确定要删除吗？" onConfirm={deleteDepartment(obj.id)}>
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
				// loading={this.props.loading}
			/>
		)
	}


	render() {
		return (
			<Spin spinning={this.props.loading}>
				{this.renderToolBar()}
				{this.renderTable()}
			</Spin>
		)
	}
}