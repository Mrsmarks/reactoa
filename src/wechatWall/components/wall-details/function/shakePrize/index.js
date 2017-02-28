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
import Switch from 'antd/lib/switch'
import Table from 'antd/lib/table'
import Modal from 'antd/lib/modal'
import Popover from 'antd/lib/popover'
import InputNumber from 'antd/lib/input-number'
import Input from 'antd/lib/input'
import Tabs from 'antd/lib/tabs'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'

const TabPane = Tabs.TabPane
import IconFont from 'Application/components/iconFont'

/**
 * 微信墙－摇大奖
 */
@Form.create()
export default class ShakePrizeComp extends React.Component {
	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		assetsUrl: PropTypes.string.isRequired
	}

	static contextTypes = {
		getSid: PropTypes.func.isRequired
	}

	state = {
		repeat: 0,

		addPartialVisible: {},
		editPartialModalVisible: false,

		expandedRowKeys: [0],

		activityAward: 'gift',
		modifyPrizeRecord: {},

		giftDataSource: [],
		moneyDataSource: [],
		recordInfo: {}
	}

	componentWillReceiveProps(nextProps) {

		if (!this.state.isInit) {
			this.setState({
				isInit: true,
				repeat: nextProps.repeat
			})
		}
	}

	setVisible(name, v) {
		this.setState({
			[name]: v
		})

		if (v === false) {
			switch(name) {
				case 'editPartialModalVisible':
					this.setState({
						activityAward: 'gift',
						giftPreviewURL: '',
						moneyPreviewURL: '',
						modifyPrizeRecord: {}
					})
					break
			}
		}

		
	}

	onAwardChange(key) {
		this.setState({
			activityAward: key
		})
	}

	saveAward() {
		/*
		const prizeNameProps = getFieldProps('prizeName')

		const prizeCountProps = getFieldProps('prizeCount')

		const prizeDescProps = getFieldProps('prizeDesc')

		const moneyPwdProps = getFieldProps('moneyPwd')

		const moneyProps = getFieldProps('money')
		 */
		
		const {
			modifyPrizeRecord,
			activityAward,
			giftDataSource,
			moneyDataSource
		} = this.state

		const values = {
			giftDataSource: this.props.form.getFieldsValue(['prize_name', 'acount', 'option']),
			moneyDataSource: this.props.form.getFieldsValue(['moneyPwd', 'moneySum'])
		}
		
		// 修改数据
		if (Object.keys(modifyPrizeRecord).length) {
			const dataSource = activityAward === 'gift' ? 'giftDataSource' : 'moneyDataSource'
			this.setState({
				[dataSource]: this.state[dataSource].map(item => {
					if (item.key === modifyPrizeRecord.key) {
						values[dataSource].imgurl = this.state.giftPreviewURL
						values[dataSource].key = item.key
						values[dataSource].id = item.id
						return values[dataSource]
					}
					return item
				})
			})
		} else {
		// 新增数据
			if (activityAward === 'gift') {
				values.giftDataSource.key = Math.random()
				values.giftDataSource.imgurl = this.state.giftPreviewURL
				this.setState({
					giftDataSource: [...giftDataSource, values.giftDataSource]
				})
			} else {
				
				values.moneyDataSource.key = Math.random()
				this.setState({
					moneyDataSource: [...moneyDataSource, values.moneyDataSource]
				})
			}
		}

		

		this.setVisible('editPartialModalVisible', false)
		this.props.form.resetFields(['prize_name', 'acount', 'option', 'moneyPwd', 'moneySum'])

	}

	shownModifyPrizeModal(record, activityAward) {
		this.setVisible('editPartialModalVisible', true)
		this.setState({
			activityAward,
			modifyPrizeRecord: record,
			giftPreviewURL: record.imgurl
		})
	}

	handleRemoveGiftPrize(key) {
		this.setState({
			giftDataSource: this.state.giftDataSource.map(item => {
				if (item.key == key) {
					item.act = 'delete'
				}
				return item
			})
		})
	}

	handleRemoveMoneyPrize(key) {
		this.setState({
			moneyDataSource: this.state.moneyDataSource.map(item => {
				if (item.key == key) {
					item.act = 'delete'
				}
				return item
			})
		})
	}

	// 实物奖品列表
	renderPrizeTable_gift({ operate, dataSource = [] }) {
		dataSource = dataSource.filter(item => item.act !== 'delete')

		const columns = [{
			title: '图片',
			dataIndex: 'imgurl',
			key: 'imgurl',
			render: url => <img style={{height: 50}} src={this.props.assetsUrl + url} />
		}, {
			title: '名称',
			dataIndex: 'prize_name',
			key: 'name'
		}, {
			title: '发放数量',
			dataIndex: 'acount',
			key: 'acount'
		}, {
			title: '领取说明',
			dataIndex: 'option',
			key: 'option'
		}]

		if (operate) {
			columns.push({
				title: '操作',
				key: 'operate',
				render: (_, record) => {
					return (
						<div>
							<a onClick={this.shownModifyPrizeModal.bind(this, record, 'gift')}>修改</a>
							{' '}
							<Popconfirm title="确定要删除该奖项吗？" onConfirm={this.handleRemoveGiftPrize.bind(this, record.key)}>
								<a>删除</a>
							</Popconfirm>
							
						</div>
					)
				}
			})
		}

		return (
			<div>
				<h3 className={styles['table-title']}>实物</h3>
				{
					dataSource.length ?
						<Table 
							dataSource={dataSource}
							columns={columns}
							pagination={false}
							bordered
						/> :
						<p className={styles['noData']}>暂无数据</p>
				}
				
			</div>
			
		)
	}

	// 虚拟奖品列表
	renderPrizeTable_money({ operate, dataSource = [] }) {

		dataSource = dataSource.map(item => {
			return {
				...item,
				prize_name: item.prize_name || item.moneyPwd,
				acount: item.acount || item.moneySum
			}
		}).filter(item => item.act !== 'delete')

		const columns = [{
			title: '支付宝口令',
			dataIndex: 'prize_name',
			key: 'moneyPwd'
		}, {
			title: '红包金额',
			dataIndex: 'acount',
			key: 'moneySum'
		}]

		if (operate) {
			columns.push({
				title: '操作',
				key: 'operate',
				render: (_, record) => {
					return (
						<div>
							<a onClick={this.shownModifyPrizeModal.bind(this, record, 'money')}>修改</a>
							{' '}
							<Popconfirm title="确定要删除该奖项吗？" onConfirm={this.handleRemoveMoneyPrize.bind(this, record.key)}>
								<a>删除</a>
							</Popconfirm>
						</div>
					)
				}
			})
		}

		return (
			<div>
				<h3 className={styles['table-title']}>现金红包</h3>
				{
					dataSource.length ?
						<Table 
							dataSource={dataSource}
							columns={columns}
							pagination={false}
							bordered
						/> :
						<p className={styles['noData']}>暂无数据</p>
				}
			</div>
			
		)
	}

	uploadFile(url, file) {
		const hide = message.loading('正在上传...')
		this.props.actions.uploadFile(file).then(resolve => {
			hide()
			message.success(resolve.errormsg)
			this.setState({
				[url]: resolve.result.file_url
			})
		})
	}

	// 添加摇大奖
	addPrize() {
		this.props.form.validateFields(['title', 'time'], (error, values) => {
			if (error) {
				return
			}

			const giftList = this.state.giftDataSource.map(item => {
				return {
					name: item.prize_name,
					image: item.imgurl,
					acount: item.acount,
					option: item.option,
					id: item.id,
					type: 1,
					act: item.act
				}
			})

			const moneyList = this.state.moneyDataSource.map(item => {
				return {
					type: 2,
					id: item.id,
					acount: item.moneySum || item.acount,
					name: item.moneyPwd || item.prize_name,
					act: item.act
				}
			})

			const postData = {
				...values,
				prize: JSON.stringify([
					...giftList,
					...moneyList
				])
			}

			const act = Object.keys(this.state.recordInfo).length ? 'update' : 'add'
			const id = this.state.recordInfo.id
			const sid = this.context.getSid()

			// return 

			this.props.actions.saveShakePrize({ act, postData, sid, id }).then(response => {
				message.success(response.errormsg)
				this.hideAddPartial()
			})

		})
	}

	renderEditPartialModal() {
		const formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 20
			}
		}
		const formItemLayout_2 = {
			labelCol: {
				span: 7
			},
			wrapperCol: {
				span: 17
			}
		}

		const uploadProps = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this, 'giftPreviewURL'),
			fileList: this.state.giftPreviewURL ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.giftPreviewURL
			}] : [],
			onRemove: () => {
				this.setState({
					giftPreviewURL: ''
				})
			}
		}

		const modifyPrizeRecord = this.state.modifyPrizeRecord
		const hasEditRecord = !!Object.keys(modifyPrizeRecord).length
		const { getFieldProps } = this.props.form
		const prizeNameProps = getFieldProps('prize_name', {
			initialValue: modifyPrizeRecord.prize_name
		})

		const prizeCountProps = getFieldProps('acount', {
			initialValue: modifyPrizeRecord.acount
		})

		const prizeDescProps = getFieldProps('option', {
			initialValue: modifyPrizeRecord.option
		})

		const moneyPwdProps = getFieldProps('moneyPwd', {
			initialValue: modifyPrizeRecord.moneyPwd || modifyPrizeRecord.prize_name
		})

		const moneyProps = getFieldProps('moneySum', {
			initialValue: modifyPrizeRecord.moneySum || modifyPrizeRecord.acount
		})

		return (
			<Modal
				visible={this.state.editPartialModalVisible}
				title={'添加奖项'}
				onCancel={this.setVisible.bind(this, 'editPartialModalVisible', false)}
				onOk={::this.saveAward}
				width={680}
				zIndex={1031}
			>
				<Tabs 
					activeKey={this.state.activityAward}
					onChange={::this.onAwardChange}>
					<TabPane tab={<span>实物奖品</span>} key="gift" disabled={hasEditRecord && this.state.activityAward !== 'gift'}>
						<div className={styles['wrap']}>
							<div className={styles['preview']}>
								<div className={styles['preview-img']}></div>
							</div>
							<div className={styles['form']}>
								<Form horizontal >
									
									<FormItem
										label="奖品名称："
										{...formItemLayout}
									>
										<Input {...prizeNameProps}/>
									</FormItem>
									<FormItem
										label="奖品图片："
										{...formItemLayout}
									>
										<Upload {...uploadProps}>
											<Icon type="plus" />
											<div className="ant-upload-text">上传照片</div>
										</Upload>
									</FormItem>

									<FormItem
										label="发放数量："
										{...formItemLayout}
									>
										<InputNumber {...prizeCountProps}/>
									</FormItem>
									<FormItem
										label="领取说明："
										{...formItemLayout}
									>
										<Input type="textarea" rows="5" {...prizeDescProps}/>
									</FormItem>
								
								</Form>
							</div>
						</div>
					</TabPane>
					<TabPane tab={<span>现金红包</span>} key="money" disabled={hasEditRecord && this.state.activityAward !== 'money'}>
						<div className={styles['wrap']}>
							<div className={styles['preview']}>
								<div className={styles['preview-img']}></div>
							</div>
							<div className={styles['form']}>
								<Form horizontal >
									<FormItem
										label="支付宝红包口令："
										{...formItemLayout_2}
									>
										<Input {...moneyPwdProps}/>
									</FormItem>
									<FormItem
										label="单个金额："
										{...formItemLayout_2}
									>
										<InputNumber {...moneyProps}/>
									</FormItem>
								</Form>
							</div>
						</div>
					</TabPane>
				</Tabs>
			</Modal>
		)
	}

	renderPrizeForm() {
		const formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 20
			}
		}

		const { getFieldProps } = this.props.form

		const titleProps = getFieldProps('title', {
			initialValue: this.state.recordInfo.title,
			rules: [{
				required: true, message: '请输入摇大奖标题'
			}]
		})

		const timeProps = getFieldProps('time', {
			initialValue: this.state.recordInfo.time,
			rules: [{
				required: true, type: 'number', message: '请输入摇大奖时间'
			}]
		})


		return (
			<div className="pure-form">
				<Form horizontal >
					<FormItem
						label="摇大奖标题："
						{...formItemLayout}
					>
						<Input {...titleProps}/>
					</FormItem>
					<FormItem
						label="摇大奖时间："
						{...formItemLayout}
					>
						<InputNumber {...timeProps} min={1}/>
                        秒
					</FormItem>
					<FormItem
						label="摇大奖奖项："
						{...formItemLayout}
					>
						<Button onClick={this.setVisible.bind(this, 'editPartialModalVisible', true)}>添加奖项</Button>
					</FormItem>
				</Form>
				
				{/*实物奖品列表*/}
				{this.renderPrizeTable_gift({
					operate: true,
					dataSource: this.state.giftDataSource
				})}
				
				{/*虚拟奖品列表*/}
				{this.renderPrizeTable_money({
					operate: true,
					dataSource: this.state.moneyDataSource
				})}
				<div className={styles['prize-form-btns']}>
					<Button onClick={::this.hideAddPartial}>关闭</Button>
					{' '}
					<Button type="primary" onClick={::this.addPrize}>{Object.keys(this.state.recordInfo).length ? '更新' : '添加'}</Button>
				</div>
			</div>
		)
	}

	shownAddPartial({ visibleKey, record }) {
        // 
		// const addPartialVisible = this.state.addPartialVisible
		// addPartialVisible[visibleKey] = true
		this.setState({
			addPartialVisible: {[visibleKey]: true},
			recordInfo: record,
			giftDataSource: record.giftList || [],
			moneyDataSource: record.moneyList || []
		})
	}
	hideAddPartial() {
		this.setState({
			recordInfo: {},
			addPartialVisible: {},
			giftDataSource: [],
			moneyDataSource: []
		})

        this.props.form.resetFields(['title', 'time'])
	}

	handleRemovePrize(id) {
		const sid = this.context.getSid()
		this.props.actions.deleteShakePrize({ id, act: 'delete' }).then(response => message.success(response.errormsg))
	}

	renderAddPartial(button, visibleKey) {
		return (
			<Popover 
				content={this.renderPrizeForm.bind(this)()} 
				trigger="click" 
				placement="rightTop" 
				visible={!!this.state.addPartialVisible[visibleKey]}
				getTooltipContainer={() => document.getElementById('shake-prize')}>

				{button}
			</Popover>
		)
	}

	renderRow(record) {
		return (
			<div>
				{this.renderPrizeTable_gift({
					operate: false,
					dataSource: record.giftList
				})}
				{this.renderPrizeTable_money({
					operate: false,
					dataSource: record.moneyList
				})}
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()

		const columns = [{
			title: '标题',
			dataIndex: 'title',
			key: 'title'
		}, {
			title: '时间',
			dataIndex: 'time',
			key: 'time'
		}, {
			title: '奖项类型',
			dataIndex: 'awardType',
			key: 'awardType',
			render(_, record) {
				const ret = []
				if (record.moneyList.length) {
					ret.push('红包')
				}
				if (record.giftList.length) {
					ret.push('实物')
				}

				return ret.length === 2 ? ret.join('和') : ret.join('')
			}
		}, {
			title: '奖项总数',
			dataIndex: 'awardCount',
			key: 'awardCount',
			render(_, record) {
				return record.moneyList.length + record.giftList.length + '个'
			}
		}, {
			title: '操作',
			key: 'operate',
			render: (_, record) => {
				return (
					<div>
						{
							this.renderAddPartial(
								<a onClick={this.shownAddPartial.bind(this, { visibleKey: record.key, record })}>修改</a>,
								record.key
							)
						}
						{' '}
						<Popconfirm title="确定要删除吗？" onConfirm={this.handleRemovePrize.bind(this, record.id)}>
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
					expandedRowRender={record => this.renderRow(record)}
					onExpandedRowsChange={keys => this.setState({ expandedRowKeys: [keys[1] || keys[0]] })}
					expandedRowKeys={this.state.expandedRowKeys}
					pagination={false}
				/>
			</div>
			
		)
	}

	renderToolbar() {
		const repeatShakeProps = this.props.form.getFieldProps('repeat', {
			valuePropName: 'checked',
			initialValue: !!this.state.repeat,
			onChange: repeat => {
				const sid = this.context.getSid()
				this.props.actions.updateShakePrizeConfig({ sid, repeat }).then(response => {
					this.setState({
						repeat
					})
					message.success(response.errormsg)
				})

				
			}
		})

		return (
			<div className="toolbar">
				允许重复摇中奖品{' '}<Switch checkedChildren="开" unCheckedChildren="关" {...repeatShakeProps}/>
			</div>
		)
	}

	render() {
		

		return (
			<div id="shake-prize">
				<PreviewButton action="bigprize"/>
				{this.renderToolbar()}
				{this.renderTable()}
				<br />
				{this.renderAddPartial(<Button type="primary" onClick={this.shownAddPartial.bind(this, { visibleKey: 'addBtn', record: {} })}>添加摇大奖</Button>, 'addBtn')}
				{this.renderEditPartialModal()}
			</div>
			
		)
	}
}