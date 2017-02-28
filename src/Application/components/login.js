import React, {PropTypes} from 'react'
import Immutable from 'immutable'
import styles from './login.scss'

import Button from 'antd/lib/button'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Alert from 'antd/lib/alert'

import message from 'antd/lib/message'

const FormItem = Form.Item

import { api } from '../utils/fetchApi'

@Form.create()
export default class LoginComp extends React.Component {

	static propTypes = {
		form: PropTypes.object.isRequired,
		loading: PropTypes.bool.isRequired,
		actions: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		routes: PropTypes.instanceOf(Immutable.List).isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {
		captcha: this.getCaptcha()
	}

	constructor(props) {
		super(props)
		this.handleKeydown = this.handleKeydown.bind(this)
	}

	login() {
		this.props.form.validateFields((error, values) => {
			if (error) {
				return
			}

			this.props.actions.login(values.username, values.password, values.captcha).then(ret => {
				message.success(ret.errormsg)
				setTimeout(() => {
					const routes = this.props.routes.toJS()
					if (!routes.length) {
						return message.error('操作失败，请联系管理员！')
					}

					// const state = this.props.location.state
					// 
					// let path = routes[0].path
					// if (state && state.redirect) {
					// 	path = state.redirect
					// }
					// 
					this.context.router.replace('/index')
				}, 1000)
			}).catch(x => {
				this.setCaptcha()
			})
		})
	}

	handleKeydown(e) {
		if (e.keyCode === 13) {
			this.login()
		}
	}

	getCaptcha() {
		return `${api}/admin/captcha?${Math.random().toString(36).substring(2, 7)}`
	}

	setCaptcha() {
		this.setState({
			captcha: this.getCaptcha()
		})
	}

	componentDidMount() {
		window.addEventListener('keydown', this.handleKeydown)
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKeydown)
	}

	render() {

		const formItemLayout = {
		    labelCol: { span: 6 },
		    wrapperCol: { span: 18 }
		}

		const { getFieldProps } = this.props.form

		const usernameProps = getFieldProps('username', {
			rules: [
				{ required: true, message: '请输入帐号' }
			],
			// initialValue: 'admin'
		})

		const passwordProps = getFieldProps('password', {
			rules: [
				{ required: true, message: '请输入密码' }
			],
			// initialValue: 'admin'
		})

		const captchaProps = getFieldProps('captcha', {
			rules: [
				{ required: true, message: '请输入验证码' }
			]
		})

		const state = this.props.location.state
		let alert = null
		if (state && state.message && state.type) {
			alert = <Alert message={state.message} type={state.type} showIcon/>
		}

		return(
			<div className={styles.container}>
				{/*<div className={styles.logo}></div>*/}

				<div className={styles.message}>
					{alert}
				</div>
				

				<div className={styles.login}>
					<Form horizontal>
						<FormItem
							{...formItemLayout}
							label="账号："
							hasFeedback
						>
							<Input {...usernameProps} type="text" placeholder="请输入账号"/>
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="密码："
							hasFeedback
						>
							<Input {...passwordProps} type="password" placeholder="请输入密码"/>
						</FormItem>
						
						<Row>
							<Col span="16">
								<FormItem
									label="验证码："
									labelCol={{ span: 9 }}
									wrapperCol={{ span: 15 }}
									hasFeedback
								>
									<Input {...captchaProps} type="text" placeholder="请输入验证码"/>
								 </FormItem>
							</Col>
							<Col span="7" offset="1">
								<img src={this.state.captcha} onClick={::this.setCaptcha} className={styles.captcha}/>
							</Col>
						</Row>
				        	
				        	
				       
						<Button 
							style={{width:288}} 
							type="primary" 
							size="large" 
							onClick={::this.login}
							loading={this.props.loading}
						>
							登录
						</Button>
						
					</Form>

					
				</div>
			</div>
		)
	}
}