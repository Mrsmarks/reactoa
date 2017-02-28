import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Key from 'Application/decorators/key'

const FormItem = Form.Item
const Option = Select.Option
/**
 * 微信墙－活动统计-摇一摇
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

	handlePageChange() {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall-details/data-shake/index',
			query: query
		})
		this.props.actions.fetchShakeDataList(query)
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
				pathname: '/wall-details/data-shake/index',
				query: {
					page,
					id,
					...values
				}
			})
			this.props.actions.fetchShakeDataList({page, ...values, id})
    	})
	}

	exportData() {
		const id = this.context.location.query.id
    	this.props.form.validateFields((errors, values) => {
    		if (!!errors) {
		        return
	      	}
	      	const { shake_id } = values
	      	window.location.href = `${this.props.backend_domain}/wechatWall/wechat-wall-shake-record/export?sid=${id}&shake_id=${shake_id||''}`
		})
	}



	renderToolbar() {
		const select = this.props.select.toJS()
		const { getFieldProps } = this.props.form
		const { shake_id } = this.context.location.query
		return (
			<div className="toolbar">			
				<Form inline>
					<FormItem label="摇一摇：">
						<Select {...getFieldProps('shake_id', {
								initialValue: shake_id || '1',
						})}  placeholder="请选择奖项" style={{width: 150}}>
							{
								select.map(item => {
									return(
										<Option key={item.id} value={item.id+''}>【{item.time}】秒{item.title}</Option>
									)
								})
							}
						</Select>
					</FormItem>
					<span style={{marginLeft: 5}}></span>
					<Button type="primary" size="default" onClick={::this.handleSearch}>
						<Icon type="search"/>
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
				title: '排行',
				dataIndex: 'rank',
				key: 'rank'
			}, {
				title: '昵称',
				dataIndex: 'nick_name',
				key: 'nick_name',
			}, {
				title: '摇一摇次数',
				dataIndex: 'num',
				key: 'num',
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

			const dataSource = this.props.content.toJS()
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