import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'





import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Key from 'Application/decorators/key'
import onError from 'Application/decorators/onError'
import Auth from 'Application/components/auth'



@Key(['content'])
@onError('fetchAuthList')
export default class AuthComp extends React.Component{

	static propTypes = {
		actions: PropTypes.object.isRequired,
		params: PropTypes.object.isRequired,
		loading: PropTypes.bool.isRequired,
		count: PropTypes.number.isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	constructor(props) {
		super(props)
	}

	onPageChange(nextPage, pageSize) {
		this.context.router.push({
			pathname: '/system/auth/list', 
			query: {
				page: nextPage,
				psize: pageSize
			}
		})
		this.props.actions.fetchAuthList({
			page: nextPage,
			psize: pageSize
		})
	}

	showTotal() {
		return `共${this.props.count}条`
	}

	removeAuthPackage(id) {
		this.props.actions.removeAuthPackage(id).then(({ errormsg }) => {
			message.success(errormsg)
		})
	}

	renderToolBar() {
		return(
			<div className="toolbar">
			<Auth type={["system-auth-package-add"]}>
				<Link to="/system/auth/edit">
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
		const removeAuthPackage = id => _ => {
			this.removeAuthPackage(id)
		}
		const columns = [{
			title: '权限包名称',
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
						<Auth type={["system-auth-package-check"]}>
							<Link to={{ pathname: '/system/auth/edit', query: { id: obj.id } }}>编辑</Link>
						</Auth>
						{' '}
						<Auth type={["system-auth-package-delete"]}>
							<Popconfirm title="确定删除吗？" onConfirm={removeAuthPackage(obj.id)}>
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
				pagination={pagination}
				loading={this.props.loading}
			/>
		)
	}

	render() {
		return (
			<div>
				{this.renderToolBar()}
				{this.renderTable()}
			</div>
		)
	}
}