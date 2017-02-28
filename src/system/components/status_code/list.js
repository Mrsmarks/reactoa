import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Popconfirm from 'antd/lib/popconfirm'
import Key from 'Application/decorators/key'
import message from 'antd/lib/message'
import Auth from 'Application/components/auth'

import AddModal from './addModal'
import EditModal from './editModal'
const FormItem = Form.Item


@Key(['content'])
@Form.create()
export default class ManagementComp extends React.Component{

	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired,
		listLoading: PropTypes.bool.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	constructor(props, context) {
		super(props, context)
		this.state = {
			visible_1: false,
			visible_2: false,
			info: {}
		}
	}

	handleSearch(e) {
		const {getFieldValue} = this.props.form
		e.preventDefault()

      	const page = 1
      	const code =  getFieldValue('errorcode')
      	this.context.router.push({
			pathname: '/system/status-code/list',
			query: {
				page: page,
				code: code
			}
		})
		this.props.actions.fetchStatusCodeList({page, code})
    	
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/system/status-code/list',
			query: query
		})
		this.props.actions.fetchStatusCodeList(query)
	}

	toggleModal(info, visible) {
		if(info) {
			this.setState({
				[visible]: !this.state[visible],
				info: info
			})
		}else{
			this.setState({
				[visible]: !this.state[visible],
			})
		}	
	}

	handleAdd(info) {
	
		this.props.actions.addStatusCodeList(info).then(reslove => {
			if(reslove.errorcode == 0) {
				this.setState({visible_1: false, info: {}})
				message.success(reslove.errormsg)
			}
		})
	
	}

	handleUpdate(id, info) {
		
		this.props.actions.updateStatusCodeList(id, info).then(reslove => {
			if(reslove.errorcode == 0) {
				this.setState({visible_2: false, info: reslove.result})
				message.success(reslove.errormsg)
			}

		})
		
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		
		return (
			<div className="toolbar">
				<Form inline>
					<Button  onClick={() => {this.toggleModal(undefined, 'visible_1')}}type="primary">
						<Icon type="plus" />
						添加
					</Button>
					<span style={{marginLeft: 5}}></span>
		        	<FormItem  label="状态码：">
	    	        	<Input {...getFieldProps('errorcode')} type="text" />
		        	</FormItem>
					<Button onClick={this.handleSearch.bind(this)}  type="ghost" >
						<Icon  type="search" />
						 查询
					</Button>	
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const toggleModal = (obj, visible) => _ => {
			this.toggleModal(obj, visible)
		}
		const columns = [{
			title: '错误码',
			dataIndex: 'code',
			key: 'code'
		}, {
			title: '错误说明',
			dataIndex: 'msg',
			key: 'msg'
		}, {
			title: '操作',
			key: 'operation',
			render(status, obj) {
				return (
					<div>
						<a onClick={toggleModal(obj, 'visible_2')}style={{paddingRight:5}}>修改</a>
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
				pagination={pagination}
				loading={this.props.listLoading}
			/>
		)
	}


	render() {
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<AddModal
					visible={this.state.visible_1}
					toggle={::this.toggleModal}
					handleAdd={::this.handleAdd}
					addLoading={this.props.addLoading}
				/>
				<EditModal
					visible={this.state.visible_2}
					toggle={::this.toggleModal}
					handleUpdate={::this.handleUpdate}
					info={this.state.info}
					updateLoading={this.props.updateLoading}
				/>
			</div>
			
		)
	}
}