import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Popconfirm from 'antd/lib/popconfirm'
import Table from 'antd/lib/table'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class UnpassComp extends React.Component {

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		getSid: PropTypes.func.isRequired,
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall-details/screen-ctrl-message/index',
			query: query
		})
		this.props.MessageAduitList(query)
	}

	handleSearch(e) {
		e.preventDefault()
		const query = this.context.location.query
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	this.context.router.push({
				pathname: '/wall-details/screen-ctrl-message/index',
				query: {
					page,
					...query,
					...values
				}
			})
			this.props.MessageAduitList({page, ...query, ...values})
    	})
	}




	renderfailTable() {
		const { getFieldProps } = this.props.form
		const assetsUrl = this.props.assetsUrl
		const option = this.props.option.toJS().refuseType
		const renderFailToolbar = (
			<div className="toolbar">
				<Form inline >
					<FormItem label="拒绝原因：" >
						<Select {...getFieldProps('refuse_type')} placeholder="请选择拒绝原因" style={{width: 150}}>
							{
								option.map(item => {
									return(
										<Option key={item.id} value={item.id+''}>{item.name}</Option>
									)
								})
							}
						</Select>
					</FormItem>
					<Button type="primary" onClick={::this.handleSearch}><Icon type="search"/>查询</Button>
				</Form>
			</div>
		)

		const columns = [{
			title: '头像',
			dataIndex: 'image',
			key: 'image',
			render(img, obj) {
				return(
					<span><img className="head-img" src={obj.type? assetsUrl + img: img}/></span>
				)
			}
		}, {
			title: '昵称',
			dataIndex: 'nick',
			key: 'nick',
		}, {
			title: '审核时间',
			dataIndex: 'last_update_time',
			key: 'last_update_time',
		}, {
			title: '原因',
			dataIndex: 'refuse_name',
			key: 'refuse_name',
			render(obj) {
				return (
					<span>{obj.name}</span>
				)
			}
		}, {
			title: '内容',
			dataIndex: 'message',
			key: 'message',
		}]

		const dataSource = this.props.unpassList	

		const params = this.props.unpassParams
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
			<div>
				{renderFailToolbar}
				<Table 
					columns={columns}
					dataSource={dataSource}
					pagination={pagination}
				/>
			</div>
		)
	}

	render() {
		return(
			<div>{this.renderfailTable()}</div>
		)
	}
}