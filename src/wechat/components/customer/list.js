import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Modal from 'antd/lib/modal'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Key from 'Application/decorators/key'
import format from 'Application/utils/formatDate'
import Auth from 'Application/components/auth'

const FormItem = Form.Item

@Key(['content'])
@Form.create()
export default class CustomerComp extends React.Component {
	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired,

		wechat_account: PropTypes.string.isRequired,

		assets_domain: PropTypes.string.isRequired,

		modalLoading: PropTypes.bool.isRequired,
		listLoading: PropTypes.bool.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {
		fileList: [],
		modalVisible: false,
		editData: {}
	}


	shownModal(id) {
		
		const state = {
			modalVisible: true
		}
	
		if (id) {
			state.editData = this.props.content.find(item => item.get('id') == id).toJS()
		}
		this.setState(state)
	}

	hideModal() {
		this.setState({
			modalVisible: false,
			editData: {}
		})
		this.props.form.resetFields()
	}

	uploadFile(file) {
		this.props.actions.uploadFile(file).then(x => {
			message.success(x.errormsg)
			this.setState({
				fileList: [{
					uid: -1,
					status: 'done',
					url: this.props.assets_domain + x.result.file_url
				}]
			})
		})
	}

	onPageChange(nextPage, pageSize) {
		const query = {
			page: nextPage,
			psize: pageSize,
			name: this.props.params.get('name')
		}

		this.context.router.push({
			pathname: '/wechat/customer-service/list', 
			query
		})
		this.props.actions.fetchCustomerList(query)
	}

	handleSearch() {
		const name = this.props.form.getFieldValue('searchName')
		const query = {
			...this.props.params.toJS(),
			name
		}
		delete query.count

		this.context.router.push({
			pathname: '/wechat/customer-service/list', 
			query
		})
		this.props.actions.fetchCustomerList(query)
	}

	handleSubmit() {
		this.props.form.validateFields(['account', 'nickname', 'password'], (errors, values) => {
			if (errors) {
				return
			}

			let headimgurl = ''
			const isEdit = Object.keys(this.state.editData).length
			if (this.state.fileList.length) {
				headimgurl = this.state.fileList[0].url
			} else if (isEdit) {
				headimgurl = this.state.editData.headimgurl
			}

			if (!headimgurl) {
				return message.error('请选择头像')
			}

			headimgurl = headimgurl.replace(this.props.assets_domain, '')

			values.account = values.account.replace(`@${this.props.wechat_account}`, '')
			const postData = {
				...values,
				headimgurl
			}

			const act = isEdit ? 'update' : 'add'
			const id = this.state.editData.id

			this.props.actions.addCustomer({ postData, act, id }).then(x => {
				message.success(x.errormsg)
				this.hideModal()
			})
		})

		
	}

	synchCustomer() {
		this.props.actions.synchCustomer().then(x => message.success(x.errormsg))
	}

	removeCustomer(id) {
		this.props.actions.removeCustomer(id).then(x => message.success(x.errormsg))
	}

	renderToolbar() {
		const searchName = this.props.form.getFieldProps('searchName')

		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["wechat-customer-service-account-add"]}>
						<Button type="primary" onClick={this.shownModal.bind(this, 0)}>
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>
					<Auth type={["wechat-customer-service-account-synch"]}>
						<Button type="primary" onClick={::this.synchCustomer} loading={this.props.synchLoading}>
							<Icon type="plus" />
							同步数据
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>
					<FormItem  label="昵称：">
	    	        	<Input type="text" {...searchName}/>
		        	</FormItem>
						<Button type="primary" onClick={::this.handleSearch}>
							<Icon type="search" />
							 查询
						</Button>	
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const shownModal = id => _ => {
			return this.shownModal(id)
		}

		const removeCustomer = id => _ => {
			return this.removeCustomer(id)
		}

