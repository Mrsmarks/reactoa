import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Tag from 'antd/lib/tag'
import Popover from 'antd/lib/popover'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Key from 'Application/decorators/key'
import Modal from 'antd/lib/modal'
import  EditModal  from "./editModal"
import Auth from 'Application/components/auth'
import message from 'antd/lib/message'
import onError from 'Application/decorators/onError'

const FormItem = Form.Item
const Option = Select.Option
@Key(['content'])
@Form.create()
@onError('fetchUserList')
export default class UserComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info: {},
			visible_1: false,
			visible_2: false,
			wechat_group: 1
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

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wechat/user/list',
			query: query
		})
		this.props.actions.fetchUserList(query)
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	const groupid = values.groupid
	      	const virtual_groupid = values.virtual_groupid
	      	const nickname = values.nickname
	      	this.context.router.push({
				pathname: '/wechat/user/list',
				query: {
					page: page,
					groupid: groupid,
					virtual_groupid: virtual_groupid,
					nickname: nickname
				}
			})
			this.props.actions.fetchUserList({page, groupid, virtual_groupid, nickname})
    	})
	}

	toggleModal(info, visible, group, cb) {
		if(visible == 'visible_2') this.props.form.resetFields()
		if(info) {
			if(cb) {
				cb(info)
			}
			this.setState({
				[visible]: !this.state[visible],
				info: info,
				wechat_group: group
			})
		}else{
			this.setState({
				[visible]: !this.state[visible],
			})
		}	
	}

	changeGroup(userid, groupid) {
		this.props.actions.updateWechatGroup(userid, groupid).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false,  info: resolve.result})
			this.props.actions.fetchUserList(this.context.location.query)
		})
	}

	changeVirtualGroup(userid, groupid) {
		this.props.actions.updateVirtualGroup(userid, groupid).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false,  info: resolve.result})
			this.props.actions.fetchUserList(this.context.location.query)
		})
	}

	exportData(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const nickname = values.nickname? values.nickname: ''
	      	const groupid = values.groupid? values.groupid: ''
	      	const virtual_groupid = values.virtual_groupid? values.virtual_groupid: ''
			window.location.href = `${this.props.backend_domain}/wechat/wechat-user/export?nickname=${nickname}&groupid=${groupid}&virtual_groupid=${virtual_groupid}`
    	})
	}

	checkUser(obj) {
		this.context.router.push({
			pathname: '/wechat/user/check',
			query: {
				id: obj.id
			}
		})
	}

	pullWechatUser() {
		const dataSource = this.props.content.toJS().filter(item => item.subscribe)
		var ids = this.props.form.getFieldValue('ids')
		var openids = []
		ids.forEach(item => {
			dataSource.forEach(item1 => {
				if(item == item1.id){
					openids.push(item1.openid)
				}
			})
		})
    	this.props.form.validateFields((errors, values) => {
    		const gid = values.gid
    		this.props.actions.pullWechatUser({ids, openids, gid}).then(resolve => {
				message.success(resolve.errormsg)
				this.setState({
					visible_2: false
				})
				this.props.actions.fetchUserList(this.context.location.query)
			}).catch(reject => {
				message.error(reject.err.errormsg)
			}) 
    	})
	}

	renderToolbar() {
		const select = this.props.select.toJS()
		const { getFieldProps } = this.props.form
			
		const groupIdProps = getFieldProps('groupid', {
			
		})

		const virtualProps = getFieldProps('virtual_groupid', {
			
		})

		const nicknameProps = getFieldProps('nickname', {

		})
		return (
			<div className="toolbar">
				<Form inline >
					{/*<Auth type="wechat-user-get-list">
						<Button onClick={::this.pullWechatUser} type="primary">
							<Icon type="plus" />
							拉取微信用户
						</Button>
					</Auth>*/}
					<span style={{marginLeft:5}}> </span>
					<FormItem  label="所属微信分组：">
	    	        	<Select {...groupIdProps}  placeholder="请选择分组" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
		    	        	{
		    	        		select.weixinGroup.map(item => {
		    	        			return(
		    	        				<Option key={item.id} value={item.id+''}>{item.name}</Option>
		    	        			)
		    	        		})
		    	        	}
	    	        	</Select>
		        	</FormItem>
		        	<FormItem  label="所属虚拟分组：">
	    	        	<Select {...virtualProps}  placeholder="请选择虚拟分组" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			select.virtualGroup.map(item => {
		    	        			return(
		    	        				<Option key={item.id} value={item.id+''}>{item.name}</Option>
		    	        			)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<FormItem  label="昵称：">
	    	        	<Input {...nicknameProps} type="text"/>
		        	</FormItem>
						<Button onClick={::this.handleSearch} type="primary" >
							<Icon type="search" />
							 查询
						</Button>
						<span style={{marginLeft:5}}> </span>
                        <Auth type={["wechat-user-export"]}>
    						<Button onClick={::this.exportData} type="ghost" >
    							<Icon type="eye" />
    							 导出当前数据
    						</Button>
                        </Auth>
						<span style={{marginLeft:5}}> </span>
                        <Auth type={["wechat-group-move-many-use"]}>
                            <Button onClick={this.toggleModal.bind(this, undefined, 'visible_2')} type="ghost" >
                                <Icon type="user" />
                                 批量拉取用户
                            </Button>
                        </Auth>
				</Form>				
			</div>
		)
	}

	renderPullUserModal() {
		const { getFieldProps } = this.props.form
		const dataSource = this.props.content.toJS().filter(item => item.subscribe)
		const select = this.props.select.toJS().weixinGroup
		const formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 18
			}
		}

		const content = (
			<Form horizontal >
		        <FormItem
		          {...formItemLayout}
		          label="用户："
		          disabled
		          hasFeedback
		          >
		            <Select 
		            	{...getFieldProps('ids')} 
		            	placeholder="请选择用户"
		            	multiple 
		            >
		          	  {
		          	  	dataSource.map(item => {
		          	  		return(
		          	  			<Option value={item.id+''} key={item.id+''}>{item.nickname}</Option>
		          	  		)
		          	  	})
		          	  }
		            </Select>
		        </FormItem>
		        <FormItem
		          {...formItemLayout}
		          label="微信分组："
		          hasFeedback
		          >
		          <Select 
		            placeholder="请选择用户"
		          	{...getFieldProps('gid')}>
	        			{
	        				select.map(item => {
	        					return (
	        							<Option key={item.id+''} value={item.id+''}>{item.name}</Option>
	        					)
	        				})
	        			}
	    	      </Select>
		        </FormItem>
			</Form>
		)
		return(
			<Modal 
				title='批量拉取用户'
				visible={this.state.visible_2}
				cancelText='返回'
				onCancel={this.toggleModal.bind(this, undefined, 'visible_2')}
				onOk={::this.pullWechatUser}
			>
				{content}
			</Modal>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const select = this.props.select.toJS().weixinGroup
		const params = this.props.params.toJS()
		const toggleModal = (obj, visible, fn) => _ => {
			return this.toggleModal(obj, visible, fn)
		}
		const checkUser = obj => _ => {
			return this.checkUser(obj)
		}
		const columns = [{
			title: '昵称',
			dataIndex: 'nickname',
			key: 'nickname'
		}, {
			title: '微信分组',
			dataIndex: 'wechat_groupid',
			key: 'wechat_groupid',
			render(groupId, obj){
				const tags = <div style={{width: 200}}>
					{
						(groupId+'').split(',').filter(item => item.id != 0).map(item1 => {
			    				var obj = {}
			    				select.forEach(item2 => {
				         			if(item2.id == item1) {
				         				obj = item2
				         			}
			         			})
			         			if(obj.id) {
			         				return (
				         				<div key={obj.id}>
				         					<Tag color="green">{obj.name}</Tag>
				         				</div>
				         			)
			         			}
			     			})
				
					}
					</div>
				return(
				 		<Popover  content={tags} title="微信分组">
				 			<a>查看详情</a>
				 		</Popover>
				 )
			}
				
		}, {
			title: '手机号',
			dataIndex: 'mobile',
			key: 'mobile',
		}, {
			title: '关注',
			dataIndex: 'subscribe',
			key: 'subscribe',
			render(subscribe) {
				const icon = !subscribe ? 'cross': 'check'
				return (
					<Icon type={icon}/>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["wechat-user-check"]}>
							<a onClick={checkUser(obj)}>查看</a>
						</Auth>
						<span style={{marginRight: 10}}></span>
						<Auth type={["wechat-user-update"]}>
							<a onClick={toggleModal(obj, 'visible_1', 1)}>修改微信分组</a>
						</Auth>
						<span style={{marginRight: 10}}></span>
                        <Auth type={["wechat-user-virtual-update"]}>
						  <a onClick={toggleModal(obj, 'visible_1', 0)}>修改虚拟分组</a>
                        </Auth>
					</div>
				)
			}
		}]

		const pagination = {
			total: params.count,
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
				loading={this.props.loading}
			/>
		)
	}

	render() {
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				{this.renderPullUserModal()}
				<EditModal
					info={this.state.info}
					group={this.state.wechat_group}
					visible={this.state.visible_1}
				    toggle={::this.toggleModal}
				    select={this.props.select}
				    changeGroup={::this.changeGroup}
				    changeVirtualGroup={::this.changeVirtualGroup}
				    changeLoading={this.props.changeLoading}
				/>
			</div>
		)
	}
}