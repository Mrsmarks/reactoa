import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select'
import Col from 'antd/lib/col'

import message from 'antd/lib/message'
import Auth from 'Application/components/auth'

import Radio from 'antd/lib/radio'
const RadioGroup = Radio.Group
import Tree from 'antd/lib/tree'
const TreeNode = Tree.TreeNode

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class AuthEditComp extends React.Component{
	static propTypes = {
		authPackageList: PropTypes.instanceOf(Immutable.List).isRequired,
		menuList: PropTypes.instanceOf(Immutable.List).isRequired,
		authDetails: PropTypes.instanceOf(Immutable.Map).isRequired,
		editId: PropTypes.any,
		actions: PropTypes.object.isRequired,
		userLevel: PropTypes.number.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {
		checked: []
	}

	specAuth = {}

	constructor(props) {
		super(props)
	}

	walkData(checkedAuth, list) {
		let ret = {
			match: false,
			auth: checkedAuth
		}
		list.forEach(item => {
			if (ret.auth.findIndex(x => x == item.auth) > -1) {
				ret.match = true
			} else if (item.child) {
				// 父节点没有被选中，检查所有的子节点有没被选中
				const parentAuth = item.auth
				const result = this.walkData(ret.auth, item.child)
				if (result.match) {
					ret.match = result.match
					ret.auth.push(parentAuth)
				}
			}
		})
		return ret
	}


	handleClick() {
		this.props.form.validateFields((errors, values) => {
			if (errors) {
				return
			}

			const menuList = this.props.menuList.toJS()

			const ret = this.walkData([...this.state.checked], menuList)
			const state = this.state

			for (let item in state) {
				if (ret.auth.findIndex(x => x === item) > -1) {
					ret.auth.push(state[item])
				}
			}
			for (let spec in this.specAuth) {
				if (ret.auth.findIndex(x => x === spec) > -1) {
					if (!state[spec]) {
						ret.auth.push(`${spec}_person`)
					} else {
						// 尝试删除其它两个权限
						const arr = [`${spec}_person`, `${spec}_free`, `${spec}_ignore`].filter(item => item !== state[spec])
						ret.auth = ret.auth.filter(item => item !== arr[0]).filter(item => item !== arr[1])
						ret.auth.push(state[spec])
					}
				}
			}

			const ary = Immutable.Set(ret.auth).toJS()
		//	if (Array.isArray(ary) && ary.length !== 0) {
				const postData = {
					name: values.name,
					remark: values.note,
					auth: ary.join(','),
					child_id: values.auth ? values.auth.join(',') : ''
				}
				const id = this.props.editId
				const act = id ? 'update' : 'add'
				this.props.actions.editAuthPackage(postData, act, id).then(x => {
					this.props.form.resetFields()
					// TODO 清空checkbox
					message.success(x.errormsg)
					window.router = this.context.router
					this.context.router.goBack()
				})
			// } else {
			// 	message.error('请选择权限', 3)
			// }

		})
	}

	handleChange(auth, e) {

		this.setState({
			[auth]: e.target.value
		})
	}

	onCheck(keys) {
		this.setState({
			checked: keys
		})
	}


	renderForm() {

		const formItemLayout = {
		    labelCol: { span: 4 },
		    wrapperCol: { span: 20 }
		}
		const authDetails = this.props.authDetails.toJS()
		let defaultCheckedKeys = authDetails.auth ? authDetails.auth.split(',') : []
		const _defaultCheckedKeys = defaultCheckedKeys.join('')

		const authPackageList = this.props.authPackageList.toJS()
		const menuList = this.props.menuList.toJS()
		// 根权限，微信／微信墙／宜停车等...
		const rootAuth = []

		const loop = data => data.map(item => {
			if (item.parent_id == 0 || (item.sub_level == 2)) {
				rootAuth.push(item.auth)
			}

			if (item.child) {
				let name = item.name
				// if (item.sub_level == 2 && this.props.userLevel === 2) {

				// 	const auth_1 = item.auth + '_person'
				// 	const auth_2 = item.auth + '_free'
				// 	const auth_3 = item.auth + '_ignore'

				// 	let defaultValue = ''
				// 	let find = item.auth

				// 	if (_defaultCheckedKeys.length) {
				// 		// TODO 可优化
				// 		if (_defaultCheckedKeys.indexOf(auth_1) > -1) {
				// 			//console.log(1)
				// 			//find = auth_1
				// 			defaultValue = auth_1
				// 		} else if (_defaultCheckedKeys.indexOf(auth_2) > -1) {
				// 			//console.log(2)
				// 			//find = auth_2
				// 			defaultValue = auth_2
				// 		} else if (_defaultCheckedKeys.indexOf(auth_3) > -1) {
				// 			//console.log(3)
				// 			//find = auth_3
				// 			defaultValue = auth_3
				// 		}
				// 	} else {
				// 		// 第一次点击checkbox，需要将右边的radio选中
				// 		const checkedKeys = this.state.checked.join(',')
				// 		if (new RegExp(item.auth, 'g').test(checkedKeys)) {
				// 			defaultValue = auth_1
				// 		}
				// 	}

				// //	console.log(this.state[item.auth] + '      mm     ' +defaultValue)

					
				// 	const radioGroupValue = (function(currentState) {
				// 		const state = Object.assign({}, currentState)
				// 		if (state[item.auth]) {
				// 			const checkedKeys = state.checked.join(',')
				// 			const reg = state[item.auth].split('_')[0]
				// 			if (!new RegExp(reg).test(checkedKeys)) {
				// 				delete currentState[item.auth]
				// 				return ''
				// 			}
				// 			return state[item.auth]
				// 		} else {
				// 			return defaultValue
				// 		}

				// 	})(this.state)
					



				// 	this.specAuth[find] = ''
					
				// 	name = 
				// 		<span>
				// 			{item.name}
				// 			<RadioGroup 
				// 				style={{marginLeft: 16}} 
				// 				onChange={this.handleChange.bind(this, item.auth)} 
				// 				value={radioGroupValue}
				// 			>
				// 				<Radio key={auth_1} value={auth_1}>可看不改</Radio>
				// 				<Radio key={auth_2} value={auth_2}>可看可改</Radio>
				// 				<Radio key={auth_3} value={auth_3}>不可看</Radio>
				// 			</RadioGroup>
				// 		</span>
				// }

				return (
					<TreeNode key={item.auth} title={name}>
						{loop(item.child)}
					</TreeNode>
				)
			}
			return <TreeNode key={item.auth} title={item.name}/>
		})

		const TreeChildren = loop(menuList)
		defaultCheckedKeys = defaultCheckedKeys.filter(item => 
			rootAuth.findIndex(item_2 => item_2 === item) === -1
		)

		const filterAuth = (data, parentAuth) => data.map(item => {
			if (item.level == 3) {
				if (defaultCheckedKeys.findIndex(item => item === item.auth) === -1) {
					defaultCheckedKeys = defaultCheckedKeys.filter(item => item !== parentAuth)
				}
			} else if (item.child) {
				filterAuth(item.child, item.auth)
			}
		})
		filterAuth(menuList)



		const { getFieldProps } = this.props.form
		
		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称' }
			],
			initialValue: authDetails.name
		})
		const noteProps = getFieldProps('note', {
			initialValue: authDetails.remark
		})
		let child_id = authDetails.child_id
		if (!child_id || !child_id.length) {
			child_id = undefined
		} else {
			child_id = child_id.split(',')
		}
		const authProps = getFieldProps('auth', {
			initialValue: child_id
		})




		return (
			<div className="pure-form">
				<Form horizontal>
					<FormItem  {...formItemLayout} label="名称："
						hasFeedback>
						<Input {...nameProps} type="text"/>
					</FormItem>
					<FormItem  {...formItemLayout} label="备注："
						hasFeedback>
						<Input {...noteProps} type="text"/>
					</FormItem>
					<FormItem  {...formItemLayout} label="权限包："
						hasFeedback>
						<Select
							{...authProps}
							multiple
						>
							{
								authPackageList.map(item =>
									<Option value={item.id+''} key={item.id}>{item.name}</Option>
								)
							}
						</Select>
					</FormItem>
					<FormItem  {...formItemLayout} label="权限："
						hasFeedback>
						<div style={{marginTop: -13}}>
							<Tree
								checkable
								onCheck={::this.onCheck}
								//checkedKeys={["ytc-coupon-check", "ytc-coupon", "ytc-coupon_person"]}
								defaultCheckedKeys={defaultCheckedKeys}
							>
								{TreeChildren}
							</Tree>
						</div>
					</FormItem>
					<FormItem  {...formItemLayout}>
					<Auth type={["system-auth-package-update"]}>
						<Col offset="5">
							<Button type="primary" size="large" loading={this.props.btnLoading} onClick={::this.handleClick}>确定</Button>
						</Col>
					</Auth>
					</FormItem>
				</Form>
			</div>
			
		)
	}

	componentDidMount() {
		const authDetails = this.props.authDetails.toJS()
		if (Object.keys(authDetails).length) {
			const checked = authDetails.auth.split(',')
			this.setState({
				checked
			})
		}
		
	}

	render() {
		return(
			<div>
				{this.renderForm()}
			</div>
		)
	}
}