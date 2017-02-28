import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Switch from 'antd/lib/switch'
import Tabs from 'antd/lib/tabs'
import Popconfirm from 'antd/lib/popconfirm'
import Table from 'antd/lib/table'
import Menu from 'antd/lib/menu'
import Key from 'Application/decorators/key'
import AuditComp from './item/audit'
import MaskListComp from './item/list'
import UnpassComp from './item/unpass'
import WallComp from './item/wall'
import message from 'antd/lib/message'

const FormItem = Form.Item
const Option = Select.Option
const TabPane = Tabs.TabPane
const MenuItem = Menu.Item
/**
 * 微信墙－屏幕控制-消息审核
 */
@Key(['aduitList'])
@Form.create()
export default class ScreenComp extends React.Component {

	constructor(props, context) {
		super(props, context)
		this.state = {
			current_key: ''
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		getSid: PropTypes.func.isRequired
	}

	updateMessageAduitSetting(checked, type) {
		this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	if(type == 'msg_auth') {
	      		values.msg_auth = +checked
	      		values.msg_sensitive = +values.msg_sensitive
	      	}
	      	if(type == 'msg_sensitive') {
	      		values.msg_sensitive = +checked
	      		values.msg_auth = +values.msg_auth
	      	}
	      	const id = this.context.location.query.id
			this.props.actions.updateMessageAduitSetting({...values, id}).then(resolve => {
				message.success(resolve.errormsg)
			})
    	})
	}

	freshData() {
		const query = this.context.location.query
		if(query.item == 'nameList') {
			this.props.actions.BlackNameList(query).then(resolve => {
				message.success('刷新成功！')
			})
		}else{
			this.props.actions.MessageAduitList(query).then(resolve => {
				message.success('刷新成功！')
			})
		}
	}

	toWordsRoute() {
		const query = this.context.location.query
		this.context.router.push({
			pathname: '/wall-details/screen-ctrl-word/index',
			query: {
				...query
			}
		})
	}


	renderToolbar() {
		if(!this.props.pending) {
			const { getFieldProps } = this.props.form
			const auth_status = this.props.auth_status
			const msg_sensitive = this.props.msg_sensitive
			const msg_auth = this.props.msg_auth
			const authProps = getFieldProps('msg_auth', {
				initialValue: +msg_auth,
				onChange: (checked) => {this.updateMessageAduitSetting(checked, 'msg_auth')}
			})

			const sensitiveProps = getFieldProps('msg_sensitive', {
				initialValue: +msg_sensitive,
				onChange: (checked) => {this.updateMessageAduitSetting(checked, 'msg_sensitive')}
			})
			return (
				<div className="toolbar">
					<Form inline >
						<FormItem>
							<Button type="primary" size="small" onClick={::this.freshData}>
								<Icon type="reload" />
								刷新消息
							</Button>
						</FormItem>
						<span style={{marginLeft: 5}}></span>
						<FormItem label="人工审核：">
							<Switch  {...authProps}  defaultChecked={+msg_auth} checkedChildren="开" unCheckedChildren="关" />
						</FormItem>
						<span style={{marginLeft: 5}}></span>
						<FormItem label="敏感词过滤：">
							<Switch {...sensitiveProps}   defaultChecked={+msg_sensitive} checkedChildren="开" unCheckedChildren="关" />
							<span style={{marginLeft: 5}}></span>
							<Button size="small" onClick={this.toWordsRoute.bind(this)}>
								<Icon type="filter" />
								设置敏感词过滤
							</Button>
						</FormItem>
					</Form>				
				</div>
			)
		}
	}

	handleConfirm(id, type) {
		switch(type) {
			case 'pass':
			this.props.actions.passAduit(id).then(resolve => {
				message.success(resolve.errormsg)
				this.props.actions.MessageAduitList({...this.context.location.query})
			})
			break

			case 'unpass':
			this.props.actions.unPassAduit(id).then(resolve => {
				message.success(resolve.errormsg)
				this.props.actions.MessageAduitList({...this.context.location.query})
			})
			break

			case 'unmessage':
			this.props.actions.unMessageAduit(id).then(resolve => {
				message.success(resolve.errormsg)
				this.props.actions.MessageAduitList({...this.context.location.query})
			})

		}
	}

	handleBan(id) {
		this.props.actions.unBanAduit(id).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.BlackNameList({...this.context.location.query})
		})
	}

	
	renderMenu() {
		const { id, uniqueId, wallName } = this.context.location.query
		const item = this.context.location.query.item || 'aduit'
		return(
			<Menu
				mode="horizontal"
				selectedKeys={[item]}
			>
				<MenuItem key="aduit">
					<Link to={{ pathname: '/wall-details/screen-ctrl-message/index/audit', query:{id, uniqueId, wallName, item: 'aduit', auth_status: '0'}}}>
						<Icon type="eye-o" />待审核
					</Link>
				</MenuItem>

				<MenuItem key="wall">
					<Link to={{ pathname: '/wall-details/screen-ctrl-message/index/wall', query:{id, uniqueId, wallName, item: 'wall', auth_status: '1'}}}>
						<Icon type="area-chart" />已上墙
					</Link>
				</MenuItem>

				<MenuItem key="unpass">
					<Link to={{ pathname: '/wall-details/screen-ctrl-message/index/unpass', query:{id, uniqueId, wallName, item: 'unpass', auth_status: '2'}}}>
						<Icon type="cross-circle-o" />未通过
					</Link>
				</MenuItem>

				<MenuItem key="nameList">
					<Link to={{ pathname: '/wall-details/screen-ctrl-message/index/nameList', query:{id, uniqueId, wallName, item: 'nameList'}}}>
						<Icon type="solution" />屏蔽名单
					</Link>
				</MenuItem>

			</Menu>
		)
	}

	renderTable() {
		const item = this.context.location.query.item || 'aduit'
		const tables = {
			'aduit': (<AuditComp 
						aduitList={this.props.aduitList.toJS()}
						aduitItems={this.props.actions.aduitItems}
						aduitParams={this.props.aduitParams.toJS()}
						MessageAduitList={this.props.actions.MessageAduitList}
				      	assetsUrl={this.props.assetsUrl}
				      	loading={this.props.loading}
				      	handleConfirm={::this.handleConfirm}
					  />),
			'wall': (<WallComp
						wallList={this.props.wallList.toJS()}
						wallParams={this.props.wallParams.toJS()}
						MessageAduitList={this.props.actions.MessageAduitList}
				      	assetsUrl={this.props.assetsUrl}
				      	loading={this.props.loading}
				      	handleConfirm={::this.handleConfirm}
				      	option={this.props.option}
					 />),
			'unpass': (<UnpassComp
				      	 unpassList={this.props.unpassList.toJS()}
						 unpassParams={this.props.unpassParams.toJS()}
						 MessageAduitList={this.props.actions.MessageAduitList}
				      	 assetsUrl={this.props.assetsUrl}
				      	 loading={this.props.loading}
				      	 handleConfirm={::this.handleConfirm}
				      	 option={this.props.option}
					   />),
			'nameList': (<MaskListComp
							nameList={this.props.nameList.toJS()}
			      			assetsUrl={this.props.assetsUrl}
							nameParams={this.props.nameParams.toJS()}
							BlackNameList={this.props.actions.BlackNameList}
			      			loading={this.props.loading}
			      			handleBan={::this.handleBan}
						 />),
		}
		return(
			<div style={{marginTop:10}}>
				{tables[item]}
			</div>
		)
	}


	render() {
		const formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 20
			}
		}

		return (
			<div>
				{this.renderToolbar()}
				{this.renderMenu()}
				{this.renderTable()}
			</div>
			
		)
	}
}