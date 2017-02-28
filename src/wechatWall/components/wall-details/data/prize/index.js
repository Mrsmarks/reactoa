import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'
import Table from 'antd/lib/table'
import Key from 'Application/decorators/key'
import format from 'Application/utils/formatDate'
const FormItem = Form.Item
const Option = Select.Option
/**
 * 微信墙－活动统计-获奖情况
 */
@Form.create()
@Key(['content'])
export default class ScreenComp extends React.Component {

	constructor(props, context) {
		super(props, context)
		this.state={
			selectRows: ''
		}
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
				pathname: '/wall-details/data-prize/index',
				query: {
					page,
					id,
					...values
				}
			})
			this.props.actions.fetchDrawDataById({page, ...values, id})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall-details/data-prize/index',
			query: query
		})
		this.props.actions.fetchDrawDataById(query)
	}

	exportData() {
		const id = this.context.location.query.id
    	this.props.form.validateFields((errors, values) => {
    		if (!!errors) {
		        return
	      	}
	      	const { did, nickname } = values
	      	window.location.href = `${this.props.backend_domain}/wechatWall/wechat-wall-draw-record/export?sid=${id}&did=${did||''}&nickname=${nickname||''}`
			
		})
	}

	checkSinger(id) {
		this.props.actions.checkDraw(id).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchDrawDataById(this.context.location.query)
		})
	}

	checkBatch() {
		const ids = this.state.selectRows
		this.props.actions.checkDrawList(ids).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchDrawDataById(this.context.location.query)
		})
	}

	onSelectCheck(record, selected, selectedRows) {
		var list = []
		selectedRows.forEach(item => {
			if(item.change_status == 1) {
				list.push(item.id)
			}
		})
		this.setState({
			selectRows: list.join()
		})
	}

	renderToolbar() {
		const select = this.props.select.toJS()
		const { getFieldProps } = this.props.form
		return (
			<div className="toolbar">			
				<Form inline>
					<FormItem label="奖项：">
						<Select {...getFieldProps('did')} placeholder="请选择奖项"  style={{width: 150}}>
							{
								select.drawList.map(item => {
									return(
										<Option key={item.id} value={item.id+''}>{item.prize_name}</Option>
									)
								})
							}
						</Select>
					</FormItem>
					<FormItem label="状态：">
						<Select {...getFieldProps('change_status')} placeholder="请选择状态"  style={{width: 150}}>
							{
								select.drawType.map(item => {
									return(
										<Option key={item.id} value={item.id+''}>{item.name}</Option>
									)
								})
							}
						</Select>
					</FormItem>
					<FormItem>
						<Input {...getFieldProps('nickname')} placeholder="搜索昵称"/>
					</FormItem>
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
		const checkSinger = id => _ => {
			return this.checkSinger(id)
		}
		const checkBatch = _ => _ => {
			return this.checkBatch()
		}
		const columns = [{
				title: '昵称',
				dataIndex: 'nickname',
				key: 'nickname',
			}, {
				title: '奖项',
				dataIndex: 'award_name',
				key: 'award_name',
			}, {
				title: '兑奖状态',
				dataIndex: 'change_status_name',
				key: 'change_status_name',
				render(x) {
					const styleObj = x == "待确认"?{color: '#2db7f5'}: {color: 'red'}
					return(
						<span style={styleObj}>{x}</span>
					)
				}
			}, {
				title: 'openID',
				dataIndex: 'openid',
				key: 'openid',
			}, {
				title: '中奖时间',
				dataIndex: 'create_time',
				key: 'create_time',
				render(time) {
					return(
						<span>{format(time*1000, 'yyyy-MM-dd hh:mm:ss')}</span>
					)
				}
			}, {
				title: '处理时间',
				dataIndex: 'last_update_time',
				key: 'last_update_time',
				render(time) {
					return(
						<span>{format(time*1000, 'yyyy-MM-dd hh:mm:ss')}</span>
					)
				}
			}, {
				title: '操作',
				key: 'operation',
				render(_,obj) {
					const unCheck = <a onClick={checkSinger(obj.id)}>确认</a>
					const check = <span>已确认</span>
					return(
						<div>{obj.change_status == 1? unCheck: check}</div>
					)
				}
			}]

			const dataSource = this.props.content.toJS()

			const rowSelection = {
			 	onSelect: this.onSelectCheck.bind(this)
			}

			return (
				<div>
					<Button type="ghost" style={{marginBottom: 10}} onClick={checkBatch()}>确认</Button>
					<Table 
						columns={columns}
						dataSource={dataSource}
						rowSelection={rowSelection}
					/>
				</div>
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