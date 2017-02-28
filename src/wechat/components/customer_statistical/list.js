import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import DatePicker from 'antd/lib/date-picker'

import Key from 'Application/decorators/key'
import format from 'Application/utils/formatDate'

const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item

@Key(['content'])
@Form.create()
export default class CustomerStatisticalComp extends React.Component {

	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired

	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	reload(query) {
		this.context.router.push({
			pathname: '/wechat/customer-statistical/list',
			query
		})
		this.props.actions.fetchCustomerStatisticalList(query)
	}

	handleSearch() {
		const { name = '', date = [] } = this.props.form.getFieldsValue(['name', 'date'])
		let start_time, end_time
		if (date.length) {
			start_time = format(date[0])
			end_time = format(date[1])
		}

		this.reload({
			name,
			start_time,
			end_time,
			page: this.props.params.get('page'),
			psize: this.props.params.get('psize'),
		})

	}

	onPageChange(nextPage, pageSize) {
		const params = this.props.params
		const query = {
			page: nextPage,
			psize: pageSize,
			name: params.get('name'),
			start_time: params.get('start_time'),
			end_time: params.get('end_time')
		}

		this.reload(query)
	}

	renderToolbar() {
		const { form: { getFieldProps }, params } = this.props

		const nameProps = getFieldProps('name', {
			initialValue: params.get('name')
		})

		let dateVal = []
		if (params.get('start_time') && params.get('end_time')) {
			dateVal = [params.get('start_time'), params.get('end_time')]
		}
		const dateProps = getFieldProps('date', {
			initialValue: dateVal
		})

		return (
			<div className="toolbar">
				<Form inline >
					<FormItem  label="客服账号：">
	    	        	<Input type="text" {...nameProps}/>
		        	</FormItem>
		        	<FormItem  label="时间：">
		        		<RangePicker {...dateProps}/>
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
		const columns = [{
			title: '客服账号',
			dataIndex: 'worker',
			key: 'worker'
		}, {
			title: '接受消息数',
			dataIndex: 'receive_msg_num',
			key: 'receive_msg_num'
		}, {
			title: '回复消息数',
			dataIndex: 'reply_msg_num',
			key: 'reply_msg_num'
		},{
			title: '创建时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render(v) {
				return format(v * 1000, 'yyyy-MM-dd hh:mm:ss')
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
				loading={this.props.listLoading}
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