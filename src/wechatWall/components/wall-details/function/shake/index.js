import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classnames from 'classnames'
import styles from 'wechatWall/components/wall-details/wrap.scss'
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
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'

/**
 * 微信墙－图片墙
 */
@Form.create()
export default class ShakeComp extends React.Component {
	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		hasLimit: PropTypes.bool.isRequired,
		topLevel: PropTypes.number,
		afterRound: PropTypes.number,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		getSid: PropTypes.func.isRequired
	}

	state = {
		hasLimit: this.props.hasLimit,
		modalVisible: false,
		editData: {}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props !== nextProps && !this.state.isInit) {
			this.setState({
				isInit: true,
				hasLimit: nextProps.hasLimit
			})
		}
	}

	hasLimitChange(value) {
		this.setState({
			hasLimit: value
		})
	}

	shownModal(record) {
		this.setState({
			modalVisible: true,
			editData: record
		})
	}

	handleRemove(id) {
		this.props.actions.removeShake({}, 'delete', id).then(response => message.success(response.errormsg))
	}

	hideModal() {
		this.setState({
			modalVisible: false,
			editData: {}
		})
	}

	handleSaveShake() {
		this.props.form.validateFields(['title', 'time', 'top_level'], (err, values) => {
			if (err) {
				return
			}

			const sid = this.context.getSid()
			const act = Object.keys(this.state.editData).length ? 'update' : 'add'
			const id = this.state.editData.id
			this.props.actions.saveShake(values, act, id, sid).then(response => {
				message.success(response.errormsg)
				this.hideModal()
				this.props.form.resetFields(['title', 'time', 'top_level'])
			})
		})
	}

	saveRules() {
		const postData = this.props.form.getFieldsValue(['shake_limit', 'shake_limit_top', 'shake_limit_periods'])
		const sid = this.context.getSid()
		postData.shake_limit = +postData.shake_limit
		this.props.actions.updateShakeConfig(postData, sid).then(response => message.success(response.errormsg))
	}

	renderTable() {
		const dataSource = this.props.content.toJS()

		const columns = [{
			title: '题目',
			dataIndex: 'title',
			key: 'title'
		}, {
			title: '时间',
			dataIndex: 'time',
			key: 'time'
		}, {
			title: '结束后显示',
			dataIndex: 'top_level',
			key: 'topLevel'
		}, {
			title: '创建类型',
			dataIndex: 'type',
			key: 'type'
		}, {
			title: '操作',
			key: 'operate',
			render: (_, record) => {
				return (
					<div>
						<a onClick={this.shownModal.bind(this, record)}>修改</a>
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
				<Button type="primary" onClick={this.shownModal.bind(this, {})}>添加摇一摇</Button>
			</div>
			
		)
	}

	renderModal() {
		const editData = this.state.editData
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 16
			}
		}

		const { getFieldProps } = this.props.form

		const titleProps = getFieldProps('title', {
			initialValue: editData.title
		})

		const timeProps = getFieldProps('time', {
			initialValue: editData.time
		})

		const topLevelProps = getFieldProps('top_level', {
			initialValue: editData.top_level
		})

		return (
			<Modal
				visible={this.state.modalVisible}
				onCancel={::this.hideModal}
				onOk={::this.handleSaveShake}
				title={Object.keys(editData).length ? '编辑' : '添加'}
				confirmLoading={this.props.editLoading}
			>
				<Form horizontal >
					<FormItem
						label="摇一摇标题："
						{...formItemLayout}
					>
						<Input {...titleProps}/>
					</FormItem>
					<FormItem
						label="摇一摇时间："
						{...formItemLayout}
					>
						<InputNumber min={1} {...timeProps}/> 秒
					</FormItem>
					<FormItem
						label="结束后显示前："
						{...formItemLayout}
					>
						<InputNumber min={1} {...topLevelProps}/> 名
					</FormItem>
				</Form>
			</Modal>
		)
	}

	renderToolbar() {
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
				width: 50,
				margin: '0 8px'
			},
			min: 1,
			disabled: !this.state.hasLimit
		}

		const { getFieldProps } = this.props.form
		const topLevelProps = getFieldProps('shake_limit_top', {
			initialValue: this.props.topLevel,
		})

		const afterRoundProps = getFieldProps('shake_limit_periods', {
			initialValue: this.props.afterRound,
		})

		const hasLimitProps = getFieldProps('shake_limit', {
			initialValue: this.state.hasLimit,
			valuePropName: 'checked'
		})

		return (
			<div className="toolbar">
				<Switch checkedChildren="开" unCheckedChildren="关" {...hasLimitProps} onChange={::this.hasLimitChange}/>
				<span style={{marginLeft: 8}}></span>
				比赛结果的前<InputNumber {...topLevelProps} {...inputProps}/>名，不能参与之后<InputNumber {...afterRoundProps} {...inputProps}/>轮摇一摇
				<span style={{marginLeft: 16}}></span>
				<Button type="primary" loading={this.props.updateConfigLoading} onClick={::this.saveRules}>保存</Button>
			</div>
		)
	}

	render() {
		return (
			<div>
				<PreviewButton action="shake"/>
				{this.renderToolbar()}
				
				{this.renderTable()}
				{this.renderModal()}
				
			</div>
			
		)
	}
}