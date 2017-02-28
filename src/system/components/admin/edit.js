import React, { PropTypes } from 'react'


import Button from 'antd/lib/button'

import Radio from 'antd/lib/radio'
import Tree from 'antd/lib/tree'


import Form from 'antd/lib/form'
import message from 'antd/lib/message'
import Auth from 'Application/components/auth'
import onError from 'Application/decorators/onError'

const RadioGroup = Radio.Group

const TreeNode = Tree.TreeNode
@onError('fetchGroupRoleList')
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

	handleSubmit() {
		var list =  !this.state.radio_check? this.walkData(): this.state.obj
		list.forEach(item => {
			item.status = this.state[`auth_${item.id+''}`]|| item.status
		})
		var  obj = JSON.stringify(list)
		const id = this.context.location.query.id
		this.props.actions.updateGroupRoleList(obj, id).then(resolve => {
			message.success(resolve.errormsg)
			this.context.router.push('/system/admin/list')
		})
	}

	onChange(scope, e) {
		this.setState({
			[`auth_${scope}`]: e.target.value
		})
	}

	walkData(info) {
		var obj = []
		if(info) {
			this.setState({
				radio_check: true
			})
		}
		const groupList = this.props.groupList.toJS()
		groupList.forEach((group, index1) => {
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
		const groupList = this.props.groupList.toJS()
		const checkList = this.eachList(groupList)
		if(groupList.length > 0 && this.state.count == 1) {
			return (
				<div style={{marginTop: 30,marginLeft: 30}}>
					<Tree 
						showLine 
						multiple 
						checkable 
						defaultExpandAll
						defaultCheckedKeys={checkList}
						onCheck={::this.walkData}
					>
						{
							groupList.map(item => {
								const name = 
											 <span key={item.acid}>
											 	{item.acname}
												<RadioGroup 
													defaultValue={item.status}
													style={{marginLeft: 20}} 
													onChange={this.onChange.bind(this, item.acid)}
												>
													<Radio key={1} value={1}>全局</Radio>
													<Radio key={2} value={2}>局部</Radio>
												</RadioGroup>
											 </span>
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
					<Auth type={["admin-group-edit"]}>
						<div>
							<Button style={{width:100}} onClick={::this.handleSubmit}  type="primary">提交</Button>
							<Button style={{marginLeft:50,width:100}} onClick={() => {history.back()}} type="ghost">返回</Button>
						</div>
					</Auth>
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