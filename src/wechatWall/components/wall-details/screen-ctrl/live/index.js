import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import styles from './index.scss'
import Icon from 'antd/lib/icon'
import Pagination from 'antd/lib/pagination'
import message from 'antd/lib/message'
import format from 'Application/utils/formatDate'
import img from 'Application/resources/404.png'
const FormItem = Form.Item

/**
 * 微信墙－屏幕控制-直播台
 */
@Form.create()
export default class ScreenComp extends React.Component {

	constructor(props, context) {
		super(props, context)
		this.state = {
			fontNum: 100,
			color: '#666'
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		getSid: PropTypes.func.isRequired
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall-details/screen-ctrl-live/index',
			query: query
		})
		this.props.actions.fetchMessageList(query)
	}


	handleFontNum(event) {
		if(event.target.value.length <= 100){
			this.setState({
				fontNum: 100 - event.target.value.length
			})
			if(event.target.value.length >= 90) {
				this.setState({
					color: 'red'
				})
			}else{
				this.setState({
					color: 'black'
				})
			}
		}
	}

	sendMessage() {
		const id = this.context.location.query.id
		const { setFieldsValue } = this.props.form
		this.props.form.validateFields((errors, values) => {
			this.props.actions.sendMessage(id, values.message).then(resolve => {
				setFieldsValue({'message': ''})
				this.setState({
					fontNum: 100 
				})
				message.success(resolve.errormsg)
				this.props.actions.fetchMessageList({...this.context.location.query})
			})
		})
	}

	sendMessageAgain(id) {
		const sid = this.context.location.query.id
		this.props.actions.sendMessageAgain(sid, id).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchMessageList({...this.context.location.query})
		})
	}

	delMessageList(id) {
		const sid = this.context.location.query.id
		this.props.actions.delMessageList(sid, id).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchMessageList({...this.context.location.query})
		})
	}




	renderForm() {
		const { getFieldProps } = this.props.form
		const messageProps = getFieldProps('message', {
			rules: [
		       { required: true, message: '请输入消息' },
			],
			onChange: ::this.handleFontNum
		})
		return (
			<div className={styles['live-form']}>
				<Form >
					<Input {...messageProps} type="textarea" maxLength="100" rows="6" />
					<div style={{marginTop: 5, color: this.state.color}}>还可以输入{this.state.fontNum}字</div>
					<div style={{float: "right"}}><Button type="primary" onClick={::this.sendMessage}>提交</Button></div>
				</Form>
			</div>
		)
	}

	renderList() {
		const list = this.props.content.toJS()
		const content = list.length? list.map(item => {
							return(
								<li key={item.id} className={styles['content-item']}>
								<div className={styles['item-left']}>
									<div>{item.message}</div>
									<div>{format(item.send_time*1000, 'yyyy-MM-dd hh:mm:ss')}</div>
								</div>
								<div className={styles['item-right']}>
									<Button size="small" type="primary" onClick={() => {this.sendMessageAgain(item.id)}}><Icon type="message"/>再次发送</Button>
									<span style={{marginLeft: 20}}></span>
									<Button size="small" type="ghost" onClick={() => {this.delMessageList(item.id)}}><Icon type="cross-circle-o"/>删除</Button>
								</div>
								</li>
							)
						}): <p style={{textAlign: 'center',marginTop: 10}}>无消息数据</p>
						
					
		return(
			<ul className={styles['content']}>
				<span style={{fontSize: 15,fontWeight: "bold"}}>已发送消息</span>
	      		{content}
	      	</ul>
		)
	}

	renderPagination() {
        if (!this.props.content.size) {
            return null
        }
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
				{this.renderList()}
				{this.renderPagination()}
			</div>
			
		)
	}
}