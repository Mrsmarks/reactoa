import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import IconFont from 'Application/components/iconFont'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Select from 'antd/lib/select'
import styles from './index.scss'
import Switch from 'antd/lib/switch'
import Key from 'Application/decorators/key'
import message from 'antd/lib/message'

const FormItem = Form.Item
const Option = Select.Option
/**
 * 微信墙－活动统计-活动统计
 */
@Key(['content'])
@Form.create()
export default class ScreenComp extends React.Component {

	constructor(props, context) {
		super(props, context)
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		getSid: PropTypes.func.isRequired
	}


	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	const id = this.context.location.query.id
	      	this.context.router.push({
				pathname: '/wall-details/data-activity/index',
				query: {
					page,
					id,
					...values
				}
			})
			this.props.actions.fetchActivityDataById({page, id, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall-details/data-activity/index',
			query: query
		})
		this.props.actions.fetchActivityDataById(query)
	}

	renderHeaderCard() {
		return (
			<ul className={styles['head']}>
				<li><IconFont type="icon-user" width={20} height={20}/><span> 新增粉丝：<i className={styles['b-font']}>{this.props.fensi_count||0}</i> 人</span></li>
				<li><IconFont type="icon-draw"  width={20} height={20}/><span> 参与活动：<i className={styles['b-font']}>{this.props.count||0}</i> 人</span></li>
				<li><IconFont type="icon-message"  width={20} height={20}/><span> 发送消息：<i className={styles['b-font']}>{this.props.mess_count||0}</i> 条</span></li>
			</ul>
		)
	}

	setUserDrawStauts(uid) {
		const query = this.context.location.query
		this.props.actions.setUserDrawStauts(uid).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchActivityDataById(query)

		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		return (
			<div className={styles['toolbar']}>
				<div className={styles['table-title']}>参与人员</div>

				<div>
					<Form inline >
						<FormItem>
							<Input {...getFieldProps('nickname')} placeholder="搜索昵称"/>
						</FormItem>
						<Button onClick={::this.handleSearch} size="default" type="primary">
							<Icon type="search"/>
							查询
						</Button>

					</Form>
				</div>
			</div>
		)
	}

	renderTable() {

		const dataSource = this.props.content.toJS()
		const setUserDrawStauts = uid => _ => {
			return this.setUserDrawStauts(uid)
		}
		const columns = [{
			title: '昵称',
			dataIndex: 'nickname',
			key: 'nickname',
		}, {
			title: '姓名',
			dataIndex: 'uid_name',
			key: 'uid_name',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return(
					<div>
						<Switch onChange={setUserDrawStauts(obj.uid)} checked={obj.draw_status} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />}/> 抽奖
					</div>
				)
			}
		}]
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


		return (
			<Table
				columns={columns}
				dataSource={dataSource}
				pagination={pagination}
			/>
		)
	}



	render() {
		return (
			<div>
				{this.renderHeaderCard()}
				{this.renderToolbar()}
				{this.renderTable()}
			</div>
			
		)
	}
}