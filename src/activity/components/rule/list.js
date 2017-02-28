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

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/rule/list',
			query: query
		})
		this.props.actions.fetchRuleList(query)
	}

	handleAdd(info) {
		this.props.actions.addRuleList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
		})	
	}

	handleUpdate(info, id) {
		this.props.actions.updateRuleList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_2: false })
		})	
	}

	handleRemove(id) {
		this.props.actions.delRuleList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	toSettingRoute(id) {
		console.log(id)
		this.context.router.push({
			pathname: '/activity/setting/list',
			query: {
				aid:id,
			}
		})
	}

	getEditSelect(visible, info) {
		this.props.actions.fetchRuleEditSelect().then(resolve => {
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
		const typeProps = getFieldProps('type', {
			
		})
		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["activity-rule-add"]}>
						<Button onClick={() => {this.getEditSelect('visible_1')}} type="primary">
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
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

		const getEditSelect = (visible, obj) => _ => {
			return this.getEditSelect(visible, obj)
		}

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '规则类型类型',
			dataIndex: 'rule_type',
			key: 'rule_type',
			render(id, obj) {
				const info = option.ruleType.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '分享',
			dataIndex: 'open_share_rule',
			key: 'open_share_rule',
			render(id, obj) {
				const info = option.shareRule.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '白名单',
			dataIndex: 'open_white_list',
			key: 'open_white_list',
			render(id, obj) {
				const info = option.whiteList.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '黑名单',
			dataIndex: 'open_black_list',
			key: 'open_black_list',
			render(id, obj) {
				const info = option.blackList.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '关注',
			dataIndex: 'attention',
			key: 'attention',
			render(id, obj) {
				const info = option.attentionRule.find(item => item.id == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '手机绑定',
			dataIndex: 'bind_phone',
			key: 'bind_phone',
			render(id, obj) {
				const info = option.bindPhone.find(item => item.id == id)
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
						<Auth type={["activity-rule-check"]}>
							<a onClick={getEditSelect('visible_3', obj)} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["activity-rule-update"]}>
							<a onClick={getEditSelect('visible_2', obj)} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["activity-rule-delete"]}>
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
		const option = this.props.option.toJS()
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<AddModal
					toggle={::this.toggleModal}
					option={option}
					visible={this.state.visible_1}
					addLoading={this.props.addLoading}
					handleAdd={::this.handleAdd}
				/>
				<EditModal
					toggle={::this.toggleModal}
					info={this.state.info}
					option={option}
					visible={this.state.visible_2}
					updateLoading={this.props.updateLoading}
					handleUpdate={::this.handleUpdate}
				/>
				<SeeModal
					toggle={::this.toggleModal}
					info={this.state.info}
					option={option}
					visible={this.state.visible_3}
				/>
			</div>
		)
	}
}