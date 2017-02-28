import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import message from 'antd/lib/message'
import Key from 'Application/decorators/key'

const FormItem = Form.Item
const Option = Select.Option
/**
 * 微信墙－活动统计-摇大奖
 */
@Key(['content'])
@Form.create()
export default class ScreenComp extends React.Component {

	constructor(props, context) {
		super(props, context)
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
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
				pathname: '/wall-details/data-shake-prize/index',
				query: {
					page,
					id,
					...values
				}
			})
			this.props.actions.fetchShakePrizeList({page, ...values, id})
    	})
	}

	handlePageChange() {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall-details/data-shake-prize/index',
			query: query
		})
		this.props.actions.fetchShakePrizeList(query)
	}

	exportData() {
		const id = this.context.location.query.id
    	this.props.form.validateFields((errors, values) => {
    		if (!!errors) {
		        return
	      	}
	      	const { prize_type, shake_prize_id } = values
	      	window.location.href = `${this.props.backend_domain}/wechatWall/wechat-wall-shake-prize-record/export?sid=${id}&shake_prize_id=${shake_prize_id||''}&prize_type=${prize_type||''}`
			
		})
	}

	renderToolbar() {
		const select = this.props.select.toJS()
		const { getFieldProps } = this.props.form
		return (
			<div className="toolbar">			
				<Form inline>
					<FormItem label="标题：">
						<Select {...getFieldProps('shake_prize_id')} placeholder="请选择奖项" style={{width: 150}}>
							{
								select.shakePrizeList.map(item => {
									return(
										<Option key={item.id} value={item.id+''}>{item.title}</Option>
									)
								})
							}
						</Select>
					</FormItem>
					<FormItem label="奖品类型：">
						<Select {...getFieldProps('prize_type')} placeholder="请选择状态" style={{width: 150}}>
							{
								select.shakePrizeType.map(item => {
									return(
										<Option key={item.id} value={item.id+''}>{item.name}</Option>
									)
								})
							}
						</Select>
					</FormItem>
					<span style={{marginLeft: 5}}></span>
					<Button type="primary" size="default" onClick={::this.handleSearch}>
						<Icon type="logout"/>
						查询
					</Button>
					<span style={{marginLeft: 5}}></span>
					<Button type="ghost" size="default" onClick={::this.exportData}>
						<Icon type="logout"/>
						导出
					</Button>
				</Form>
			</div>
		)
	}

	renderTable() {
			const columns = [{
				title: '昵称',
				dataIndex: 'nick_name',
				key: 'nick_name'
			}, {
				title: 'openID',
				dataIndex: 'openId',
				key: 'openId',
			}, {
				title: '中奖时间',
				dataIndex: 'create_time',
				key: 'ticreate_timeme',
			}, {
				title: '奖品类型',
				dataIndex: 'prize_type',
				key: 'prize_type',
				render(type) {
					return(
						<span>{type == 1? '实物':'现金'}</span>
					)
				}
			}, {
				title: '奖品名称',
				dataIndex: 'prize_name',
				key: 'prize_name',
			}, {
				title: '奖品',
				dataIndex: 'prize_id',
				key: 'prize_id',
			},]

			const dataSource = this.props.content.toJS()

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
				{this.renderToolbar()}
				{this.renderTable()}
			</div>
			
		)
	}
}