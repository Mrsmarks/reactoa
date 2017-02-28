import React, { PropTypes } from 'react'

import Button from 'antd/lib/button'
import Radio from 'antd/lib/radio'
import Tree from 'antd/lib/tree'
import Form from 'antd/lib/form'
import message from 'antd/lib/message'
import Auth from 'Application/components/auth'
import Col from 'antd/lib/col'
import onError from 'Application/decorators/onError'
import Input from 'antd/lib/input'
const RadioGroup = Radio.Group
const FormItem = Form.Item
const TreeNode = Tree.TreeNode 

@Form.create()
@onError('getSystemGroup')
export default class AdminEditComp extends React.Component{

	constructor(props, context) {
		super(props, context)
		this.state = {
			obj: [],
			radio_check: false,
			count: 0
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			count: this.state.count + 1
		})
	}

	handleSubmit() {
		var list =  !this.state.radio_check? this.walkData(): this.state.obj
		list.forEach(item => {
			item.status = this.state[`auth_${item.id+''}`]|| item.status
		})
		var  wechat_account_auth = JSON.stringify(list)
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const name = values.name
			const id = this.context.location.query.id
			this.props.actions.updateSystemGroup({wechat_account_auth, name}, 'update', id).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push('/system/group/list')
			})
		})
	}

	onChange(scope, e) {
		this.setState({
			[`auth_${scope}`]: e.target.value
		})
	}

	eachList(list) {
		const checkList = []
		list.forEach(item => {
			if(!item.child) {
				item.child = []
			}else if(item.child.length > 0) {
				item.child.map(child => {
					if(child.check) {
						checkList.push(child.id.toString())
					}
				})
			}
		})
		return checkList
	}

	walkData(info) {
		var obj = []
		if(info) {
			this.setState({
				radio_check: true
			})
		}
		const { wechat_account_auth } = this.props.group.toJS()
		wechat_account_auth.forEach((group, index1) => {
			obj[index1] = {}
			obj[index1].id = group.acid
			obj[index1].group = []
			obj[index1].status =  group.status
			if(!group.child) {
				group.child = []
			}
			group.child.forEach((child,index2) => {
				if(info) {
					info.forEach(info => {
						if(info == child.id){
							obj[index1].group.push(info.split('-')[1])
						}
					})
				}else if(!info && child.check) {
					obj[index1].group.push(child.id.split('-')[1])
				}
			})
		})
		this.setState({
			obj: obj
		})
		return obj
	}


	renderTree() {
		const { name, wechat_account_auth } = this.props.group.toJS()
		const checkList = this.eachList(wechat_account_auth)
		const { getFieldProps } = this.props.form
		const formItemLayout = {
		    labelCol: { 
		    	span: 3 
		    },
		    wrapperCol: {
				span: 7
			}
		}
		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入群组名称'}
			],
			initialValue: name
		})
		
		if(wechat_account_auth.length > 0 && this.state.count >= 1) {
			return (
				<div style={{marginTop: 30}}>
					<Form horizontal>
						<FormItem 
							label="群组名称："
							{...formItemLayout}
						>
							<Input {...nameProps} />
						</FormItem>
					</Form>
					<Col offset={3}>
						<Tree 
							showLine 
							multiple 
							checkable
							defaultExpandAll
							defaultCheckedKeys={checkList}
							onCheck={::this.walkData}
						>
							{
								wechat_account_auth.map(item => {
									const name = 
												 (<span key={item.acid}>
												 	{item.acname}
													<RadioGroup 
														defaultValue={item.status}
														style={{marginLeft: 20}} 
														onChange={this.onChange.bind(this, item.acid)}
													>
														<Radio key={1} value={1}>全局</Radio>
														<Radio key={2} value={2}>局部</Radio>
													</RadioGroup>
												 </span>)
									return (
										<TreeNode disableCheckbox={this.state[`auth_${item.acid}`] == 1 || (!this.state[`auth_${item.acid}`] && item.status == 1) } title={name} key={item.id}>
											{
												item.child.map(item1 => {
													return (
														<TreeNode disableCheckbox={this.state[`auth_${item.acid}`] == 1 || (!this.state[`auth_${item.acid}`] && item.status == 1) } title={item1.name} key={item1.id}/>	
													)
												})
											}
										</TreeNode>
									)
								})
							}
						</Tree>
						<div style={{marginTop: 10}}>
							<Auth type={["system-group-update"]}>
								<Button style={{width:100}} onClick={::this.handleSubmit}  type="primary" >提交</Button>
							</Auth>
							<Button style={{marginLeft:50,width:100}} onClick={() => {history.back()}} type="ghost">返回</Button>
						</div>
					</Col>
				</div>
			)
		}
	}


	render() {
		return(
			<div>
				{this.renderTree()}
			</div>
		)
	}
}