import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'


import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'

import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'

import AddModal from './addModal'
import EditModal from './editModal'
import SeeModal from './seeModal'
import onError from 'Application/decorators/onError'

const FormItem = Form.Item

@Key(['content'])
@Form.create()
@onError('fetchSettingList')
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
	}

	static propTypes= {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/setting/list',
			query: query
		})
		this.props.actions.fetchSettingList(query)
	}

	handleRemove(id) {
		const aid = this.context.location.query.aid
		this.props.actions.delSettingList(id, aid).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	componentWillMount() {
		const aid = this.context.location.query.aid
		if(!this.props.pending){
			this.props.actions.fetchSettingList({page: 1, aid: aid})
		}
	}

	addRoute() {
		this.context.router.push({
			pathname: '/activity/setting/add',
			query: {
				aid: this.context.location.query.aid,
				type: this.context.location.query.type
			}
		})
	}

	editRoute(obj) {
		this.context.router.push({
			pathname: '/activity/setting/edit',
			query: {
				aid: this.context.location.query.aid,
				id: obj.id,
				type: this.context.location.query.type
			}
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const typeProps = getFieldProps('type', {
			
		})
		return (
			<div className="toolbar">
				<Form inline >
					<Button onClick={::this.addRoute} type="primary">
						<Icon type="plus" />
						添加
					</Button>
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const toUserGroup = obj => _ => {
			return this.toUserGroup(obj)
		}

		const toSettingRoute = id => _ => {
			return this.toSettingRoute(id)
		}

		const editRoute = obj => _ => {
			return this.editRoute(obj)
		}

		const columns = [{
			title: '活动名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '活动类型',
			dataIndex: 'type',
			key: 'type'
		}, {
			title: '开始时间',
			dataIndex: 'start_time',
			key: 'start_time'
		}, {
			title: '结束时间',
			dataIndex: 'end_time',
			key: 'end_time',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<a onClick={editRoute(obj)} style={{paddingRight:5}}>编辑</a>
							<Popconfirm title="确定要删除吗？" onConfirm={handleRemove(obj.id)}>
								<a>删除</a>
							</Popconfirm>
					</div>
				)
			}
		}]
		const params = this.props.params.toJS()
		const pagination = {
			total: +params.count,
			current: +params.page,
			onChange: ::this.handlePageChange,
			showSizeChanger: true,
			pageSize: +params.psize,
			onShowSizeChange: ::this.handlePageChange,
			showTotal: function() {
				return `共${params.count}条`
			}.bind(this)
		}

		return (
			<Table 
				dataSource={dataSource}
				columns={columns}
				pagination={ pagination }
				loading={this.props.loading}
			/>
		)
	}

	render() {
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
			</div>
		)
	}
}