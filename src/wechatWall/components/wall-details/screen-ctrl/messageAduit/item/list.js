import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Table from 'antd/lib/table'
import Popconfirm from 'antd/lib/popconfirm'

export default class MaskListComp extends React.Component {

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
		this.props.BlackNameList(query)
	}

	renderListTable() {
		const assetsUrl = this.props.assetsUrl
		const handleBan = (id) => _ => {
			return this.props.handleBan(id)
		}
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
			title: 'openID',
			dataIndex: 'openid',
			key: 'openid',
		},  {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return(
					<Popconfirm title="确定解锁？" onConfirm={handleBan(obj.id)}>
						<a>解除</a>
					</Popconfirm>
				)
			}
		}]		

		const dataSource = this.props.nameList
		const params = this.props.nameParams
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
				<Table 
					columns={columns}
					dataSource={dataSource}
				/>
			</div>
		)
	}

	render() {
		return(
			<div>{this.renderListTable()}</div>
		)
	}
}