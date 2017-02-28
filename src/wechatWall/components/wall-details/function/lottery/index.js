import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classnames from 'classnames'
import styles from './index.scss'
import PreviewButton from 'wechatWall/components/wall-details/previewButton'

import Form from 'antd/lib/form'
const FormItem = Form.Item
import Radio from 'antd/lib/radio'
const RadioGroup = Radio.Group
import Button from 'antd/lib/button'
import Upload from 'antd/lib/upload'
import Icon from 'antd/lib/icon'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Popover from 'antd/lib/popover'
import Table from 'antd/lib/table'
import Modal from 'antd/lib/modal'
import Switch from 'antd/lib/switch'
import Row from 'antd/lib/row'
import Checkbox from 'antd/lib/checkbox'
import Select from 'antd/lib/select'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
const Option = Select.Option
import IconFont from 'Application/components/iconFont'
import Key from 'Application/decorators/key'

/**
 * 微信墙－摇奖
 */

@Form.create()
@Key(['content'])
export default class LotteryComp extends React.Component {
	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		password: PropTypes.string.isRequired,
		assetsUrl: PropTypes.string.isRequired,
		actions: PropTypes.object.isRequired,

		selectData: PropTypes.instanceOf(Immutable.Map).isRequired
	}

	static contextTypes = {
		getSid: PropTypes.func.isRequired
	}

	state = {
		modalVisible: false,

		editData: {},

		type: 'any',
		conditions: false,

		voteSelectId: -1,

		checkboxState: {
			sendMsg: false,
			shake: false,
			vote: false,
			money: false
		},

		prizeImg: ''
	}

	onTypeChange({ target: { value } }) {
		this.setState({
			type: value
		})
	}

	lotteryCondChange(conditions) {
		this.setState({
			conditions
		})
	}

	shownModal(editData) {

		if (Object.keys(editData).length) {
			this.setState({
				conditions: !!editData.conditions,
				type: editData.type,
				prizeImg: editData.imgurl,
				voteSelectId: editData.vote_id,
				checkboxState: {
					sendMsg: !!editData.minumum_msg,
					shake: !!editData.shake_id,
					vote: !!editData.vote_id,
					money: !!editData.money_id
				}
			})
			
		}
		this.setState({
			modalVisible: true,
			editData
		})
	}

	hideModal() {
		this.setState({
			modalVisible: false,

			editData: {},

			type: 'any',
			conditions: false,

			voteSelectId: -1,

			checkboxState: {
				sendMsg: false,
				shake: false,
				vote: false,
				money: false
			},

			prizeImg: ''
		})
		this.props.form.resetFields()

	}

	updateCheckbox(name, { target: { checked } }) {
		this.setState({
			checkboxState: Object.assign(this.state.checkboxState, {
				[name]: checked
			})
		})
	}

	uploadFile(file) {
		this.props.actions.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				prizeImg: resolve.result.file_url
			})
		})
	}

	handleDeletePrize(id) {
		const sid = this.context.getSid()
		const act = 'delete'
		this.props.actions.deletePrize({ id, sid, act }).then(response => message.success(response.errormsg))
	}

	handleSavePassword() {
		const password = this.props.form.getFieldValue('password')
		if (!password) {
			return message.error('请输入密码')
		}
		const sid = this.context.getSid()
		this.props.actions.updatePassword(password, sid).then(response => message.success(response.errormsg))
	}

	addPrize() {
		const { validateFields } = this.props.form

		const fields = ['award_name', 'prize_name', 'prize_total', 'take', 'conditions', 'type', 
							'minumum_msg', 'shake_id', 'vote_id', 'vote_option_id', 'money_id']
		validateFields(fields, (errors, values) => {
			if (errors) {
				return
			}

			if (!this.state.prizeImg) {
				return message.error('请选择奖品图片')
			}

			const postData = {
				imgurl: this.state.prizeImg,
				award_name: values.award_name,
				prize_name: values.prize_name,
				prize_total: values.prize_total,
				take: values.take,
				type: values.type
			}
			if (values.conditions) {
				postData.conditions = 1
				// 参与过互动的人
				if (values.type === 'contains') {
					let flag = 0
					if (this.state.checkboxState.sendMsg) {
						postData.minumum_msg = values.minumum_msg
						flag = 1
					}

					if (this.state.checkboxState.shake) {
						postData.shake_id = values.shake_id
						flag = 1
					}

					if (this.state.checkboxState.vote) {
						postData.vote_id = values.vote_id
						postData.vote_option_id = values.vote_option_id
						flag = 1
					}

					if (this.state.checkboxState.money) {
						postData.money_id = values.money_id
						flag = 1
					}

					if (!flag) {
						return message.error('请选择互动条件')
					}

				}
			}

			const sid = this.context.getSid()
			const act = Object.keys(this.state.editData).length ? 'update' : 'add'
			const id = this.state.editData.id
			this.props.actions.editPrize({
				postData,
				act,
				sid,
				id
			}).then(response => {
				message.success(response.errormsg)
				this.hideModal()
			})
		})
		
	}

	renderConditionsInfo(record) {
		
		return (
			<div className={styles['conditions-wrap']}>
				<h3 className={styles['conditions-title']}>参与抽奖条件</h3>
				{
					record.type === 'any' ? 
						<p style={{textIndent: '2em'}}>参与过任意互动的人</p> :
						<div>
							{
								record.minumum_msg ?
									<div className={styles['conditions-row']}>
										<IconFont type="icon-message"/> 至少发送{record.minumum_msg}条消息
									</div> : null
							}

							{
								record.shake_id ?
									<div className={styles['conditions-row']}>
										<IconFont type="icon-shake"/> 参与过 {record.shake_name || '任意' } 摇一摇
									</div> : null
							}

							{
								record.vote_id ?
									<div className={styles['conditions-row']}>
										<IconFont type="icon-vote"/> 参与过 {record.vote_name}
										{
											record.vote_option_id &&
												<span>{`投票的 ${record.vote_option_name || '任意'} 选项`}</span>
										}
									</div> : null
							}
							
							{
								record.money_id ?
									<div className={styles['conditions-row']}>
										<IconFont type="icon-money"/> 参与过 {record.money_name || '任意'} 数钱
									</div> : null
							}
							
							
						</div>
				}
				
			</div>
		)
	
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const columns = [{
			title: '预览',
			dataIndex: 'imgurl',
			key: 'url',
			render: url => {
				return (<img src={this.props.assetsUrl + url} style={{width: 100}}/>)
			}
		},{
			title: '奖项',
			dataIndex: 'award_name',
			key: 'awardName'
		}, {
			title: '奖品',
			dataIndex: 'prize_name',
			key: 'prizeName'
		}, {
			title: '奖品数量',
			dataIndex: 'prize_total',
			key: 'prizeTotal'
		}, {
			title: '参与抽奖条件',
			key: 'conditions',
			render: (_, record) => {
				return record.conditions == 1 ? 
					<div>
						<span>有</span>
						{' '}
						<Popover placement="left" content={this.renderConditionsInfo(record)} trigger="hover">
							<Icon type="info-circle-o" />
						</Popover>
						
					</div>
					: 
					<span>无</span>
					
			}
		}, {
			title: '操作',
			key: 'operate',
			render: (_, record) => {
				return (
					<div>
						<a onClick={this.shownModal.bind(this, record)}>编辑</a>
						{' '}
						<Popconfirm title="确认要删除该奖项吗？" onConfirm={this.handleDeletePrize.bind(this, record.id)}><a>删除</a></Popconfirm>
					</div>
				)
			}
		}]

		

		return (
			<Table 
				dataSource={dataSource}
				columns={columns}
				pagination={false}
				loading={this.props.loading}
			/>
		)
	}

	renderModal() {
		const formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 16
			}
		}

		const selectStyles = {
			style: {
				width: 160
			}
		}


		const conditions = !this.state.conditions
		const type = this.state.type !== 'contains'
		const disabledProps = {
			global: {
				disabled: conditions || type
			},

			sendMsg: {
				disabled: conditions || type || !this.state.checkboxState.sendMsg
			},
			shake: {
				disabled: conditions || type || !this.state.checkboxState.shake
			},
			vote: {
				disabled: conditions || type || !this.state.checkboxState.vote
			},
			voteSelect: {
				disabled: conditions || type || !this.state.checkboxState.vote
			},
			money: {
				disabled: conditions || type || !this.state.checkboxState.money
			}
		}

		const { getFieldProps } = this.props.form

		// 奖项名称
		const awardNameProps = getFieldProps('award_name', {
			initialValue: this.state.editData.award_name
		})

		// 奖品名称
		const prizeNameProps = getFieldProps('prize_name', {
			initialValue: this.state.editData.prize_name
		})

		// 奖项数量
		const prizeTotalProps = getFieldProps('prize_total', {
			initialValue: this.state.editData.prize_total
		})

		// 每次抽取数
		const prizeTakeProps = getFieldProps('take', {
			initialValue: this.state.editData.take
		})

		// 参与抽奖条件
		const prizeCondProps = getFieldProps('conditions', {
			valuePropName: 'checked',
			initialValue: this.state.conditions
		})


		// 条件类型｀参与过任意互动的人｀， ｀参与过以下互动的人｀
		const typeProps = getFieldProps('type', {
			initialValue: this.state.type
		})

		const sendMsgProps = getFieldProps('sendMsg', {
			valuePropName: 'checked',
			initialValue: this.state.checkboxState.sendMsg
		})

		const sendMsgTotalProps = getFieldProps('minumum_msg', {
			initialValue: this.state.editData.minumum_msg || 1
		})

		const shakeProps = getFieldProps('shake', {
			valuePropName: 'checked',
			initialValue: this.state.checkboxState.shake
		})

		const shakeNameProps = getFieldProps('shake_id', {
			initialValue: this.state.editData.shake_id || '-1'
		})

		const voteProps = getFieldProps('vote', {
			valuePropName: 'checked',
			initialValue: this.state.checkboxState.vote
		})

		const voteNameProps = getFieldProps('vote_id', {
			onChange: voteSelectId => this.setState({
				voteSelectId
			}),
			initialValue: this.state.editData.vote_id || '-1'
		})



		const voteOptionsProps = getFieldProps('vote_option_id', {
			initialValue: this.state.editData.vote_option_id || '-1'
		})

		const moneyProps = getFieldProps('money', {
			valuePropName: 'checked',
			initialValue: this.state.checkboxState.money
		})

		const moneyNameProps = getFieldProps('money_id', {
			initialValue: this.state.editData.money_id || '-1'
		})

		const fileProps = {
			accept: 'image/*',
			listType: 'picture',
			beforeUpload: this.uploadFile.bind(this),
			fileList: this.state.prizeImg ? [{
				status: 'done',
				uid: -1,
				url: this.props.assetsUrl + this.state.prizeImg
			}] : [],
			onPreview: file => {
				window.open(file.url)
			},
			onRemove: file => {
				this.setState({
					prizeImg: ''
				})
			}
		}

		return (
			<Modal
				visible={this.state.modalVisible}
				title={Object.keys(this.state.editData).length ? '编辑奖项' : '添加奖项'}
				onCancel={::this.hideModal}
				onOk={::this.addPrize}
				confirmLoading={this.props.editLoading}
			>
				<Form horizontal >
					<h3 className={styles['title']}>基本信息</h3>
					<FormItem
						label="奖品图片："
						{...formItemLayout}
					>
						<Upload {...fileProps}>
							<Button type="ghost">
								<Icon type="upload" /> 点击上传
							</Button>
						</Upload>
					</FormItem>
					<FormItem
						label="奖项名称："
						{...formItemLayout}
					>
						<Input {...awardNameProps}/>
					</FormItem>
					<FormItem
						label="奖品名称："
						{...formItemLayout}
					>
						<Input {...prizeNameProps}/>
					</FormItem>
					<FormItem
						label="奖项数量："
						{...formItemLayout}
					>
						<InputNumber min={1} {...prizeTotalProps}/>
					</FormItem>
					<FormItem
						label="每次抽取："
						{...formItemLayout}
					>
						<InputNumber min={1} {...prizeTakeProps}/> 人
					</FormItem>
					<h3 className={styles['title']}>
						参与抽奖条件 
						{' '}
						<Switch 
							{...prizeCondProps}
							onChange={::this.lotteryCondChange} 
							checkedChildren={<Icon type="check" />} 
							unCheckedChildren={<Icon type="cross" />} />
					</h3>
					<div className={styles['case']}>
						<RadioGroup 
							{...typeProps}
							disabled={!this.state.conditions} 
							onChange={::this.onTypeChange}>
							<Radio key="a" value="any">参与过任意互动的人</Radio>
							<Radio key="b" value="contains">参与过以下互动的人</Radio>
						</RadioGroup>
					</div>
					<div className={styles['wrap']}>

						<div className={styles['row']}>
							<Checkbox 
								{...sendMsgProps}
								{...disabledProps.global} 
								onChange={this.updateCheckbox.bind(this, 'sendMsg')}>
								发过消息
							</Checkbox>
							至少
							<InputNumber 
								{...sendMsgTotalProps}
								{...disabledProps.sendMsg} 
								min={1} 
								style={{width: 50}}/>
								{' '}条
						</div>

						<div className={styles['row']}>
							<Checkbox 
								{...shakeProps}
								{...disabledProps.global} 
								onChange={this.updateCheckbox.bind(this, 'shake')} 
								defaultChecked={false}>
								摇一摇
							</Checkbox>
							<Select 
								{...shakeNameProps} 
								{...disabledProps.shake} 
								{...selectStyles}>
								<Option key="-100" value="-1">任意摇一摇</Option>
								{this.props.selectData.get('shakeList').map(item =>
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('title')}</Option>
								)}
								
							</Select>
						</div>

						<div className={styles['row']}>
							<Checkbox 
								{...voteProps}
								{...disabledProps.global} 
								onChange={this.updateCheckbox.bind(this, 'vote')} 
								defaultChecked={false}>投&emsp;票
							</Checkbox>
							<Select {...voteNameProps} {...disabledProps.vote} {...selectStyles}>
								<Option key="-100" value="-1">任意投票</Option>
								{this.props.selectData.get('voteList').map(item =>
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
								)}
							</Select>
							{' '}
							<Select {...voteOptionsProps} {...disabledProps.vote} {...selectStyles}>
								<Option key="-100" value="-1">任意选项</Option>
								{this.props.selectData.get('voteList')
									.filter(item => item.get('id') == this.state.voteSelectId)
									.map(item => item.get('detail').map(item => 
										<Option key={item.get('id')} value={item.get('id')+''}>{item.get('text')}</Option>
									)
								)}
							</Select>
						</div>

						<div className={styles['row']}>
							<Checkbox 
								{...moneyProps}
								{...disabledProps.global} 
								onChange={this.updateCheckbox.bind(this, 'money')} 
								defaultChecked={false}>数&emsp;钱
							</Checkbox>
							<Select {...moneyNameProps} {...disabledProps.money} {...selectStyles} placeholder="">
								<Option key="-100" value="-1">任意数钱</Option>
								{this.props.selectData.get('moneyList').map(item =>
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('title')}</Option>
								)}
							</Select>
						</div>

					</div>
					
				</Form>
			</Modal>
		)
	}

	renderToolbar() {
		const tips = 
			<div>
				<p>参会者点击“互动-兑奖”可查询是否中奖；</p>
				<p>若中奖，则在反馈消息中同时收到“兑奖密码输入框”，</p>
				<p>工作人员将“兑奖密码”输入此框中，即可完成兑奖。</p>
			</div>

		const passwordProps = this.props.form.getFieldProps('password', {
			initialValue: this.props.password
		})

		return (
			<div className="toolbar">
				<Form inline >
					<Button type="primary" onClick={this.shownModal.bind(this, {})}>添加奖项</Button>
					<span style={{marginLeft: 16}}></span>
					<Popover placement="top" content={tips} trigger="hover">
						<span style={{verticalAlign: 'middle'}}><Icon type="question-circle-o" /></span>
					</Popover>
					{' '}
					<FormItem
						label="兑奖密码："
					>
						<Input {...passwordProps}/>
					</FormItem>
					<Button onClick={::this.handleSavePassword} loading={this.props.passwordLoading}>保存密码</Button>
				</Form>
			</div>
		)
	}

	render() {
		return (
			<div>
				<PreviewButton action="prize"/>
				{this.renderToolbar()}
				{this.renderTable()}
				{this.renderModal()}
			</div>
			
		)
	}
}