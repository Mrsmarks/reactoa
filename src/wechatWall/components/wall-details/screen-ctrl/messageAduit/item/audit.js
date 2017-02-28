import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Popconfirm from 'antd/lib/popconfirm'
import Table from 'antd/lib/table'
import message from 'antd/lib/message'
import format from 'Application/utils/formatDate'

export default class AuditComp extends React.Component {

	constructor(props, context) {
		super(props, context)
		this.state={
			selectedRowKeys: []
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		getSid: PropTypes.func.isRequired,
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall-details/screen-ctrl-message/index',
			query: query
		})
		this.props.MessageAduitList(query)
	}

	onSelectCheck(selectedRowKeys, selectedRows) {
		var list = []
		var id = []
		selectedRows.forEach(item => {
			list.push(item.key)
			id.push(item.id)
		})
		this.setState({
			selectedRowKeys: list,
			selectedRowId: id
		})
	}

	aduitItems(type) {
		const id = this.state.selectedRowId
		const query = this.context.location.query
		this.props.aduitItems(id, type).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				selectedRowKeys: []
			})
			this.props.MessageAduitList(query)
		})
	}


	renderAduitTable() {
		const assetsUrl = this.props.assetsUrl

		const handleConfirm = (id, type) => _ => {
			return this.props.handleConfirm(id, type)
		}

		const aduitItems = type => _ => {
			return this.aduitItems(type)
		}
		const renderAduitToolbar = (
			<div className="toolbar">
				<Popconfirm title="确定通过审批？" onConfirm={aduitItems('passWall')} >
					<Button >
						<Icon type="check" />
						批量通过
					</Button>
				</Popconfirm>
				<span style={{marginLeft: 5}}></span>
				<Popconfirm title="确定不通过审批？" onConfirm={aduitItems('downWall')}>
					<Button >
						<Icon type="cross" />
						批量不通过
					</Button>
				</Popconfirm>
				<span style={{marginLeft: 5}}></span>
				<Popconfirm title="确定屏蔽消息？" onConfirm={aduitItems('shield')}>
					<Button >
						<Icon type="cross-circle-o" />
						屏蔽消息
					</Button>
				</Popconfirm>
			</div>
		)
		const columns = [{
			title: '头像',
			dataIndex: 'image',
			key: 'image',
			render(img, obj) {
				return(
					<span><img className="head-img" src={obj.type? assetsUrl + img: img}/></span>
				)
			}
		}, {
			title: '昵称',
			dataIndex: 'nick',
			key: 'nick',
		}, {
			title: '发送时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render(time) {
				return(
					<span>{format(time*1000)}</span>
				)
			}
		}, {
			title: '内容',
			dataIndex: 'message',
			key: 'message',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Popconfirm title="确定通过审批？" onConfirm={handleConfirm(obj.id, 'pass')}>
							<a>通过审批</a>
						</Popconfirm>
						<span style={{marginLeft: 5}}></span>
						<Popconfirm title="确定不通过审批？" onConfirm={handleConfirm(obj.id, 'unpass')}>
							<a>不通过审批</a>
						</Popconfirm>
						<span style={{marginLeft: 5}}></span>
						<Popconfirm title="确定屏蔽消息？" onConfirm={handleConfirm(obj.id, 'unmessage')}>
							<a>屏蔽消息</a>
						</Popconfirm>
					</div>
				)
			}
		}]

		var dataSource = this.props.aduitList
		// dataSource.map(item => {
		// 	item['key']
		// })
		const selectedRowKeys = this.state.selectedRowKeys
		const rowSelection = {
			selectedRowKeys,
		    onChange: ::this.onSelectCheck.bind(this)
		}

		const params = this.props.aduitParams
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
			<div>
				{renderAduitToolbar}
				<Table 
					columns={columns}
					dataSource={dataSource}
					pagination={pagination}
					rowSelection={rowSelection}
				/>
			</div>
		)
	}

	render() {
		return(
			<div>{this.renderAduitTable()}</div>
		)
	}
}