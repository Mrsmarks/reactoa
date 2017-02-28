import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classnames from 'classnames'
import styles from './index.scss'
import PreviewButton from 'wechatWall/components/wall-details/previewButton'

import Form from 'antd/lib/form'
const FormItem = Form.Item
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Switch from 'antd/lib/switch'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Modal from 'antd/lib/modal'
import Radio from 'antd/lib/radio'
const RadioGroup = Radio.Group
import message from 'antd/lib/message'

const avatarTypeCircle = require('./avatar-type-circle.jpg')
const avatarTypeHeart = require('./avatar-type-heart.jpg')
const avatarTypeVs = require('./avatar-type-vs.jpg')

/**
 * 微信墙－对对碰
 */
@Form.create()
export default class MstchingComp extends React.Component {
	static propTypes = {
		mstching: PropTypes.instanceOf(Immutable.Map).isRequired
	}

	static contextTypes = {
		getSid: PropTypes.func.isRequired
	}

	constructor(props) {
		super(props)


		this.state = {
			modalVisible: false,

			...this.getProps(props)
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.mstching !== nextProps.mstching) {
			this.setState(this.getProps(nextProps))
		}
	}

	getProps(props) {
		return {
			isOpen: !!props.mstching.get('isOpen'),
			groupType: props.mstching.get('groupType'),
			crowd: props.mstching.get('crowd'),
			displayAvatar: props.mstching.get('displayAvatar'),
			leftName: props.mstching.get('leftName'),
			rightName: props.mstching.get('rightName')
		}
	}

	updateRadioState(name, { target: { value } }) {
		this.setState({
			[name]: value
		})
		if (name === 'groupType' && value === 2) {
			this.setState({
				crowd: 2
			})
		}
	}

	changeMstching(isOpen) {
		this.setState({
			isOpen
		})
		const sid = this.context.getSid()

		this.props.actions.updateMstchingStatus(+isOpen, sid).then(response => message.success(response.errormsg))
	}

	ruleChange(value) {
		this.setState({
			ruleValue: value
		})
	}

	handleSubmit() {

		const values = this.props.form.getFieldsValue(['custom_name_status', 'first_custom_name', 'second_custom_name',
							 'extract_type', 'head_sculpture_type'])

		if (values.custom_name_status == 2) {
			if (!values.first_custom_name || !values.second_custom_name) {
				return message.error('请输入自定义名称')
			}
		} else {
			delete values.first_custom_name
			delete values.second_custom_name
		}

		const sid = this.context.getSid()

		this.props.actions.updateMstching(values, sid).then(response => message.success(response.errormsg))
	}

	renderForm() {
		const formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 20
			}
		}

		const inputProps = {
			style: {
				width: 150,
				margin: '0 8px'
			}
		}

		const disabledProps = {
			input: {
				disabled: this.state.groupType === 1
			},
			crowd: {
				disabled: this.state.groupType === 2
			}
		}

		const { getFieldProps } = this.props.form
		const groupTypeProps = getFieldProps('custom_name_status', {
			initialValue: this.state.groupType
		})

		const leftNameProps = getFieldProps('first_custom_name', {
			initialValue: this.state.leftName
		})

		const rightNameProps = getFieldProps('second_custom_name', {
			initialValue: this.state.rightName
		})

		const crowdProps = getFieldProps('extract_type', {
			initialValue: this.state.crowd
		})

		const displayAvatarProps = getFieldProps('head_sculpture_type', {
			initialValue: this.state.displayAvatar
		})

		return (
			<div className="pure-form" hidden={!this.state.isOpen}>
				<Form horizontal >
					<FormItem
						label="组名称："
						{...formItemLayout}
					>
						<RadioGroup {...groupTypeProps} onChange={this.updateRadioState.bind(this, 'groupType')}>
							<Radio key="a" value={1}>男士、女士</Radio>
							<br />
							<Radio key="b" value={2}>
								自定义名称 
								<Input {...leftNameProps} {...inputProps} {...disabledProps.input}/>
								<Input {...rightNameProps} {...inputProps} {...disabledProps.input}/>
							</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem
						label="抽取人群："
						{...formItemLayout}
					>
						<RadioGroup onChange={this.updateRadioState.bind(this, 'crowd')} {...crowdProps}>
							<Radio {...disabledProps.crowd} key="a" value={1}>从所有上墙的人中抽取（在微信中填写过性别的才能参与）</Radio>
							<Radio key="b" value={2}>报名的人 (点击对对碰图标进行报名)</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem
						label="大屏幕展示头像："
						{...formItemLayout}
					>
						<RadioGroup onChange={this.updateRadioState.bind(this, 'displayAvatar')} {...displayAvatarProps}>
							<Radio key="a" value={1}> <img className={styles['type']} src={avatarTypeHeart} /> <span className={styles['type']}>心形</span></Radio>
							<br />
							<Radio key="b" value={2}> <img className={styles['type']} src={avatarTypeCircle} /> <span className={styles['type']}>圆形</span></Radio>
							<br />
							<Radio key="c" value={3}> <img className={styles['type']} src={avatarTypeVs} /> <span className={styles['type']}>对抗赛</span></Radio>
						</RadioGroup>
					</FormItem>

					<FormItem
						{...formItemLayout}
					>
                        <span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</span>
						<Button type="primary" loading={this.props.updateLoading} onClick={::this.handleSubmit}>提交</Button>
					</FormItem>
				</Form>

				
			</div>
		)
	}

	renderToolbar() {
		return (
			<div className="toolbar">
				对对碰{' '}
				<Switch 
					checkedChildren="开" 
					unCheckedChildren="关" 
					onChange={::this.changeMstching} 
					checked={this.state.isOpen}/>
			</div>
		)
	}

	render() {
		return (
			<div>
				<PreviewButton action="match"/>
				
				{this.renderToolbar()}
				{this.renderForm()}
				
			</div>
			
		)
	}
}