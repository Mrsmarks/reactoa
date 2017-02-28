import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'


import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import Select from 'antd/lib/select'
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

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/prize-rule/list',
			query: query
		})
		this.props.actions.fetchPrizeRuleList(query)
	}

	handleAdd(info) {
		this.props.actions.addPrizeRuleList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_2: false })
		})	
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const aid = values.aid
	      	const page = 1
	      	this.context.router.push({
				pathname: '/activity/prize-rule/list',
				query: {
					page: page,
					aid: aid
				}
			})
			this.props.actions.fetchPrizeRuleList({page, aid})
    	})
	}

	handleUpdate(info, id) {
		this.props.actions.updatePrizeRuleList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false, info: resolve.result })
		})	
	}

	handleRemove(id) {
		this.props.actions.delPrizeRuleList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	getEditSelect(visible, info) {
		this.props.actions.fetchPrizeRuleEditSelect().then(resolve => {
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
		const select = this.props.select.toJS().activityList
		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["activity-prize-rule-add"]}>
						<Button onClick={() => {this.getEditSelect('visible_2')}} type="primary">
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span style={{marginLeft: 5}}></span>
					<FormItem  label="活动类型：">
	    	        	<Select {...getFieldProps('aid')} size="large" placeholder="请选择活动" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			select.map(item => {
	    	        				return (
	    	        					<Option key={item.aid} value={item.aid+''}>{item.name}</Option>
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

		const getEditSelect = (visible, obj) => _ => {
			return this.getEditSelect(visible, obj)
		}

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '有效期类型',
			dataIndex: 'validity_type',
			key: 'validity_type',
			render(id, obj) {
				const info = select.validityType.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '是否使用兑换码',
			dataIndex: 'use_redeem_code',
			key: 'use_redeem_code',
			render(id, obj) {
				const info = select.redeemCode.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '是否使用白名单',
			dataIndex: 'use_white_list',
			key: 'use_white_list',
			render(id, obj) {
				const info = select.whiteList.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '是否使用黑名单',
			dataIndex: 'use_black_list',
			key: 'use_black_list',
			render(id, obj) {
				const info = select.balckList.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["activity-prize-rule-check"]}>
							<a onClick={getEditSelect('visible_3', obj)} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["activity-prize-rule-update"]}>
							<a onClick={getEditSelect('visible_1', obj)} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["activity-prize-rule-delete"]}>
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
					visible={this.state.visible_2}
					addLoading={this.props.addLoading}
					handleAdd={::this.handleAdd}
				/>
				<EditModal
					info={this.state.info}
					toggle={::this.toggleModal}
					select={select}
					visible={this.state.visible_1}
					addLoading={this.props.updateLoading}
					handleUpdate={::this.handleUpdate}
				/>
				<SeeModal
					info={this.state.info}
					toggle={::this.toggleModal}
					select={select}
					visible={this.state.visible_3}
				/>
			</div>
		)
	}
}