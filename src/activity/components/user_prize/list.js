import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
import Cascader from 'antd/lib/cascader'
import DatePicker from 'antd/lib/date-picker'
import format from 'Application/utils/formatDate'
import message from 'antd/lib/message'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'

const FormItem = Form.Item

@Key(['content'])
@Form.create()
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
	}

	static propTypes= {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired
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
	      	const formatDate = {}
	      	formatDate.aid = values.active? values.active[0]: ''
	      	formatDate.prize_id = values.active? values.active[1]: ''
	      	formatDate.start_time = values.start? format(values.start): ''
	      	formatDate.end_time = values.end? format(values.end): ''
	      	console.log(formatDate)
	      	const page = 1
	      	this.context.router.push({
				pathname: '/activity/user-prize/list',
				query: {
					page,
					...formatDate
				}
			})
			this.props.actions.fetchUserPrizeList({page, ...formatDate})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/user-prize/list',
			query: query
		})
		this.props.actions.fetchUserPrizeList(query)
	}

	exportUserPrizeList() {
    	this.props.form.validateFields((errors, values) => {
    		if (!!errors) {
		        return
	      	}
	      	const aid = values.active? values.active[0]: ''
	      	const prize_id = values.active? values.active[1]: ''
	      	const start_time = values.start? format(values.start): ''
	      	const end_time = values.end? format(values.end): ''
	      	if(!aid) message.error('请选择一个活动才可导出数据！')
    		else window.location.href = `${this.props.backend_domain}/activity/activity-user-prize/export?aid=${aid}&prize_id=${prize_id}&start_time=${start_time}&end_time=${end_time}`
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const select = this.props.select.toJS()
		const activeProps = getFieldProps('active', {
			
		})
		const startTimeProps = getFieldProps('start', {

		})
		const endTimeProps = getFieldProps('end', {

		})
		return (
			<div className="toolbar">
				<Form inline >
					<span style={{marginLeft:5}}> </span>					
					<FormItem  label="所属活动/奖品：">
	    	        	<Cascader {...activeProps} options={select}/>
		        	</FormItem>
		        	<FormItem  label="时间：">
	    	        	<DatePicker {...startTimeProps} placeholder="开始时间"/>
	    	        	<span style={{marginLeft: 5}}></span>
	    	        	<DatePicker {...endTimeProps} placeholder="结束时间"/>
		        	</FormItem>
					<Button onClick={::this.handleSearch} type="primary" >
						<Icon type="search" />
						 查询
					</Button>
					<span style={{marginLeft: 5}}></span>	
					<Button type="ghost" onClick={::this.exportUserPrizeList}>
						<Icon type="eye" />
						 导出中奖名单
					</Button>				
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const select = this.props.select.toJS()

		const columns = [{
			title: '活动名称',
			dataIndex: 'aid',
			key: 'aid',
			render(type, obj) {
				const info = select.find(item => item.aid == type)
				const name = info? info.name: ''
				return (
					<span>{name}</span>
				)
			}
		}, {
			title: '奖品',
			dataIndex: 'prize_id',
			key: 'prize_id',
			render(id, obj) {
				var name = ''
				const activity = select.find(item => item.aid == obj.aid)
				if(activity){
					const prize = activity.children.find(item1 => item1.id == id)
					if(prize)  name = prize.name
				}
				return (
					<span>{name}</span>
				)
			}
		}, {
			title: '中奖人',
			dataIndex: 'uid_name',
			key: 'uid_name',
		}, {
			title: '手机号',
			dataIndex: 'uid_mobile',
			key: 'uid_mobile',
		}, {
			title: '兑换码',
			dataIndex: 'redeem_code',
			key: 'redeem_code',
		}, {
			title: '来源',
			dataIndex: 'source_desc',
			key: 'source_desc',
		}, {
			title: '使用状态',
			dataIndex: 'use_status_desc',
			key: 'use_status_desc',
		}, {
			title: '充值状态',
			dataIndex: 'deposit_status_desc',
			key: 'deposit_status_desc'
		}, {
			title: '中奖时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render(time) {
				return (
					<span>{format(time*1000, 'yyyy-MM-dd hh:mm:ss')}</span>
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
				dataSource={dataSource}
				columns={columns}
				pagination={ pagination }
				loading={this.props.loading}
			/>
		)
	}

	render() {
		const select = this.props.select.toJS()
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
			</div>
		)
	}
}