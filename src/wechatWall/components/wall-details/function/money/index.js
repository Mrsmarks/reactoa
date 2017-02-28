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
import InputNumber from 'antd/lib/input-number'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Table from 'antd/lib/table'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'

const goldIco = require('./gold-ico.png')
const peopleCurrency = require('./peoper-currency.jpg')

/**
 * 微信墙－数钱
 */
@Form.create()
export default class MoneyComp extends React.Component {

	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		getSid: PropTypes.func.isRequired
	}

	constructor(props) {
		super(props)
		this.state = {
			modalVisible: false,
			editData: {}
		}
	}

	updateShape({ target: { value: shape } }) {
		this.setState({
			shape
		})
	}

	handleSave() {
		const values = this.props.form.getFieldsValue(['time', 'money', 'moneyType', 'title', 'rank', 'shape'])
		const postData = {
			title: values.title,
			top: values.rank,
			show_img: values.shape,
			time: values.time,
			num: values.money,
			currency: values.moneyType
		}

		const sid = this.context.getSid()
		const act = Object.keys(this.state.editData).length ? 'update' : 'add'
		const id = this.state.editData.id

		this.props.actions.saveMoneyInfo({ postData, act, sid, id }).then(response => {
			message.success(response.errormsg)
			this.hideModal()
			this.props.form.resetFields()
		})
	}

	handleRemove(id) {
		const sid = this.context.getSid()
		this.props.actions.deleteMoney({ id, act: 'delete', sid }).then(response => {
			message.success(response.errormsg)
		})
	}

	shownModal(record) {
		if (Object.keys(record).length) {
			this.setState({
				shape: record.show_img
			})
		}

		this.setState({
			modalVisible: true,
			editData: record
		})
	}

	hideModal() {
		this.setState({
			modalVisible: false,
			editData: {}
		})
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		
		const columns = [{
			title: '标题',
			dataIndex: 'title',
			key: 'title'
		}, {
			title: '玩法',
			dataIndex: 'play',
			key: 'play'
		}, {
			title: '操作',
			key: 'operate',
			render: (_, record) => {
				return (
					<div>
						<a onClick={this.shownModal.bind(this, record)}>详情</a>
						{' '}
						<Popconfirm title="确定要删除吗？" onConfirm={this.handleRemove.bind(this, record.id)}>
							<a>删除</a>
						</Popconfirm>
					</div>
				)
			}
		}]

		return (
			<div>
				<Table 
					dataSource={dataSource}
					columns={columns}
					pagination={false}
					loading={this.props.loading}
					onExpandedRowsChange={keys => this.setState({ expandedRowKeys: keys })}
					expandedRowKeys={this.state.expandedRowKeys || []}
				/>
				<br />
				<Button type="primary" onClick={this.shownModal.bind(this, {})}>添加数钱</Button>
			</div>
			
		)
	}

	renderModal() {
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 16
			}
		}



		const { getFieldProps } = this.props.form
		const editData = this.state.editData
		const timeProps = getFieldProps('time', {
			initialValue: editData.time
		})
		const moneyProps = getFieldProps('money', {
			initialValue: editData.num
		})
		const moneyTypeProps = getFieldProps('moneyType', {
			initialValue: editData.currency
		})
		const titleProps = getFieldProps('title', {
			initialValue: editData.title
		})
		const rankProps = getFieldProps('rank', {
			initialValue: editData.top
		})
		const shapeProps = getFieldProps('shape', {
			initialValue: this.state.shape
		})

		return (
			<Modal 
				visible={this.state.modalVisible}
				title={Object.keys(editData).length ? '修改' : '添加'}
				onOk={::this.handleSave}
				onCancel={::this.hideModal}
				confirmLoading={this.props.editLoading}
			>
				<h3 className={styles['title']}>游戏设置</h3>
				<Form horizontal >
					<FormItem
						label="时间："
						{...formItemLayout}
						validateStatus=""
						wrapperCol={{
							span: 6
						}}
					>
						<Input type="number" {...timeProps} addonAfter="秒" />
					</FormItem>
					<FormItem
						label="展示物金额："
						{...formItemLayout}
					>
						<InputNumber {...moneyProps}/>
						<Input style={{width: 80}} {...moneyTypeProps}/>
					</FormItem>
				</Form>

				<h3 className={styles['title']}>显示设置</h3>
				<Form horizontal >
					<FormItem
						label="游戏标题："
						{...formItemLayout}
					>
						<Input {...titleProps} style={{width: 300}}/>
					</FormItem>
					<FormItem
						label="游戏结果显示："
						{...formItemLayout}
						validateStatus=""
						wrapperCol={{
							span: 6
						}}
					>
						<Input type="number" addonBefore="前" addonAfter="名" {...rankProps}/>
						
					</FormItem>

					<FormItem
						label="展示物形象："
						{...formItemLayout}
					>
						<RadioGroup {...shapeProps} onChange={this.updateShape.bind(this)}>
							<Radio key="a" value={1}> <img className={styles['type']} src={peopleCurrency} /></Radio>
							<br />
							<div style={{marginTop: 8}}></div>
							<Radio key="b" value={2}> <img className={styles['type']} src={goldIco} /></Radio>
						</RadioGroup>
						
					</FormItem>
				</Form>
			</Modal>
		)
	}

	render() {
		return (
			<div>
				<PreviewButton action="money"/>
				{/*<div className="toolbar">
					<Switch checkedChildren="开" unCheckedChildre="关" {...hasLimitProps} onChange={::this.hasLimitChange}/>
					<span style={{marginLeft: 8}}></span>
					比赛结果的前<InputNumber {...topLevelProps} {...inputProps}/>名，不能参与之后<InputNumber {...afterRoundProps} {...inputProps}/>轮摇一摇
					<span style={{marginLeft: 16}}></span>
					<Button type="primary" loading={this.props.updateConfigLoading} onClick={::this.saveRules}>保存</Button>
				</div>*/}
				{this.renderTable()}
				{this.renderModal()}
			</div>
			
		)
	}
}