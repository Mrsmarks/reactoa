import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classnames from 'classnames'
import styles from './index.scss'

import Form from 'antd/lib/form'
const FormItem = Form.Item
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Switch from 'antd/lib/switch'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Radio from 'antd/lib/radio'
const RadioGroup = Radio.Group
import Spin from 'antd/lib/spin'
import Select from 'antd/lib/select'
const Option = Select.Option

/**
 * 微信墙－签到管理
 */
@Form.create()
export default class SignManageComp extends React.Component {
	static propTypes = {
		info: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		getSid: PropTypes.func.isRequired,
		location: PropTypes.object.isRequired,
		router: PropTypes.object.isRequired
	}

	state = {
		hasLimit: this.props.hasLimit,
		modalVisible: false,
		templateModalVisible: false,
        mobileTemplateModalVisible: false,
		editData: {}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.info !== nextProps.info && !this.state.isInit) {
			this.setState({
				isInit: true,
				templateVisible: nextProps.info.get('type'),
				whiteStatus: !!+nextProps.info.get('whiteListStatus'),
				screenTemplateId: nextProps.info.get('screenTemplateId')
			})
		}
	}

	handleSave() {
		const postData = this.props.form.getFieldsValue(['type', 'white_list_status'])
		postData.white_list_status = +postData.white_list_status
		postData.sign_screen_tid = this.state.screenTemplateId || undefined
		const sid = this.context.getSid()
		this.props.actions.updateSignSetting({ postData, sid }).then(response => message.success(response.errormsg))
	}

	updateWhiteStatus(whiteStatus) {
		const sid = this.context.getSid()
		const postData = {
			white_list_status: +whiteStatus
		}
		this.props.actions.updateWhiteStatus({ postData, sid }).then(response => {
			if (whiteStatus) {
				message.info('你已开启白名单控制')
				this.props.actions.fetchWhiteList({ sid })
			} else {
				message.info('你已关闭白名单控制')
			}
			this.setState({
				whiteStatus
			})
		})
		
	}

	editWhiteName() {
		const values = this.props.form.getFieldsValue(['white_type', 'value'])
		const postData = {
			type: values.white_type,
			value: values.value
		}

		const act = Object.keys(this.state.editData).length ? 'update' : 'add'
		const sid = this.context.getSid()
		const id = this.state.editData.id
		this.props.actions.editWhiteName({ postData, act, sid, id }).then(response => {
			message.success(response.errormsg)
			this.hideModal()
		})
	}

	shownModal(editData) {
		this.setState({
			modalVisible: true,
			editData
		})
	}

	hideModal() {
		this.setState({
			modalVisible: false,
			editData: {}
		})

		this.props.form.resetFields(['white_type', 'value'])
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall-details/sign/manage',
			query
		})
		const sid = this.context.getSid()
		this.props.actions.fetchWhiteList({ sid, ...query })
	}

	handleRemove(id) {
		const act = 'delete'
		const sid = this.context.getSid()
		this.props.actions.removeWhiteName({ sid, id, act }).then(response => message.success(response.errormsg))
	}

	handleTemplateSelect(id) {
		this.setState({
			screenTemplateId: id
		})

		this.hideTemplateModal()
	}

    handleMobileTemplateSelect(id) {
        this.setState({
            mobileTemplateId: id
        })

        this.hideMobileTemplateModal()
    }

	hideTemplateModal() {
		this.setState({
			templateModalVisible: false
		})
	}

    hideMobileTemplateModal() {
        this.setState({
            mobileTemplateModalVisible: false
        })

    }

	showTemplateModal() {
		this.setState({
			templateModalVisible: true
		})
	}

    showMobileTemplateModal() {
        this.setState({
            mobileTemplateModalVisible: true
        }) 
    }

	renderDisplayTemplate(id, dataSource) {
		const record = dataSource.find(item => item.get('id') == id)
		if (!record) {
			return null
		}
		return (
			<div className={styles['tpl']}>
				<img src={this.props.assetsUrl + record.get('thumb')} />
				<span className={styles['tpl-name']}>{record.get('name')}</span>
			</div>
		)
	}

	renderModal() {
		const { editData } = this.state
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 18
			}
		}
		const { getFieldProps } = this.props.form
		const typeProps = getFieldProps('white_type', {
			initialValue: editData.type ? +editData.type : undefined
		})

		const valueProps = getFieldProps('value', {
			initialValue: editData.value
		})

		return (
			<Modal
				title="添加"
				visible={this.state.modalVisible}
				confirmLoading={this.props.editWhiteNameLoading}
				width={400}
				onOk={::this.editWhiteName}
				onCancel={::this.hideModal}
			>
				<Form horizontal >
					<FormItem
						{...formItemLayout}
						label="白名单类型："
					>
						<Select {...typeProps}>
							<Option key="1" value="1">openid</Option>
							<Option key="2" value="2">手机号</Option>
						</Select>
					</FormItem>
					<FormItem
						{...formItemLayout}
						label="值："
					>
						<Input {...valueProps}/>
					</FormItem>
				</Form>
			</Modal>
		)
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

		const { info } = this.props

		const { getFieldProps } = this.props.form
		const typeProps = getFieldProps('type', {
			initialValue: info.get('type'),
			onChange: ({ target: { value } }) => this.setState({
				templateVisible: value
			})
		})
		const whiteStatusProps = getFieldProps('white_list_status', {
			valuePropName: 'checked',
			initialValue: this.state.whiteStatus,
			onChange: ::this.updateWhiteStatus
		})

		let screenTemplate = null
        let mobileTemplate = null

		if (this.state.screenTemplateId) {
			screenTemplate = this.renderDisplayTemplate(this.state.screenTemplateId, this.props.info.get('screenTemplate'))
		}

        if (this.state.mobileTemplateId) {
            mobileTemplate = this.renderDisplayTemplate(this.state.mobileTemplateId, this.props.info.get('mobileTemplate'))
        }

		return (
			<div className="pure-form">
				<Form horizontal >
					<FormItem
						{...formItemLayout}
					>
						<Button type="primary" size="default" onClick={::this.handleSave} loading={this.props.saveLoading}>保存</Button>
					</FormItem>
					<h3 className={styles.title}>签到管理</h3>
					<FormItem
						label="签到类型："
						{...formItemLayout}
					>
						<RadioGroup {...typeProps}>
			           		<Radio key="1" value={1}>默认签到</Radio>
			           		<Radio key="2" value={2}>报名签到</Radio>
			        	</RadioGroup>
					</FormItem>

					{{
						'2': (
							<FormItem
								label="手机端模版："
								{...formItemLayout}
							>
                                <Button size="default" onClick={::this.showMobileTemplateModal}>选择</Button>
                                {mobileTemplate}
							</FormItem>
						)
					}[this.state.templateVisible]}
					<FormItem
						label="PC端模版："
						{...formItemLayout}
					>
						<Button size="default" onClick={::this.showTemplateModal}>选择</Button>
						{screenTemplate}
					</FormItem>
					<FormItem
						label="白名单："
						{...formItemLayout}
					>
						<div style={{display: 'inline-block'}}>
							<Spin size="small" spinning={this.props.updateWhiteStatusLoading}>
								<Switch checkedChildren="开" unCheckedChildren="关" {...whiteStatusProps}/>
							</Spin>
						</div>
					</FormItem>
					
					
				</Form>
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.info.get('whiteList').toJS()
		const columns = [{
			title: '活动名称',
			dataIndex: 'activity_name',
			key: 'activity_name'
		}, {
			title: '白名单类型',
			dataIndex: 'type',
			key: 'type',
			render(v) {
				return v == 1 ? 'openid' : '手机号'
			}
		}, {
			title: '值',
			dataIndex: 'value',
			key: 'value'
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

		const params = this.props.info.get('params').toJS()
		const pagination = {
			total: +params.count,
			current: +params.page,
			onChange: ::this.handlePageChange,
			showSizeChanger: true,
			pageSize: +params.psize,
			onShowSizeChange: ::this.handlePageChange,
			showTotal: function() {
				return `共${params.count}条`
			}.bind(this)
		}

		return (
			<div hidden={!this.state.whiteStatus}>
				<Spin spinning={this.props.tableLoading}>
					<h3 className={styles.title}>白名单管理</h3>
					<div>
						<Button onClick={this.shownModal.bind(this, {})}>添加白名单</Button>
						<span style={{marginLeft: 8}}></span>
						<Button onClick={() => this.shownModal.bind(this, {})}><Icon type="cloud-upload-o" /> 导入白名单</Button>
						<span style={{marginLeft: 8}}></span>
						<Button onClick={() => this.shownModal.bind(this, {})}><Icon type="cloud-download-o" /> 导出白名单</Button>
						<br />
						<br />
					</div>
					
					<Table 
						dataSource={dataSource}
						columns={columns}
						pagination={pagination}
						loading={this.props.tableLoading}
						// onExpandedRowsChange={keys => this.setState({ expandedRowKeys: keys })}
						// expandedRowKeys={this.state.expandedRowKeys || []}
					/> 
				</Spin>
			</div>
			
		)
	}

    renderMobileTemplateModal() {
        const dataSource = this.props.info.get('mobileTemplate').toJS()
        const columns = [{
            title: '预览',
            dataIndex: 'thumb',
            key: 'thumb',
            render: src => {
                return <img src={this.props.assetsUrl + src} style={{ height: 100 }}/>
            }
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '操作',
            key: 'operate',
            render: (_, record) => {
                return (
                    <a onClick={this.handleMobileTemplateSelect.bind(this, record.id)}>选择</a>
                )
            }
        }]

        return (
            <Modal
                visible={this.state.mobileTemplateModalVisible}
                onCancel={::this.hideMobileTemplateModal}
                footer={null}
                title="选择模版"
            >
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                />
            </Modal>
        )
    } 

	renderTemplateModal() {
		const dataSource = this.props.info.get('screenTemplate').toJS()
		const columns = [{
			title: '预览',
			dataIndex: 'thumb',
			key: 'thumb',
			render: src => {
				return <img src={this.props.assetsUrl + src} style={{ height: 100 }}/>
			}
		}, {
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '操作',
			key: 'operate',
			render: (_, record) => {
				return (
					<a onClick={this.handleTemplateSelect.bind(this, record.id)}>选择</a>
				)
			}
		}]

		return (
			<Modal
				visible={this.state.templateModalVisible}
				onCancel={::this.hideTemplateModal}
				footer={null}
				title="选择模版"
			>
				<Table
					dataSource={dataSource}
					columns={columns}
					pagination={false}
				/>
			</Modal>
		)
	}

	render() {
		return (
			<div>
				{this.renderForm()}
				{this.renderTable()}
				{this.renderModal()}
                {this.renderMobileTemplateModal()}
                {this.renderTemplateModal()}
			</div>
			
		)
	}
}