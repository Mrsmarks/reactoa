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
				pathname: '/activity/management/list',
				query: {
					page: page,
					type: type
				}
			})
			this.props.actions.fetchManagementList({page, type})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/management/list',
			query: query
		})
		this.props.actions.fetchManagementList(query)
	}

	handleAdd(info) {
		this.props.actions.addManagementList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
		})	
	}

	handleUpdate(info, id) {
		this.props.actions.updateManagementList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_2: false })
		})	
	}

	handleRemove(id) {
		this.props.actions.delManagementList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	toSettingRoute(obj) {
		this.context.router.push({
			pathname: '/activity/setting/list',
			query: {
				aid:obj.id,
				type: obj.type
			}
		})
	}

	getEditSelect(visible, info) {
		this.props.actions.fetchManagementEditSelect().then(resolve => {
			if(info) {
				this.setState({
					[visible]: true,
					info: info,
				})
			}
			else{
				this.setState({
					[visible]: true,
				})
			}
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const option = this.props.option.toJS()
		const typeProps = getFieldProps('type', {
			
		})
		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["activity-manage-add"]}>
						<Button onClick={() => {this.getEditSelect('visible_1')}} type="primary">
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>					
					<FormItem  label="类型：">
	    	        	<Select {...typeProps} size="large" placeholder="请选择类型" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="">全部</Option>
	    	        		{
	    	        			option.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+""} >{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
						<Button onClick={::this.handleSearch}  >
							<Icon type="search" />
							 查询
						</Button>	
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const option = this.props.option.toJS()
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const getEditSelect = (visible, bool, obj) => _ => {
			return this.getEditSelect(visible, bool, obj)
		}

		const toUserGroup = obj => _ => {
			return this.toUserGroup(obj)
		}

		const toSettingRoute = id => _ => {
			return this.toSettingRoute(id)
		}

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			render(type, obj) {
				const info = option.find(item => item.id == type)
				const name = info? info.name: ''
				return (
					<span>{name}</span>
				)
			}
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
						<Auth type={["activity-manage-check-config"]}>
							<a onClick={toSettingRoute(obj)} style={{paddingRight:5}}>查看配置</a>
						</Auth>
						<Auth type={["activity-manage-check"]}>
							<a onClick={getEditSelect('visible_3', obj)} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["activity-manage-update"]}>
							<a onClick={getEditSelect('visible_2', obj)} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["activity-manage-delete"]}>
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
		const editSelect = this.props.editSelect.toJS()
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<AddModal
					visible={this.state.visible_1}
					handleAdd={::this.handleAdd}
					addLoading={this.props.addLoading}
					toggle={::this.toggleModal}
					editSelect={editSelect}
				/>

				<EditModal
					info={this.state.info}
					visible={this.state.visible_2}
					handleUpdate={::this.handleUpdate}
					updateLoading={this.props.updateLoading}
					toggle={::this.toggleModal}
					editSelect={editSelect}
				/>

				<SeeModal
					info={this.state.info}
					visible={this.state.visible_3}
					toggle={::this.toggleModal}
					editSelect={editSelect}
				/>
			</div>
		)
	}
}