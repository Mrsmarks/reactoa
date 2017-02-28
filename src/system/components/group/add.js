import React, { PropTypes } from 'react'

import Button from 'antd/lib/button'
import Radio from 'antd/lib/radio'
import Tree from 'antd/lib/tree'
import Form from 'antd/lib/form'
import message from 'antd/lib/message'
import Auth from 'Application/components/auth'
import Col from 'antd/lib/col'
import Input from 'antd/lib/input'
import onError from 'Application/decorators/onError'

const RadioGroup = Radio.Group
const FormItem = Form.Item
const TreeNode = Tree.TreeNode 

@Form.create()
@onError('checkSystemGroup')
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

	handleSubmit() {
		var list = this.state.obj
		const groupList = this.props.info.toJS()
		if(!list.length) {
			groupList.forEach(item => {
				var x = {}
				x.status = this.state[`auth_${item.acid}`] || 2
				x.group = [],
				x.id = item.acid
				list.push(x)
			})
		}else{
			list.forEach(item => {
				item.status = this.state[`auth_${item.id+''}`]|| item.status || 2				
			})

		}
		var  wechat_account_auth = JSON.stringify(list)
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const name = values.name
			this.props.actions.updateSystemGroup({wechat_account_auth, name}, 'add').then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push('/system/group/list')
			})
		})
	}

	onChange(scope, e) {
		this.setState({
			[`auth_${scope}`]: e.target.value,
			disabled: false
		})
	}

	onCheck(info) {
		var obj = []
		const groupList = this.props.info.toJS()
		if(this.state.disabled){
			this.setState({
				disabled: false
			})
		}
		groupList.forEach((item, index1) => {
			obj[index1] = {}
			obj[index1].id = item.acid
			obj[index1].group = []
			item.group.forEach((child,index2) => {
				info.forEach(info => {
					if(info == `child-${child.id}`){
						obj[index1].group.push(info.replace(/child-/, ''))
					}
				})
			})
		})
		this.setState({
			obj: obj
		})
	}

	renderTree() {	
		const groupList = this.props.info.toJS()
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
		})
		if(groupList.length > 0) {
			return (
				<div style={{marginTop: 30}}>
					<Form horizontal>
						<FormItem 
							label="群组名称："
							{...formItemLayout}
						>
							<Input {...nameProps} style={{width: 300}}/>
						</FormItem>
					</Form>
					<Col offset={3}>
						<Tree 
							showLine 
							multiple 
							checkable 
							defaultExpandAll
							onCheck={::this.onCheck}
						>
							{
								groupList.map(item => {
									const name = 
												 (<span key={item.acid}>
												 	{item.acname}
													<RadioGroup
														defaultValue={2}
														style={{marginLeft: 20}} 
														onChange={this.onChange.bind(this, item.acid)}
													>
														<Radio key={1} value={1}>全局</Radio>
														<Radio key={2} value={2}>局部</Radio>
													</RadioGroup>
												 </span>)
									return (
										<TreeNode disableCheckbox={this.state[`auth_${item.acid}`] == 1} title={name} key={item.acname}>
											{
												item.group.map(item1 => {
													return (
														<TreeNode disableCheckbox={this.state[`auth_${item.acid}`] == 1} title={item1.name} key={`child-${item1.id}`}/>	
													)
												})
											}
										</TreeNode>
									)
								})
							}
						</Tree>
						<div style={{marginTop: 10}}>
							<Button style={{width:100}} onClick={::this.handleSubmit}  type="primary" >提交</Button>
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