import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classnames from 'classnames'
import PreviewButton from 'wechatWall/components/wall-details/previewButton'
import styles from './index.scss'
import Form from 'antd/lib/form'
const FormItem = Form.Item
import Radio from 'antd/lib/radio'
const RadioGroup = Radio.Group
import Button from 'antd/lib/button'
import Upload from 'antd/lib/upload'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Modal from 'antd/lib/modal'
import Input from 'antd/lib/input'
import InputNumber from 'antd/lib/input-number'
import Switch from 'antd/lib/switch'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import Key from 'Application/decorators/key'

const formItemLayout = {
	labelCol: {
		span: 4
	},
	wrapperCol: {
		span: 17
	}
}


/**
 * 微信墙－投票
 */
@Form.create()
@Key(['content'])
export default class VoteComp extends React.Component {
	state = {
		modalVisible: false,
		voteType: 1,
		voteLimitMax: false,
		voteLimitMin: false,

		options: [{
			hashID: this.createID(),
			key: 'default_option_1'
			
		}, {
			hashID: this.createID(),
			key: 'default_option_2'
		}],

		editData: {}
	}

	static propTypes = {
		actions: PropTypes.object.isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		assetsUrl: PropTypes.string.isRequired
	}

	static contextTypes = {
		getSid: PropTypes.func.isRequired
	}

