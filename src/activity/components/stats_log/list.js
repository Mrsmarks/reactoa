import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'

import message from 'antd/lib/message'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'


import Row from 'antd/lib/row'
import DatePicker from 'antd/lib/date-picker'
import format from 'Application/utils/formatDate'


import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'

const FormItem = Form.Item
const Option = Select.Option

@Key(['content'])
@Form.create()
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			aid: '',
			ready: false
		}
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

	componentWillReceiveProps(nextProps) {
		if(nextProps.select.toJS().activityList.length > 0 && !this.state.ready) {
			this.setState({
				aid: nextProps.select.toJS().activityList[0].aid,
				ready: true
			})
		}
	}

	handleChange(value) {
		this.setState({
			aid: value
		})
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	const aid = this.state.aid
	        values.start_time = values.start_time? format(values.start_time): ''
	        values.end_time = values.start_time? format(values.end_time): ''
	      	this.context.router.push({
				pathname: '/activity/activity-stats-log',
				query: {
					page,
					...values,
					aid
				}
			})
			this.props.actions.fetchStatsLogList({ page, aid, ...values })
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/activity-stats-log',
			query: query
		})
		this.props.actions.fetchStatsLogList(query)
	}

	exportData() {
    	this.props.form.validateFields((errors, values) => {
    		if (!!errors) {
		        return
	      	}
	      	const aid = this.state.aid
	      	const { mobile, name } = values
	      	const start_time = values.start_time? format(values.start_time): ''
	      	const end_time = values.end_time? format(values.end_time): ''
	      	if(!aid) message.error('请选择一个活动才可导出数据！')
    		else window.location.href = `${this.props.backend_domain}/activity/activity-stats/export-for-log?aid=${aid}&mobile=${mobile}&name=${name}&start_time=${start_time}&end_time=${end_time}`
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const select = this.props.select.toJS()
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const startTimeProps = getFieldProps('start_time', {

		})
		const endTimeProps = getFieldProps('end_time', {

		})
		const mobileProps = getFieldProps('mobile', {

		})
		const usernameProps = getFieldProps('name', {

		})
	
		return (
			<div className="toolbar">
				<Form inline >
					<Row style={{marginBottom: 10}}>
						<FormItem  label="活动：">
		    	        	<Select allowClear value={this.state.aid} onChange={::this.handleChange} placeholder="请选择活动" style={{ width: 150 }}>
		    	        		{
		    	        			select.activityList.map(item => {
		    	        				return (
		    	        					<Option id={item.aid} key={item.aid}>{item.name}</Option>
		    	        				)
		    	        			})
		    	        		}
		    	        	</Select>
			        	</FormItem>

			        	<FormItem label="手机号码：">
			        		<Input {...mobileProps}/>
			        	</FormItem>

			        	<FormItem label="用户昵称：">
			        		<Input {...usernameProps}/>
			        	</FormItem>

						<Button onClick={::this.handleSearch} type="primary" >
							<Icon type="search" />
							 查询
						</Button>
			        	<span> </span>
						<Button type="ghost" onClick={::this.exportData}>
							<Icon type="eye" />
							 导出当前数据
						</Button>
					</Row>
					<Row>
						<FormItem label="时间：">
			        		<DatePicker {...startTimeProps}/>
			        		<span> </span>
			        		<DatePicker {...endTimeProps}/>
			        	</FormItem>		
		        	</Row>		
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const data = this.props.data.toJS()
		const select = this.props.select.toJS()
		const option = data.activityType == 'lottery'? {
			title: '摇奖结果',
			dataIndex: 'result',
			key: 'result',
		}: {}
		const columns = [{
			title: '活动名称',
			dataIndex: 'activity_name',
			key: 'activity_name',
		}, {
			title: '用户',
			dataIndex: 'user_name',
			key: 'user_name',
		}, {
			title: '电话号码',
			dataIndex: 'mobile',
			key: 'mobile',
		}, {
			title: '奖品',
			dataIndex: 'prize_name',
			key: 'prize_name',
		}, {...option}, {
			title: '兑换码',
			dataIndex: 'redeem_code',
			key: 'redeem_code',
		}, {
			title: '来源',
			dataIndex: 'source',
			key: 'source',
		}, {
			title: '渠道',
			dataIndex: 'channel',
			key: 'channel',
		}, {
			title: '是否中奖',
			dataIndex: 'is_win',
			key: 'is_win',
		} ]
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
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
			</div>
		)
	}
}