		const columns = [{
			title: '账号',
			dataIndex: 'account',
			key: 'account'
		}, {
			title: '昵称',
			dataIndex: 'nickname',
			key: 'nickname',
		}, {
			title: '创建时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render(v) {
				return format(v * 1000, 'yyyy-MM-dd hh:mm:ss')
			}
		},{
			title: '操作',
			key: 'operation',
			render(_, obj) {
				// const authConfig = {
				// 	dpid: obj.dpid,
				// 	nid: obj.nid,
				// 	cpid: obj.cpid,
				// 	uid: obj.create_user
				// }

				return (
					<div>
						<Auth type={["wechat-customer-service-account-check", "wechat-customer-service-account-edit"]}>
							<a onClick={shownModal(obj.id)}>详情</a>
						</Auth>
						
						{' '}
						<Auth type={["wechat-customer-service-account-delete"]}>
							<Popconfirm title="确认删除吗？" onConfirm={removeCustomer(obj.id)}>
								<a>删除</a>
							</Popconfirm>
						</Auth>
					</div>
				)
			}
		}]

		const params = this.props.params
		const pagination = {
			pageSize: +params.get('psize'),
			current: +params.get('page'),
			onChange: ::this.onPageChange,
			showSizeChanger: true,
			onShowSizeChange: ::this.onPageChange,
			total: +params.get('count'),
			showTotal: function() {
				return `共${params.get('count')}条`
			}.bind(this)
		}

		return (
			<Table 
				dataSource={dataSource}
				columns={columns}
				pagination={pagination}
				loading={this.props.listLoading}
			/>
		)
	}

	renderEditModal() {
		const formItemLayout = {
		    labelCol: { span: 4 },
		    wrapperCol: { span: 19 }
		}

		let fileList = this.state.fileList
		if (Object.keys(this.state.editData).length) {
			
			if (!fileList.length) {
				fileList = [{
					uid: -1,
					status: 'done',
					url: this.props.assets_domain + this.state.editData.headimgurl
				}]
			}
			
		}

		const { getFieldProps } = this.props.form
		const accountProps = getFieldProps('account', {
			rules: [
				{ required: true, message: '请输入客服账号' }
			],
			initialValue: this.state.editData.account ? 
							this.state.editData.account.replace(`@${this.props.wechat_account}`, '') :
								undefined
		})

		const nicknameProps = getFieldProps('nickname', {
			rules: [
				{ required: true, message: '请输入客服昵称' }
			],
			initialValue: this.state.editData.nickname
		})

		let pwdProps = {}
		if (!Object.keys(this.state.editData).length) {
			pwdProps = {
				rules: [
					{ required: true, message: '请输入客服密码' }
				]
			}
		}
		
		const passwordProps = getFieldProps('password', pwdProps)

		const uploadProps = {
			listType: 'picture-card',
			beforeUpload: ::this.uploadFile,
			//onChange: ::this.handleFileChange,
			fileList,
			accept: 'image/*'
		}

		// const authConfig = {
		// 	cpid: this.state.editData.cpid,
		// 	uid: this.state.editData.create_user,
		// 	dpid: this.state.editData.dpid,
		// 	nid: this.state.editData.nid
		// }

		return (
			<Modal
				visible={this.state.modalVisible}
				width={500}
				onCancel={::this.hideModal}
				title={Object.keys(this.state.editData).length ? '详情' : '新增'}
				footer={[
					<Button key="back" type="ghost" size="large" onClick={::this.hideModal}>返 回</Button>,
					<Auth key="submit" type={["wechat-customer-service-account-edit"]} >
						<Button type="primary" size="large" loading={this.props.modalLoading} onClick={::this.handleSubmit}>
							{Object.keys(this.state.editData).length ? '修改' : '添加'}
						</Button>
					</Auth>
				]}
			>
				
				<Form horizontal >
			       
			        <FormItem
			          {...formItemLayout}
			          label="工号："
			          >
			         <Input {...accountProps} type="text" addonAfter={'@' + this.props.wechat_account} />
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="昵称："
			          hasFeedback			         
			          >
			          <Input {...nicknameProps} type="text"/>
			        </FormItem>
		        	<FormItem
			          {...formItemLayout}
			          label="密码："
			          hasFeedback			         
			          >
			          <Input {...passwordProps} type="password"/>
			        </FormItem>
			       	<FormItem
			          {...formItemLayout}
			          label="头像："
			          hasFeedback
			          required
			          >
			            <Upload {...uploadProps}>
		         			<Icon type="plus" />
							<div className="ant-upload-text">图片</div>
			         	</Upload>
			        </FormItem>
				</Form>
			</Modal>
		)
	}

	render() {
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				{this.renderEditModal()}
			</div>
		)
	}
}