	shownModal(editData) {
		if (Object.keys(editData).length) {
			let option = []
			try {
				option = JSON.parse(editData.option)
			} catch (err) {}

			const __option = this.state.options

			option.forEach((item, index) => {
				if (index < 2) {
					__option[index].file_url = item.img
					__option[index].text = item.text
				} else {
					__option.push({
						hashID: this.createID(),
						file_url: item.img,
						text: item.text
					})
				}
			})

			this.setState({
				voteType: editData.vote_type,
				voteLimitMax: editData.max_option_status,
				voteLimitMin: editData.min_option_status,
				options: __option
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
			voteType: 1,
			voteLimitMax: false,
			voteLimitMin: false,
			editData: {},
			options: [{
				hashID: this.createID(),
				key: 'default_option_1'
				
			}, {
				hashID: this.createID(),
				key: 'default_option_2'
			}],
		})

		this.props.form.resetFields()
	}

	changeVoteType({ target: { value: voteType } }) {
		this.setState({
			voteType
		})
	}

	voteLimitChange(name, v) {
		this.setState({
			[name]: v
		})
	}

	createID() {
		return Math.random().toString(36).substr(2, 7)
	}

	addOption() {
		const hashID = this.createID()

		this.setState({
			options: [...this.state.options, { hashID }]
		})
	}

	deleteOption(hashID) {
		this.setState({
			options: this.state.options.filter(item => item.hashID !== hashID)
		})
	}

	handleFileChange(hashID, file) {
		if (hashID) {

			this.props.actions.uploadFile(file).then(resolve => {
				message.success(resolve.errormsg)

				this.setState({
					options: this.state.options.map(item => {
						if (item.hashID === hashID) {
							item.file_url = resolve.result.file_url
						}
						return item
					})
				})
			})

			
		}
		return false
	}

	handleFileRemove(hashID) {
		this.setState({
			options: this.state.options.map(item => {
				if (item.hashID === hashID) {
					delete item.file_url
				}
				return item
			})
		})
	}

	handleRemove(id) {
		const sid = this.context.getSid()
		const act = 'delete'
		this.props.actions.removeVote({ act, id, sid }).then(response => message.success(response.errormsg))
	}

	handleSave() {
		const { validateFields } = this.props.form
		validateFields((errors, values) => {
			
			values.max_option_status = +values.max_option_status
			values.min_option_status = +values.min_option_status
			const postData = {
				name: values.name,
				vote_type: values.vote_type,
				max_option_status: +values.max_option_status,
				min_option_status: +values.min_option_status,
				max_option: values.max_option,
				min_option: values.min_option,
				option: []
			}

			const option = []
			this.state.options.forEach(item => {
				option.push({
					img: item.file_url,
					text: values[item.hashID]
				})
			})
			postData.option = JSON.stringify(option)

			const act = Object.keys(this.state.editData).length ? 'update' : 'add'
			const id = this.state.editData.id
			const sid = this.context.getSid()

			this.props.actions.saveVote({
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

	renderOption(config) {
		const option = this.state.options.find(item => item.hashID === config.hashID)
		const uploadProps = {
			listType: 'picture-card',
			accept: 'image/*',
			beforeUpload: this.handleFileChange.bind(this, config.hashID),
			onRemove: this.handleFileRemove.bind(this, config.hashID),
			fileList: option.file_url ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + option.file_url
			}] : []
		}

		const props = {
			key: config.key || config.hashID
		}

		const fieldProps = this.props.form.getFieldProps(config.hashID, {
			rules: [{
				required: true, message: '请输入选项名称'
			}],
			initialValue: config.text
		})

		return (
			<FormItem {...props}
				label="选项："
				{...formItemLayout}
			>
				<Input {...fieldProps}/>
				<div id="upload-64">
					<Upload {...uploadProps}>
						{
							(option && option.file_url) ?
								null
								:
								<span>
									<Icon type="plus" />
 									<div className="ant-upload-text">上传照片</div>
								</span>
						}
						
					</Upload>
				</div>
				{
					!config.key && 
						<div className={styles['delete-option']} onClick={this.deleteOption.bind(this, config.hashID)}>
							<Icon type="cross" />
						</div>
				}
			</FormItem>
		)
	}

	renderEditModal() {
		const limitProps = {
			style: {
				width: 60
			},
			min: 1
		}

		const iconProps = {
			style: {
				fontSize: 24,
				cursor: 'pointer'
			}
		}

		const { getFieldProps } = this.props.form
		const { editData } = this.state
		const nameProps = getFieldProps('name', {
			initialValue: editData.name
		})

		const voteTypeProps = getFieldProps('vote_type', {
			initialValue: this.state.voteType
		})

		const maxOptionStateProps = getFieldProps('max_option_status', {
			valuePropName: 'checked',
			initialValue: this.state.voteLimitMax,
			onChange: this.voteLimitChange.bind(this, 'voteLimitMax')
		})

		const minOptionStateProps = getFieldProps('min_option_status', {
			valuePropName: 'checked',
			initialValue: this.state.voteLimitMin,
			onChange: this.voteLimitChange.bind(this, 'voteLimitMin')
		})

		const maxOptionProps = getFieldProps('max_option', {
			initialValue: editData.max_option
		})

		const minOptionProps = getFieldProps('min_option', {
			initialValue: editData.min_option
		})

		return (
			
				<Modal
					visible={this.state.modalVisible}
					onCancel={::this.hideModal}
					onOk={::this.handleSave}
					maskClosable={false}
					title={Object.keys(editData).length ? '修改' : '添加'}
				>
					<div className={styles['add-option-modal']}>
						<Form horizontal >
							<FormItem
								label="题目："
								{...formItemLayout}
							>
								<Input type="textarea" rows="1" {...nameProps}/>
							</FormItem>
							<FormItem
								{...formItemLayout}
							>
                                <span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</span>
								<RadioGroup {...voteTypeProps} onChange={::this.changeVoteType}>
									<Radio key="a" value={1}>单选题</Radio>
									<Radio key="b" value={2}>多选题</Radio>
								</RadioGroup>
							</FormItem>
                            {
                                this.state.voteType === 2 ?
                                    <div>
                                        <FormItem
                                            label="最多选："
                                            {...formItemLayout}
                                        >
                                            <InputNumber disabled={!this.state.voteLimitMax} {...limitProps} {...maxOptionProps}/>
                                            个
                                            <span style={{marginLeft: 16}}></span>
                                            <Switch {...maxOptionStateProps}/>
                                        </FormItem>
                                        <FormItem
                                            label="至少选："
                                            {...formItemLayout}
                                        >
                                            <InputNumber disabled={!this.state.voteLimitMin} {...limitProps} {...minOptionProps}/>
                                            个
                                            <span style={{marginLeft: 16}}></span>
                                            <Switch {...minOptionStateProps}/>
                                        </FormItem>
                                    </div>
                                : null
                            }
							{
								this.state.options.map(item =>
									this.renderOption(item)
								)
							}
						</Form>
						<Row>
							<Col offset="4">
								<Button size="small" onClick={::this.addOption}>添加选项</Button>
							</Col>
						</Row>
					</div>
				</Modal>
			
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()

		const columns = [{
			title: '题目',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '类型',
			dataIndex: 'vote_type',
			key: 'type',
			render(v) {
				return {
					'1': '单选',
					'2': '多选'
				}[v]
			}
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
			<Table 
				dataSource={dataSource}
				columns={columns}
				pagination={false}
			/>
			
		)
	}

	render() {

		return (
			<div>
				<PreviewButton action="vote"/>
				<div className="toolbar">
					<Button type="primary" onClick={this.shownModal.bind(this, {})}>添加题目</Button>
				</div>
				{this.renderTable()}
				{this.renderEditModal()}
			</div>
			
		)
	}
}