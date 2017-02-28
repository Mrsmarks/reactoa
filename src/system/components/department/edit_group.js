import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Button from 'antd/lib/button'
import Checkbox from 'antd/lib/checkbox'
import Radio from 'antd/lib/radio'
import Tree from 'antd/lib/tree'
import Select from 'antd/lib/select'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'
import Auth from 'Application/components/auth'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const TreeNode = Tree.TreeNode 
export default class AdminEditComp extends React.Component{

	constructor(props, context) {
		super(props, context)
		this.state = {
			obj: [],
			disabled: true,
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
		var list = this.state.obj
		list.forEach(item => {
			item.status = this.state[`auth_${item.id+''}`]|| item.status
		})
		var  obj = JSON.stringify(list)
		const id = this.context.location.query.dpid
		this.props.actions.updateDepartmentGroupRoleList(obj, id).then(resolve => {
			message.success(resolve.errormsg)
			this.context.router.push('/system/department/list')
		})
	}

	onChange(scope, e) {
		this.setState({
			[`auth_${scope}`]: e.target.value
		})
	}

	onCheck(info) {
		var obj = []
		if(this.state.disabled) {
			this.setState({
				disabled: false
			})
		}
		const groupList = this.props.groupList.toJS()
		groupList.forEach((group, index1) => {
			obj[index1] = {}
			obj[index1].id = group.id
			obj[index1].group = []
			obj[index1].status =  group.status
			if(!group.child) {
				group.child = []
			}
			group.child.forEach((child,index2) => {
				info.forEach(info => {
					if(info == child.id){
						obj[index1].group.push(info)
					}
				})
			})
		})
		this.setState({
			obj: obj
		})
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
						defaultCheckedKeys={checkList}
						onCheck={::this.onCheck}
					>
						{
							groupList.map(item => {
								const name = 
											 <span>
											 	{item.nick_name}
												<RadioGroup 
													defaultValue={item.status}
													style={{marginLeft: 20}} 
													onChange={this.onChange.bind(this, item.id+'')}
												>
													<Radio key={1} value={1}>全局</Radio>
													<Radio key={2} value={2}>局部</Radio>
												</RadioGroup>
											 </span>
								return (
									<TreeNode title={name} key={item.id}>
										{
											item.child.map(item => {
												return (
													<TreeNode title={item.name} key={item.id}/>	
												)
											})
										}
									</TreeNode>
								)
							})
						}
					</Tree>
					<div>
						<Auth type={["department-group-update"]}>	
							<Button style={{width:100}} onClick={::this.handleSubmit} type="primary" disabled={this.state.disabled}>提交</Button>
						</Auth>
						<Button style={{marginLeft:50,width:100}} onClick={() => {history.back()}} type="ghost">返回</Button>
					</div>
					
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