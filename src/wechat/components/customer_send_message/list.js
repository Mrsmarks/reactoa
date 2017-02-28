import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'
 
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Popconfirm from 'antd/lib/popconfirm'
import Select from 'antd/lib/select'
const Option = Select.Option
import message from 'antd/lib/message'
import Key from 'Application/decorators/key'

const FormItem = Form.Item

import Auth from 'Application/components/auth'

@Key(['content'])
@Form.create()
export default class CustomerMsgComp extends React.Component {
	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired,

		listLoading: PropTypes.bool.isRequired,

		selectData: PropTypes.instanceOf(Immutable.Map).isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	reload(query) {
		this.context.router.push({
			pathname: '/wechat/customer-send-message/list', 
			query
		})
		this.props.actions.fetchCustomerMsgList(query)
	}

	handleSearch() {
		const params = this.props.params
		const searchArgs = this.props.form.getFieldsValue(['searchName', 'searchUserType', 'searchMsgType'])
		const query = {
			name: searchArgs.searchName,
			msgtype: searchArgs.searchMsgType,
			usertype: searchArgs.searchUserType,
			page: params.get('page'),
			psize: params.get('psize')
		}

		this.reload(query)
	}

	onPageChange(nextPage, pageSize) {
		const params = this.props.params
		const query = {
			page: nextPage,
			psize: pageSize,
			name: params.get('name'),
			msgtype: params.get('msgtype'),
			usertype: params.get('usertype')
		}

		this.reload(query)
	}

	renderToolbar() {
		const selectData = this.props.selectData
		const params = this.props.params

		const { getFieldProps } = this.props.form
		const searchNameProps = getFieldProps('searchName', {
			initialValue: params.get('name')
		})
		const searchUserTypeProps = getFieldProps('searchUserType', {
			initialValue: params.get('usertype') ? +params.get('usertype') : undefined
		})
		const searchMsgTypeProps = getFieldProps('searchMsgType', {
			initialValue: params.get('msgtype')
		})

		return (
			<div className="toolbar">
				<Form inline>
					<Auth type={["wechat-customer-service-send-message-add"]}>
						<Link to="/wechat/customer-send-message/edit">
							<Button type="primary">
								<Icon type="plus" />
								添加
							</Button>
						</Link>
					</Auth>
					
					<span style={{marginLeft:5}}> </span>
					<FormItem  label="名称：">
	    	        	<Input {...searchNameProps} type="text"/>
		        	</FormItem>
					<FormItem  label="用户类型：">
						
	    	        	<Select {...searchUserTypeProps} size="large" placeholder="请选择类型" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
								selectData.get('userType').map(item => 
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
								)
							}
	    	        	</Select>
		        	</FormItem>
		        	<FormItem  label="消息类型：">
	    	        	<Select {...searchMsgTypeProps} size="large" placeholder="请选择类型" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
								selectData.get('messageType').map(item => 
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
								)
							}
	    	        	</Select>
		        	</FormItem>
						<Button type="primary" onClick={::this.handleSearch}>
							<Icon type="search" />
							查询
						</Button>	
				</Form>				
			</div>
		)
	}

	sendCustomerMsg(id) {
		this.props.actions.sendCustomerMsg(id).then(x => message.success(x.errormsg))
	}

	deleteCustomerMsg(id) {
		this.props.actions.deleteCustomerMsg(id).then(x => message.success(x.errormsg))
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const sendCustomerMsg = id => _ => {
			return this.sendCustomerMsg(id)
		}

		const deleteCustomerMsg = id => _ => {
			return this.deleteCustomerMsg(id)
		}

		const columns = [{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '发送类型',
			dataIndex: 'sendType',
			key: 'sendType',
		}, {
			title: '消息类型',
			dataIndex: 'msgtype',
			key: 'msgtype',
		}, {
			title: '发送操作',
			key: 'sendOperation',
			render(_, obj) {
				return (
					<Auth type={["wechat-customer-service-send-message-send"]}>
						<Button type="primary" size="small" onClick={sendCustomerMsg(obj.id)}>
							<Icon type="export"/>
							发送
						</Button>
					</Auth>
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
						<Auth type={["wechat-customer-service-send-message-check", "wechat-customer-service-send-message-edit"]}>
							<Link to={{pathname: '/wechat/customer-send-message/edit', query: { id: obj.id }}}>详情</Link>
						</Auth>
						{' '}
						<Auth type={["wechat-customer-service-send-message-delete"]} >
							<Popconfirm title="确认删除吗？" onConfirm={deleteCustomerMsg(obj.id)}>
								<a>删除</a>
							</Popconfirm>
						</Auth>
						
						
					</div>
				)
			}
		}]

		const params = this.props.params
		const pagination = {
			pageSize: +params.get('psize'),
			current: +params.get('page'),
			onChange: ::this.onPageChange,
			showSizeChanger: true,
			onShowSizeChange: ::this.onPageChange,
			total: +params.get('count'),
			showTotal: function() {
				return `共${params.get('count')}条`
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
			</div>
		)
	}
}