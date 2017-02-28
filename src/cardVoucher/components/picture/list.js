import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Form from 'antd/lib/form'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Popconfirm from 'antd/lib/popconfirm'
import Table from 'antd/lib/table'
import message from 'antd/lib/message'

import Key from 'Application/decorators/key'
@Key(['content'])
@Form.create()
export default class PictureComp extends React.Component {
	constructor(props, context) {
		super(props, context)
	}

	static propTypes = {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}


	addPic = () => {
		this.context.router.push({
			pathname:'/card-voucher/picture/add'
		})
	}

	handlePageChange = (nextPage, pageSize) => {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		console.log(query)
		this.context.router.push({
			pathname: '/card-voucher/picture/index',
			query:query
		})
		this.props.actions.fetchCardVoucherPhotos({ page:nextPage,psize:pageSize })
	}

	hanleCheck(id) {
		this.context.router.push({
			pathname:'/card-voucher/picture/check',
			query: {
				id:id
			}
		})
	}

	handleEidt(id) {
		this.context.router.push({
			pathname:'/card-voucher/picture/edit',
			query: {
				id: id
			}
		})
	}

	handleRemove(id) {
		this.props.actions.delCardVoucherPhotos(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	renderToolbar() {
        return (
        	<div className="toolbar">
        		<Button type="primary" onClick={this.addPic}>
        			<Icon type="plus"/>
        			添加
        		</Button>	
        	</div>	
        )
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		
		const hanleCheck = id => _ => {
			return this.hanleCheck(id)
		}

        const handleEidt = id => _ => {
        	return this.handleEidt(id)
        }

		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}
		const columns = [{
			title: '公众号',
			dataIndex: 'acid',
			key: 'acid',
			width: 150
		},{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		},{
			title: 'uniquekey',
			dataIndex: 'uniquekey',
			key: 'uniquekey'
		},{
			title: '微信地址',
			dataIndex: 'wechat_url',
			key: 'wechat_url'
		},{
			title: '操作',
			key: 'operation',
			width:150,
			render(_, obj){
				return(
					<div>
						<a style={{marginLeft: 5}} onClick={ hanleCheck(obj.id) }>查看</a>
						<a style={{marginLeft: 5}} onClick={ handleEidt(obj.id) }>编辑</a>
						<Popconfirm title="确定要删除吗？" onConfirm={ handleRemove(obj.id) }>
							<a style={{marginLeft: 5}}>删除</a>
						</Popconfirm>
					</div>
				)
			}
		}]

		const params = this.props.params.toJS()

		const pagination = {
			total: +params.count,
			current: +params.page,
			onChange: this.handlePageChange,
			showSizeChanger: true,
			pageSize: +params.psize,
			onShowSizeChange: this.handlePageChange,
			showTotal: function() {
				return `共${params.count}条`
			}.bind(this)
		}

		return(
			<Table
				dataSource={dataSource}
				columns={columns}
				pagination={ pagination }
				loading={this.props.loading} 
			/>
		)
	}

	render() {
		return(
			<div>
				{this.renderToolbar()}
				{this.renderTable()}	
			</div>		    	
		)
	}
}