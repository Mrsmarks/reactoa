import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import styles from './index.scss'
import Select from 'antd/lib/select'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'
import Pagination from 'antd/lib/pagination'
import Upload from 'antd/lib/upload'
import Tabs from 'antd/lib/tabs'
import IconFont from 'Application/components/iconFont'
import img from 'Application/resources/404.png'
import Popover from 'antd/lib/popover'
import Popconfirm from 'antd/lib/popconfirm'
import format from 'Application/utils/formatDate'

const FormItem = Form.Item
const Dragger = Upload.Dragger
const Option = Select.Option
const TabPane = Tabs.TabPane

/**
 * 微信墙－屏幕控制-虚拟角色
 */
@Form.create()
export default class ScreenComp extends React.Component {

	constructor(props, context) {
		super(props, context)
		this.state = {
			img_url: '',
			role_img: '',
			popover: false,
			tab_key: []
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		getSid: PropTypes.func.isRequired
	}

	uploadFile(file) {
		const sid = this.context.location.query.id
		this.props.actions.uploadFile(file).then(resolve => {
			const img_url = resolve.result.file_url
			this.props.form.validateFields((errors, values) => {
				values.image = img_url
				delete values.message
				this.props.actions.sendVirtualMessage({sid, ...values}).then(resolve => {
					message.success('发送图片成功！')
				})
			})
			
		})
	}

	uploadRole(file) {
		this.props.actions.uploadFile(file).then(resolve => {
			message.success('图片上传成功！')
			this.setState({
				role_img: resolve.result.file_url
			})
		})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall-details/screen-ctrl-virtual/index',
			query: query
		})
		this.props.actions.getMessageList(query)
	}

	handleVirtualChange(value) {
		const option = this.props.option.toJS()
		const index = option.findIndex(item => item.id == value)
		this.setState({
			img_url: option[index].img_url
		})
	}

	handleSendMessage() {
		const {setFieldsValue} = this.props.form
		this.props.form.validateFields((errors, values) => {
			const sid = this.context.location.query.id
			this.props.actions.sendVirtualMessage({sid, ...values}).then(resolve => {
				setFieldsValue({'message': ''})
				message.success(resolve.errormsg)
				this.props.actions.getMessageList(this.context.location.query)
			})
		})
	}

	handleCreateRole() {
		const id = this.context.location.query.id
		this.props.form.validateFields((errors, values) => {
			const img_url = this.state.role_img
			const name = values.name
			this.props.actions.updateVirtualRole('add', id, {img_url, name}).then(resolve => {
				message.success('创建成功！')
				this.setState({
					popover: !this.state.popover
				})
				this.props.actions.getVirtualRoleList(this.context.location.query)
			})

		})
	}

	handlePopover() {
		this.setState({
			popover: !this.state.popover
		})
	}

	deleteRole(id) {
		this.props.actions.delVirtualRole(id).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.getVirtualRoleList(this.context.location.query)
		})
	}

	changeTable(key) {
		if(this.state.tab_key.some(item => item == key)) {
			return
		}
		this.setState({
				tab_key: this.state.tab_key.concat(key)
		})
		switch(key){
			case '1':
			this.props.actions.getVirtualRoleList(this.context.location.query)
			break
			case '2':
			this.props.actions.getMessageList(this.context.location.query)
		}
	}

	renderForm() {
		if(!this.props.pending) {
			const { getFieldProps } = this.props.form
			const option = this.props.option.toJS()
			const head_img = !option.length > 0? this.props.assetsUrl + this.state.img_url: this.props.assetsUrl + (this.state.img_url ||option[0]['img_url'])
			const virtualRoleList = option.length? (<FormItem>
														<Select {...getFieldProps('uid', {
																	initialValue:option[0].id,
																	onChange: this.handleVirtualChange.bind(this)
																})} style={{width: 100}}>
															{
																option.map(item => {	
																	return(
																		<Option key={item.id} value={item.id}>{item.name}</Option>
																	)
																})
															}
														</Select>
													</FormItem>): ''
			const filesProps = {
			  accept: 'image/*',
			  showUploadList: false,
			  beforeUpload: this.uploadFile.bind(this),
			}

			return (
				<div className={styles['live-form']}>
					<Form >
						<Row gutter={8}>
							<Col span={3}>
								<div>
									<img className={styles['head-img']} src={option.length? head_img: img}/>
									{virtualRoleList}
								</div>
							</Col>
							<Col span={17}>
								<Input {...getFieldProps('message')} type="textarea" rows="6" maxLength="100"/>
								<div style={{float: "right", marginTop: 10}}>
									<Button type="primary" onClick={::this.handleSendMessage}>发送消息</Button>
								</div>
							</Col>
							<Col span={4}>
								<div style={{paddingLeft: 5, paddingRight: 5}}>
							      <Dragger {...filesProps} >
							        <p className="ant-upload-drag-icon" style={{ height: 70, paddingTop: 5 }}>
							          <Icon type="picture" />
							        </p>
							        <p className="ant-upload-text" style={{paddingBottom: 5}}>发送图片</p>
							      </Dragger>
								</div>
							</Col>
						</Row>
					</Form>
				</div>
			)
		}
	}

	renderPagination() {
		const params = this.props.params.toJS()
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

		return(
			<div className="pagination">
				<Pagination {...pagination}/>
			</div>
		)
	}

	renderTabs() {
		const { getFieldProps } = this.props.form
		const option = this.props.option.toJS()
		const list = this.props.content.toJS()
		const fileProps = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.uploadRole.bind(this),
			fileList: this.state.role_img ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.role_img
			}] : []
		}

		 const formItemLayout = {
		      labelCol: { span: 7 },
		      wrapperCol: { span: 14 },
		 }

		 const nameProps = getFieldProps('name', {
		 	rules: [
		       { required: true, message: '请输入角色名称' }
			],
		 })

		 const content = (
		 	<div>
		 		<div onClick={::this.handlePopover} className={styles['icon-close']}><IconFont type="close"/></div>
			 	<Form  horizontal style={{width: 400,marginTop: 10}}>
			 		<FormItem {...formItemLayout} label="角色名称：">
			 			<Input {...nameProps}/>
			 		</FormItem>

			 		<FormItem
			          {...formItemLayout}
			          label="上传图片："
			          hasFeedback
			          >
			            <Upload {...fileProps}>
							<Icon type="plus" />
						</Upload>
			        </FormItem>
			        <div style={{textAlign: 'right'}}>
			        	<Button onClick={::this.handleCreateRole} type="primary">保存</Button>
			        </div>
			 	</Form>
		 	</div>
		 )

		return(
			<div style={{marginTop: 10,overFlow: 'scroll'}}>
				<Tabs defaultActiveKey="1" onChange={::this.changeTable}>
				    <TabPane tab={<span><Icon type="user" />角色</span>} key="1">
				    	<div className={styles['box-list']}>
					    	<div className={styles['box-item']}>
						   	 	<Popover 
						   	 		visible={this.state.popover} 
						   	 		placement="bottomLeft" 
						   	 		trigger="click" 
						   	 		content={content}
						   	 		onClick={::this.handlePopover}
						   	 		>
						    		<div className={styles['create-role']}>
										<span style={{fontSize: 24}}><Icon type="plus"/></span>
										<div className="ant-upload-text">创建角色</div>
									</div>
								</Popover>
							</div>
							{
								option.map(item => {
									return(
										<div className={styles['box-item']}>
											<Popconfirm title="确定要删除这个角色吗？" onConfirm={this.deleteRole.bind(this, item.id)}>
					 							<div  className={styles['box-close']}><IconFont type="icon-close"/></div>
					 						</Popconfirm>
											<img className={styles['img-item']} src={ item.img_url? this.props.assetsUrl + item.img_url: img}/>
											<div className={styles['box-name']}>{item.name}</div>
										</div>
									)
								})
							}
						</div>
				    </TabPane>
				    <TabPane tab={<span><Icon type="message" />已发送消息</span>} key="2">
				      	<ul className={styles['content']}>
				      		{
				      			list.map(item => {
				      				return(
				      					<li key={item.id} className={styles['content-item']}>
				      						<div className={styles['item-left']}>
				      							<div><img  className="head-img" src={this.props.assetsUrl + item.image} /></div>
				      							<div><span style={{marginLeft: 5}}>{item.nick}</span></div>
				      						</div>
				      						<div className={styles['item-center']}>{item.message}</div>
				      						<div className={styles['item-right']}>{format(item.create_time * 1000, 'yyyy-MM-dd hh:mm:ss')}</div>
				      					</li>
				      				)
				      			})
				      		}
				      	</ul>
						{this.renderPagination()}
				    </TabPane>
				 </Tabs>
			 </div>
		)
	}

	render() {
		const formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 20
			}
		}

		return (
			<div>
				{this.renderForm()}
				{this.renderTabs()}
			</div>
		)
	}
}