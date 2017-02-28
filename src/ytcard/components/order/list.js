import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import format from 'Application/utils/formatDate'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
import Input from 'antd/lib/input'

const FormItem = Form.Item
const Option = Select.Option

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
	      	const page = 1
	      	this.context.router.push({
				pathname: '/ytcard/order/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchYtcardOrderList({page, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/ytcard/order/list',
			query: query
		})
		this.props.actions.fetchYtcardOrderList(query)
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const option = this.props.option.toJS()
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		return (
			<div className="toolbar">
				<Form inline >
					<span style={{marginLeft:5}}> </span>					
		        	<FormItem  label="类型：">
	    	        	<Select {...getFieldProps('discount_status')} placeholder="请选择类型" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			option.typeList.map(item => {
	    	        				return (
	    	        					<Option id={item.id} key={item.id}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<Button type="primary" onClick={::this.handleSearch}>
		        		查询
		        	</Button>
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const option = this.props.option.toJS()

		const columns = [{
			title: '用户',
			dataIndex: 'uid',
			key: 'uid',
		}, {
			title: '金额单位分',
			dataIndex: 'coupon',
			key: 'coupon',
		}, {
			title: '活动',
			dataIndex: 'aid',
			key: 'aid',
		}, {
			title: '期数',
			dataIndex: 'config_id',
			key: 'config_id',
		}, {
			title: '状态',
			dataIndex: 'discount_status',
			key: 'discount_status',
			render(status) {
				const obj = {'1':'正在充值', '2': '已充值', '3': '充值失败'}
				return(
					<span>{obj[status]}</span>
				)
			}
		}, {
			title: '备注',
			dataIndex: 'remark',
			key: 'remark',
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