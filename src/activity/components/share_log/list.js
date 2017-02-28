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
				pathname: '/activity/share-log/list',
				query: {
					page,
					...values
				}
			})
			this.props.actions.fetchShareLogList({page, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/share-log/list',
			query: query
		})
		this.props.actions.fetchShareLogList(query)
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

		const aidProps = getFieldProps('aid', {
			
		})
		return (
			<div className="toolbar">
				<Form inline >
					<span style={{marginLeft:5}}> </span>					
					<FormItem  label="所属活动：">
	    	        	<Select {...aidProps} placeholder="请选择活动" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			select.map(item => {
	    	        				return (
	    	        					<Option id={item.aid} key={item.aid}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
					<Button onClick={::this.handleSearch} type="primary" >
						<Icon type="search" />
						 查询
					</Button>					
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const select = this.props.select.toJS()

		const columns = [{
			title: '公众号名称',
			dataIndex: 'wechat_account',
			key: 'wechat_account',
		}, {
			title: '用户名',
			dataIndex: 'wechat_user',
			key: 'wechat_user',
		}, {
			title: '活动',
			dataIndex: 'activity_name',
			key: 'activity_name',
		}, ]
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