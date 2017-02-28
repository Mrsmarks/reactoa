import React, { PropTypes } from 'react'
import Immutable from 'immutable'

 
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Popconfirm from 'antd/lib/popconfirm'
import Select from 'antd/lib/select'
const Option = Select.Option
import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'
import Upload from 'antd/lib/upload'
import Auth from 'Application/components/auth'
import Key from 'Application/decorators/key'
import safeString from 'safeString'

const FormItem = Form.Item

@Form.create()
export default class CustomerMsgEditComp extends React.Component {
	static propTypes = {
		editData: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired,

		saveLoading: PropTypes.bool.isRequired,

		selectData: PropTypes.instanceOf(Immutable.Map).isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {
		userType: undefined,
		msgType: undefined,

		tableDataSource: [],

		msgModalVisible: false,
		msgModalObj: {}
	}

	changeSelect(type, v) {
		this.setState({
			[type]: v
		})
	}

	uploadFile(file) {
		this.props.actions.uploadFile(file).then(x => {
			message.success(x.errormsg)
			this.setState({
				msgModalObj: {
					...this.state.msgModalObj,
					url: x.result.file_url
				}
			})
		})
		return false
	}

	shownAddPicMsgModal() {
		this.setState({
			msgModalVisible: true
		})
	}

	hideAddPicMsgModal() {
		this.setState({
			msgModalVisible: false
		})
	}

	savePicMsg() {
		this.props.form.validateFields(['title', 'desc', 'link'], (errors, values) => {
			if (errors) {
				return
			}

			if (!this.state.msgModalObj.url) {
				return message.error('请选择图片')
			}

			let tableDataSource = this.state.tableDataSource
			if (this.state.msgModalObj.isEdit) {
				tableDataSource = tableDataSource.map(item => {
					if (item.key == this.state.msgModalObj.key) {
						
						return {
							...item,
							...values,
							url: this.state.msgModalObj.url
						}
					}
					return item
				})
			} else {
                
				tableDataSource.push({
					key: Math.random().toString(36).substr(2, 7),
					url: this.state.msgModalObj.url,
					...values
				})
			}

			this.setState({
				tableDataSource,
				msgModalVisible: false,
				msgModalObj: {}
			})

			this.props.form.resetFields(['title', 'desc', 'link'])
		})
	}

	delTableData(key) {
		this.setState({
			tableDataSource: this.state.tableDataSource.filter(item => item.key != key)
		})
	}

	handleSubmit() {
		this.props.form.validateFields(['name', 'usertype', 'msgtype'], (errors, values) => {
			if (errors) {
				return
			}

			let {
				wechat_groupid,
				virtual_groupid
			} = this.props.form.getFieldsValue(['wechat_groupid', 'virtual_groupid'])
			if (Array.isArray(virtual_groupid)) {
				virtual_groupid = virtual_groupid.join(',')
			}

			let content
			if (values.msgtype === 'text') {
				content = this.props.form.getFieldValue('content')
			} else {
				content = this.state.tableDataSource.map(item => {
					return {
						picurl: item.url,
						title: item.title,
						description: item.desc,
						url: item.link
					}
				})
				content = JSON.stringify(content)
			}

			const postData = {
				...values,
				wechat_groupid,
				virtual_groupid,
				content
			}

			const act = this.props.editData.size ? 'update' : 'add'
			const id = this.props.editData.get('id')

			this.props.actions.saveCustomerMsgData({ postData, act, id }).then(x => {
				message.success(x.errormsg)
				this.context.router.replace('/wechat/customer-send-message/list')
			})

		})
	}

	componentWillReceiveProps(nextProps) {
		if (!this.state.editDataInit && nextProps.editData.size) {
			let tableDataSource = []

			if (nextProps.editData.get('msgtype') === 'news') {
				tableDataSource = nextProps.editData.get('content').map(item => {
					return {
						key: item.get('id'),
						desc: item.get('description'),
						url: item.get('picurl'),
						link: item.get('url'),
						title: item.get('title')
					}
				}).toJS()
			}

			this.setState({
				userType: nextProps.editData.get('usertype'),
				msgType: nextProps.editData.get('msgtype'),
				tableDataSource,
				editDataInit: true
			})
		}
	}

	renderForm() {
		const formItemLayout = {
		    labelCol: { span: 4 },
		    wrapperCol: { span: 16 }
		}

		const editData = this.props.editData

		const selectData = this.props.selectData
		const { getFieldProps } = this.props.form
		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称' }
			],
			initialValue: editData.get('name')
		})

		const userTypeProps = getFieldProps('usertype', {
			rules: [
				{ required: true, message: '请输入用户类型' }
			],
			initialValue: safeString(this.state.userType),
			onChange: this.changeSelect.bind(this, 'userType')
		})

		const wechatGroupProps = getFieldProps('wechat_groupid', {
			initialValue: editData.get('wechat_groupid') ? editData.get('wechat_groupid') + '' : undefined
		})

		const wechatVirtialProps = getFieldProps('virtual_groupid', {
			initialValue: editData.get('virtual_groupid')? editData.toJS().virtual_groupid: []
		})

		const textProps = getFieldProps('content', {
			initialValue: editData.get('content')
		})

		const msgTypeProps = getFieldProps('msgtype', {
			rules: [
				{ required: true, message: '请输入消息类型' }
			],
			initialValue: this.state.msgType,
			onChange: this.changeSelect.bind(this, 'msgType')
		})

		const assets_domain = this.props.assets_domain
		const delTableData = id => _ => {
			return this.delTableData(id)
		}
		const editPicMsg = id => _ => {
			const msgModalObj = {
				...this.state.tableDataSource.find(item => item.key == id),
				isEdit: true
			}

			this.setState({
				msgModalObj,
				msgModalVisible: true
			})
		}
		const columns = [{
			title: '图片',
			dataIndex: 'url',
			key: 'url',
			render(url) {
				return <img src={assets_domain + url} width={100}/>
			}
		},{
			title: '名称',
			dataIndex: 'title',
			key: 'title'
		},{
			title: '名称',
			dataIndex: 'desc',
			key: 'desc'
		},{
			title: '名称',
			dataIndex: 'link',
			key: 'link'
		},{
			title: '操作',
			key: 'operator',
			render(_, obj) {
				return (
					<div>
						<a onClick={editPicMsg(obj.key)}>编辑</a>
						{' '}
						<Popconfirm title="确认删除吗？" onConfirm={delTableData(obj.key)}>
							<a>删除</a>
						</Popconfirm>
					</div>
					
				)
			}
		}]

		const authConfig = {
			dpid: editData.get('dpid'),
			nid: editData.get('nid'),
			cpid: editData.get('cpid'),
			uid: editData.get('create_user')
		}


		return (
			<div>
				<div className="pure-form">
					<Form horizontal >
						<FormItem
				          {...formItemLayout}
				          label="名称："
				          hasFeedback
				          >
				          <Input {...nameProps} type="text" />
				        </FormItem>
				        <FormItem  {...formItemLayout} label="用户类型：">
			        		<Select {...userTypeProps} placeholder="请选择用户类型">
			        			{
			        				selectData.get('userType').map(item => 
			        					<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
			        				)
		    	        		
			        			}
		    	        	</Select>
			        	</FormItem>
			        	{{
			        		'1': (
			        			<FormItem  {...formItemLayout} label="微信分组：" required>
					        		<Select {...wechatGroupProps} placeholder="请选择微信分组">
					        			{
					        				selectData.get('weixinGroup').map(item => 
					        					<Option key={item.get('id') || item.get('group_id')} value={item.get('id')+''}>{item.get('name')}</Option>
					        				)
					        			}
				    	        	</Select>
					        	</FormItem>
			        		),
			        		'2': (
					        	<FormItem  {...formItemLayout} label="虚拟分组：" required>
					        		<Select {...wechatVirtialProps} placeholder="请选择虚拟分组" multiple>
					        			{
					        				selectData.get('virtualGroup').toJS().map(item => 
					        					<Option key={item.id+'x'} value={item.id+''}>{item.name}</Option>
					        				)
					        			}
				    	        	</Select>
					        	</FormItem>
			        		)
			        	}[this.state.userType]}
			        	<FormItem  {...formItemLayout} label="消息类型：">
		    	        	<Select {...msgTypeProps} placeholder="请选择消息类型">
			        			{
			        				selectData.get('messageType').map(item => 
			        					<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
			        				)
			        			}
		    	        	</Select>
			        	</FormItem>
			        	{{
			        		'text': (
			        			<FormItem {...formItemLayout} label="文本：" required>
				    	        	<Input 
				    	        		{...textProps}
				    	        		type="textarea"
				    	        		rows="5"
				    	        	/>
					        	</FormItem>
			        		),
			        		'news': (
			        			<FormItem {...formItemLayout} label="图文内容：" required>
			        				<Button type="dashed" size="default" onClick={::this.shownAddPicMsgModal}>添加图文</Button>
			        			</FormItem>
			        			
			        		)
			        	}[this.state.msgType]}
		    	        
					</Form>
					
				</div>
				{
					this.state.msgType === 'news' && this.state.tableDataSource.length ?
					<div style={{paddingLeft: 40, paddingRight: 40}}>
						<Table 
			        		dataSource={this.state.tableDataSource}
			        		columns={columns} 
			        		pagination={false}
			        	/>
					</div> : null
				}
				<Auth type={['wechat-customer-service-send-message-edit', 'wechat-customer-service-send-message-add']} {...authConfig}>
					<Button loading={this.props.saveLoading} style={{marginLeft: 40, marginTop: 16}} type="primary" onClick={::this.handleSubmit}>
						{editData.size ? '更新' : '提交'}
					</Button>
				</Auth>
			</div>
		)
	}

	renderModal() {
		const { getFieldProps } = this.props.form
		const modalObj = this.state.msgModalObj
		const titleProps = getFieldProps('title', {
			rules: [
				{ required: true, message: '请输入标题' }
			],
			initialValue: modalObj.title
		})

		const descProps = getFieldProps('desc', {
			rules: [
				{ required: true, message: '请输入描述' }
			],
			initialValue: modalObj.desc
		})

		const linkProps = getFieldProps('link', {
			rules: [
				{ required: true, message: '请输入链接' }
			],
			initialValue: modalObj.link
		})

		const formItemLayout = {
		    labelCol: { span: 4 },
		    wrapperCol: { span: 16 }
		}

		const getFile = () => {
			
			if (modalObj.url) {
				return [{
					uid: -1,
					status: 'done',
					url: this.props.assets_domain + modalObj.url
				}]
			}
			return []
		}
		const uploadProps = {
			listType: 'picture-card',
			beforeUpload: ::this.uploadFile,
			//onChange: ::this.handleFileChange,
			fileList: getFile(),
			accept: 'image/*'
		}
		return (
			<Modal
				visible={this.state.msgModalVisible}
				onCancel={::this.hideAddPicMsgModal}
				onOk={::this.savePicMsg}
				title={modalObj.isEdit ? '修改图文' : '添加图文'}
			>
				<Form horizontal >
					<FormItem
			        	{...formItemLayout}
			        	label="标题："
			        	hasFeedback>
			        	<Input {...titleProps} type="text" />
			        </FormItem>
			        <FormItem  
			        	{...formItemLayout} 
			        	label="描述："
			        	hasFeedback>
		        		<Input {...descProps} type="textarea" />
		        	</FormItem>
		        	<FormItem 
		        		{...formItemLayout}
		        		label="链接："
		        		hasFeedback>
		        		<Input {...linkProps} type="text" />
		        	</FormItem>
		        	<FormItem 
		        		{...formItemLayout} 
		        		label="图片："
		        		required
		        		hasFeedback>
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
				{this.renderForm()}
				{this.renderModal()}
			</div>
		)
	}
}