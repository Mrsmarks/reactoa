import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import DatePicker from 'antd/lib/date-picker'
import format from 'Application/utils/formatDate'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
import message from 'antd/lib/message'

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
				pathname: '/activity/activity-stats-num',
				query: {
					page,
					...values,
					aid
				}
			})
			this.props.actions.fetchStatsNumList({page, aid, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/activity-stats-num',
			query: query
		})
		this.props.actions.fetchStatsNumList(query)
	}

	exportData() {
    	this.props.form.validateFields((errors, values) => {
    		if (!!errors) {
		        return
	      	}
	      	const aid = this.state.aid
	      	const { check_type } = values
	      	const start_time = values.start_time? format(values.start_time): ''
	      	const end_time = values.end_time? format(values.end_time): ''
	      	if(!aid) message.error('请选择一个活动才可导出数据！')
    		else window.location.href = `${this.props.backend_domain}/activity/activity-stats/export-for-number?aid=${aid}&check_type=${check_type}&start_time=${start_time}&end_time=${end_time}`
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
		const checkProps = getFieldProps('check_type', {

		})
		return (
			<div className="toolbar">
				<Form inline >
					<span style={{marginLeft:5}}> </span>					
					<FormItem  label="活动：">
	    	        	<Select value={this.state.aid} onChange={::this.handleChange} placeholder="请选择活动" style={{ width: 150 }}>
	    	        		{
	    	        			select.activityList.map(item => {
	    	        				return (
	    	        					<Option value={item.aid+''} key={item.aid}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>

		        	<FormItem  label="查看类型：">
	    	        	<Select {...checkProps} placeholder="请选择查看类型" style={{ width: 150 }}>
	    	        		<Option value='day' key='day'>按日</Option>
	    	        		<Option value='hour' key='hour'>按时</Option>
	    	        	</Select>
		        	</FormItem>

		        	<FormItem label="时间：">
		        		<DatePicker {...startTimeProps}/>
		        		<span> </span>
		        		<DatePicker {...endTimeProps}/>
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
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const select = this.props.select.toJS()

		const columns = [{
			title: '活动名称',
			dataIndex: 'activity_name',
			key: 'activity_name',
		}, {
			title: '参与次数',
			dataIndex: 'partake_num',
			key: 'partake_num',
		}, {
			title: '活动人数',
			dataIndex: 'user_num',
			key: 'user_num',
		}, {
			title: '时间',
			dataIndex: 'partake_time',
			key: 'partake_time',
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
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
			</div>
		)
	}
}