import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
import onError from 'Application/decorators/onError'

import AddModal from './addModal'
import SeeModal from './seeModal'
import EditModal from './editModal'

const FormItem = Form.Item



@Key(['content'])
@Form.create()
@onError('fetchCustomMenuRuleList')
export default class CustomMenuRuleComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info: {},
			visible_1: false,
			visible_2: false,
			visible_3: false,
		}
	}

	static propTypes= {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		location: PropTypes.object.isRequired,
		router: PropTypes.object.isRequired
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

	handleAdd(info) {
		const params = this.props.params.toJS()
		this.props.actions.addCustomMenuRuleList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
			// this.props.actions.fetchCustomMenuRuleList({params: params.page})
		})	
	}

	handleUpdate(info, id) {
		const params = this.props.params.toJS()
		this.props.actions.updateCustomMenuRuleList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_3: false, info: resolve.result })
			// this.props.actions.fetchCustomMenuRuleList({params: params.page})
		})	
	}

	handleRemove(id) {
		const params = this.props.params.toJS()
		this.props.actions.delCustomMenuRuleList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
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
				pathname: '/wechat/custom-menu-rule/list',
				query: {
					page: page,
					name: name
				}
			})
			this.props.actions.fetchCustomMenuRuleList({page, name})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wechat/custom-menu-rule/list',
			query: query
		})
		this.props.actions.fetchCustomMenuRuleList(query)
	}

	syncCustomMenuRule(id) {
		this.props.actions.syncCustomMenuRule(id).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchCustomMenuRuleList(this.context.location.query)
		})
	}

	delSyncCustomMenuRule(id, menuid) {
		this.props.actions.delSyncCustomMenuRule(id, menuid).then(resolve => {
			message.success(resolve.errormsg)
		})
	}


	renderToolbar() {
		const select = this.props.select.toJS()
		const { getFieldProps } = this.props.form
			
		const nameProps = getFieldProps('name', {
			
		})
		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["wechat-menu-rule-add"]}>
						<Button type="primary" onClick={() => {this.toggleModal(undefined, 'visible_1')}}>
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>
					<FormItem  label="名称：">
	    	        	<Input {...nameProps} type="text"/>
		        	</FormItem>
						<Button onClick={::this.handleSearch} type="primary" >
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
		const toggleModal = (obj, visible, initChildSource) => _ => {
			return this.toggleModal(obj, visible, initChildSource)
		}
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const syncCustomMenuRule = id => _ => {
			return this.syncCustomMenuRule(id)
		}

		const delSyncCustomMenuRule = (id, menuid) => _ => {
			return this.delSyncCustomMenuRule(id, menuid)
		}
		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '备注',
			dataIndex: 'remark',
			key: 'remark'
		}, {
			title: '菜单包',
			dataIndex: 'menu_id',
			key: 'menu_id',
			render(id, obj) {
				const info = select.packageList.find(item => item.id == id)
				const name = info? info.name: ''
				return (
					<span>{name}</span>
				)
			}
		}, {
			title: '同步状态',
			dataIndex: 'sync_status',
			key: 'sync_status',
			render(id) {
				var status = ''
				switch(id) {
					case 1:
					status = '未同步'
					break
					case 2:
					status = '已同步'
					break
					case 3:
					status = '已修改需再次同步'
				}
				return (
					<span>{status}</span>
				)
			}
		}, {
			title: '同步操作',
			key: 'operationing',
			render(status, obj) {
				return (
					<div>
						<Auth type={["wechat-menu-rule-sync"]}>
							<a onClick={syncCustomMenuRule(obj.id)} style={{paddingRight:5}}>同步</a>
						</Auth>
						<span style={{marginLeft: 10}}></span>
						<Auth type={["wechat-menu-rule-del"]}
						>
							<a hidden={!obj.menuid} onClick={delSyncCustomMenuRule(obj.id, obj.menuid)} style={{paddingRight:5}}>删除</a>
						</Auth>
					</div>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				// const authConfig = {
				// 	dpid: obj.dpid,
				// 	nid: obj.nid,
				// 	cpid: obj.cpid,
				// 	uid: obj.create_user
				// }

				return (
					<div>
						<Auth type={["wechat-menu-rule-check"]}>
							<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["wechat-menu-rule-update"]}
						>
							<a onClick={toggleModal(obj, 'visible_3')} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["wechat-menu-rule-delete"]}
						>
							<Popconfirm title="确定要删除吗？" onConfirm={handleRemove(obj.id)}>
								<a hidden={obj.menuid}>删除</a>
							</Popconfirm>
						</Auth>
					</div>
				)
			}
		}]
		const params = this.props.params.toJS()
		const pagination = {
			total: params.count,
			current: params.page,
			onChange: ::this.handlePageChange,
			showSizeChanger: true,
			pageSize: params.psize,
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
				loading={this.props.loading}
			/>
		)
	}


	render() {
		const select = this.props.select.toJS()
		const cityList = this.props.cityList.toJS()
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<AddModal
					select={select}
					cityList={cityList}
					info={this.state.info}
					visible={this.state.visible_1}
					handleAdd={::this.handleAdd}
					fetchCityList={this.props.actions.fetchCityList}
					addLoading={this.props.addLoading}
					toggle={::this.toggleModal}
				/>
				<SeeModal 
					select={select}
					cityList={cityList}
					info={this.state.info}
					visible={this.state.visible_2}
					fetchCityList={this.props.actions.fetchCityList}
					toggle={::this.toggleModal}
				/>
				<EditModal 
					select={select}
					cityList={cityList}
					info={this.state.info}
					visible={this.state.visible_3}
					handleUpdate={::this.handleUpdate}
					fetchCityList={this.props.actions.fetchCityList}
					updateLoading={this.props.addLoading}
					toggle={::this.toggleModal}
				/>
			</div>
		)
	}
}