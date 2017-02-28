import styles from './headerNav.scss'
import Immutable from 'immutable'
import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Menu from 'antd/lib/menu'
import Dropdown from 'antd/lib/dropdown'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import IconFont from '../iconFont'

const FormItem = Form.Item

@Form.create()
export default class HeaderNav extends React.Component {
	static propTypes = {
		routes: PropTypes.any,
		actions: PropTypes.object.isRequired,
		user: PropTypes.instanceOf(Immutable.Map).isRequired,
		publicList: PropTypes.instanceOf(Immutable.List).isRequired,
		modifyPwdLoading: PropTypes.bool.isRequired
	}


	static contextTypes = {
		router: PropTypes.object.isRequired,
		history: PropTypes.object.isRequired,
		sideNav: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	state = {
		modalVisible: false
	}

	shownModal() {
		this.setState({
			modalVisible: true
		})
	}

	closeModal() {
		this.setState({
			modalVisible: false
		})
	}

	// 切换公众号和退出操作
	handleClick(e) {
		if (e.key === 'logout') {
			return this.logout()
		} else if (e.key === 'pwd') {
			return this.shownModal()
		}

		const obj = e.key.split('@')
		this.props.actions.changePublic(obj[0], obj[1]).then(x => {
			message.success(x.errormsg, 2, () => {
				window.location.reload()
			})
		})
	}

	logout() {
		const hide = message.loading('正在安全退出...', 0)
		this.props.actions.logout().then(x => {
			hide()
		}).catch(x => {
			hide()
		})
	}

	submitPassword() {
		this.props.form.validateFields((error, values) => {
			if (error) {
				return
			}
			const postData = {
				oldPass: values.oldPwd,
				newPass: values.password
			}

			this.props.actions.modifyPassword(postData).then(x => {
				message.success(x.errormsg)
				this.props.form.resetFields()
				this.closeModal()
			})
		})
	}

	checkPass(rule, value, callback) {
		const { validateFields } = this.props.form
		if (value) {
			validateFields(['rePasswd'])
		}
		callback()
	}

	checkPass2(rule, value, callback) {
		const { getFieldValue } = this.props.form
			if (value !== getFieldValue('password')) {
				callback('两次输入密码不一致！')
			} else {
				callback()
			}
	}

	renderPwdModal() {
		const formItemLayout = {
		    labelCol: { span: 5 },
		    wrapperCol: { span: 18 }
		}
		const { getFieldProps } = this.props.form

		const oldPwdProps = getFieldProps('oldPwd', {
			rules: [
				{ required: true, message: '请输入旧密码' }
			]
		})

		const passwdProps = getFieldProps('password', {
			rules: [
				{ required: true, min: 6, max: 20, whitespace: true, message: '请填写6-20位数的密码' },
				{ validator: ::this.checkPass }
			],
		})
		const rePasswdProps = getFieldProps('rePasswd', {
			rules: [
				{
					required: true,
					whitespace: true,
					min: 6,
					max: 20,
					message: '请填写6-20位数的密码'
				}, {
					validator: ::this.checkPass2
				}
			]
		})

		return (
			<Modal
				title="修改密码"
				visible={this.state.modalVisible}
				onCancel={::this.closeModal}
				onOk={::this.submitPassword}
				confirmLoading={this.props.modifyPwdLoading}
				width={400}
			>
				<Form horizontal >
					<FormItem  {...formItemLayout} label="旧密码："
						hasFeedback>
						<Input type="password" {...oldPwdProps}/>
					</FormItem>
					<FormItem  {...formItemLayout} label="新密码："
						hasFeedback>
						<Input type="password" {...passwdProps}/>
					</FormItem>
					<FormItem  {...formItemLayout} label="确认密码："
						hasFeedback>
						<Input type="password" {...rePasswdProps}/>
					</FormItem>
				</Form>
			</Modal>
		)
	}

	render() {
		const routes = this.props.routes
		const publicList = this.props.publicList.toJS()
		const menu = (
			<Menu
				onClick={::this.handleClick}
				style={{minWidth: 150}}
			>
				<Menu.Item disabled>切换公众号</Menu.Item>
				{
					publicList.map(item =>
						<Menu.Item key={item.id+'@'+item.nick_name}>
							{
								item.check ?
									<span style={{color: '#2db7f5', 'fontWeight': 'bold'}}>{item.nick_name}</span> :
									<span>{item.nick_name}</span> 
							}
						</Menu.Item>
					)
				}
				<Menu.Divider />
				<Menu.Item key="pwd"><Icon type="setting" />{' '}修改密码</Menu.Item>
				<Menu.Item key="logout"><Icon type="logout" />{' '}安全退出</Menu.Item>
			</Menu>
		)

		const user = this.props.user.toJS()
		const avatar = (user.username || 'A').substr(0, 1).toUpperCase()

		const currentPublic = this.props.publicList.toJS().filter(item => !!item.check)[0] || {}
		const channel = window.location.origin || `http://${window.location.host}`


        const map = {
            '微信': 'wechat',
            '微信墙': 'wechatWall',
            '活动': 'activity',
            '贺卡': 'card',
            '宜停车': 'park',
            '系统': 'system',
            '粤通卡': 'ytcard',
            '积分': 'integral',
            '尊师卡': 'teacher',
            '卡券系统': 'cardVoucher'
        }

		return (

			<div className={styles.wrapper}>
				
				<div className={styles.headerNav}>
					<div className={styles.user}>
						{
							user.open_yiqixiu == 1 ?
								<a title="微现场" href={`${channel}/home/yi-qi-xiu`} target="_blank" className={styles.xiu}>
									<IconFont type="icon-xiu" width="30" height="30"/>
								</a>
							: null
						}
						
						<div className={styles.info}>
							<div className={styles.dropdown}>
								<Dropdown overlay={menu} trigger={["click"]}>
									<a className="ant-dropdown-link">
										{user.username || '未知用户'} <Icon type="down" />
									</a>
								</Dropdown>
							</div>
							<div className={styles.name}>{currentPublic.nick_name}</div>
						</div>
						<div className={styles.avatar}>{avatar}</div>
					</div>
					<Menu 
						theme="dark" 
						mode="horizontal"
						selectedKeys={[this.context.sideNav.currentKey]}
						style={{lineHeight: '72px', paddingLeft: 240, fontSize: 14}}
					>
						{routes.map(item => 
							<Menu.Item key={item.key}>
                                <a href={`/${map[item.name]}.html#/index`}>{item.name}</a>
                            </Menu.Item>
						)}
					</Menu>
					
				</div>

				{this.renderPwdModal()}
			</div>
		)
		
	}
}