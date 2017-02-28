import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'

import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'

import AddModal from './addModal'
import EditModal from './editModal'
import SeeModal from './seeModal'
import image404 from 'Application/resources/404.png'
const FormItem = Form.Item

@Key(['content'])
@Form.create()
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info:{},
			visible_1: false,
			visible_2: false,
			visible_3: false
		}
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

	toggleModal(info, visible, cb) {
		if(info) {
			if(cb) {
				cb(info)
			}
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

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const name = values.name
	      	const page = 1
	      	this.context.router.push({
				pathname: '/activity/support/list',
				query: {
					page: page,
					name: name
				}
			})
			this.props.actions.fetchSupportList({page, name})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/support/list',
			query: query
		})
		this.props.actions.fetchSupportList(query)
	}

	handleAdd(info) {
		this.props.actions.addSupportList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
		})	
	}

	handleUpdate(info, id) {
		this.props.actions.updateSupportList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_2: false, info: resolve.result })
		})	
	}

	handleRemove(id) {
		this.props.actions.delSupportList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const nameProps = getFieldProps('name', {
			
		})
		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["activity-sponsor-add"]}>
						<Button onClick={() => {this.toggleModal(undefined,'visible_1')}} type="primary">
							<Icon type="plus" />
							添加赞助方
						</Button>
					</Auth>
					<span> </span>
					<FormItem  label="名称：">
	    	        	<Input {...nameProps} type="text"/>
		        	</FormItem>
		        	<Button onClick={::this.handleSearch} >
						<Icon type="search" />
						查询
					</Button>
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const assetsUrl = this.props.assetsUrl
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const toggleModal = (obj, visible, cb) => _ => {
			return this.toggleModal(obj, visible, cb)
		}

		const columns = [{
			title: '赞助方名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: 'Logo',
			dataIndex: 'logo',
			key: 'logo',
			render(url, obj) {
				return(
					<img className='head-img'src={url? assetsUrl + url: image404}/>
				)
			}
		}, {
			title: '简介',
			dataIndex: 'profile',
			key: 'profile',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["activity-sponsor-check"]}>
							<a onClick={toggleModal(obj, 'visible_3')} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["activity-sponsor-update"]}>
							<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["activity-sponsor-delete"]}>
							<Popconfirm title="确定要删除吗？" onConfirm={handleRemove(obj.id)}>
								<a>删除</a>
							</Popconfirm>
						</Auth>
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
				<AddModal
					toggle={::this.toggleModal}
					visible={this.state.visible_1}
					addLoading={this.props.addLoading}
					handleAdd={::this.handleAdd}
					uploadFile={this.props.actions.uploadFile}
					fileLoading={this.props.fileLoading}
					assetsUrl={this.props.assetsUrl}
				/>
				<EditModal
					toggle={::this.toggleModal}
					visible={this.state.visible_2}
					updateLoading={this.props.updateLoading}
					handleUpdate={::this.handleUpdate}
					uploadFile={this.props.actions.uploadFile}
					fileLoading={this.props.fileLoading}
					assetsUrl={this.props.assetsUrl}
					info={this.state.info}				
				/>
				<SeeModal
					toggle={::this.toggleModal}
					visible={this.state.visible_3}
					info={this.state.info}
					assetsUrl={this.props.assetsUrl}					
				/>
			</div>
		)
	}
}