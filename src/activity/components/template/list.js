import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'

import Select from 'antd/lib/select'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'

import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'

import AddModal from './addModal'
import EditModal from './editModal'
import SeeModal from './seeModal'

const FormItem = Form.Item
const Option = Select.Option

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
	      	const type = values.type
	      	const page = 1
	      	this.context.router.push({
				pathname: '/activity/template/list',
				query: {
					page: page,
					type: type
				}
			})
			this.props.actions.fetchTemplateList({page, type})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/template/list',
			query: query
		})
		this.props.actions.fetchTemplateList(query)
	}

	handleAdd(info) {
		this.props.actions.addTemplateList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
		})	
	}

	handleUpdate(info, id) {
		this.props.actions.updateTemplateList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_2: false, info: resolve.result })
		})	
	}

	handleRemove(id) {
		this.props.actions.delTemplateList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const typeProps = getFieldProps('type', {
			
		})
		const select = this.props.select.toJS()
		
		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["activity-template-add"]}>
						<Button onClick={() => {this.toggleModal(undefined, 'visible_1')}} type="primary">
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span> </span>
					<FormItem  label="类型：">
	    	        	<Select {...typeProps} size="large" placeholder="请选择类型" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			select.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
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
		const select = this.props.select.toJS()
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const toggleModal = (obj, visible, cb) => _ => {
			return this.toggleModal(obj, visible, cb)
		}

		const columns = [{
			title: '活动名称',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			render(type, obj) {
				const info = select.find(item => item.id == type)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '地址',
			dataIndex: 'url',
			key: 'url',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["activity-template-check"]}>
							<a onClick={toggleModal(obj, 'visible_3')} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["activity-template-update"]}>
							<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["activity-template-delete"]}>
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
		const select = this.props.select.toJS()
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<AddModal
					toggle={::this.toggleModal}
					select={select}
					visible={this.state.visible_1}
					addLoading={this.props.addLoading}
					handleAdd={::this.handleAdd}
					uploadFile={this.props.actions.uploadFile}
					fileLoading={this.props.fileLoading}
					assetsUrl={this.props.assetsUrl}
				/>
				<EditModal
					info={this.state.info}
					toggle={::this.toggleModal}
					select={select}
					visible={this.state.visible_2}
					updateLoading={this.props.updateLoading}
					handleUpdate={::this.handleUpdate}
					uploadFile={this.props.actions.uploadFile}
					fileLoading={this.props.fileLoading}
					assetsUrl={this.props.assetsUrl}
				/>
				<SeeModal
					info={this.state.info}
					toggle={::this.toggleModal}
					select={select}
					visible={this.state.visible_3}
					assetsUrl={this.props.assetsUrl}

				/>
			</div>
		)
	}
}