import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'

import Upload from 'antd/lib/upload'
import Form from 'antd/lib/form'

import Select from 'antd/lib/select'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'

import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'

import AddModal from './addModal'
import EditModal from './editModal'
import SeeModal from './seeModal'

const FormItem = Form.Item
const Option = Select.Option

@Key(['content'])
@Form.create()
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info:{},
			visible_1: false,
			visible_2: false,
			visible_3: false,
			prizeList: []
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

	toggleModal(info, visible, cb) {
		if(info) {
			if(cb) {
				cb(info)
			}
			this.setState({
				[visible]: !this.state[visible],
				info: info
			})
		}else{
			this.setState({
				[visible]: !this.state[visible],
			})
		}	
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	this.context.router.push({
				pathname: '/activity/code/list',
				query: {
					page: page,
					...values
				}
			})
			this.props.actions.fetchCodeList({page, ...values})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/code/list',
			query: query
		})
		this.props.actions.fetchCodeList(query)
	}

	getPrizeList(value) {
		const select = this.props.select.toJS()
		this.props.form.setFieldsValue({'pid': ''})
		const list = select.find(item => item.aid == value)
		if(list){
			this.setState({
				prizeList: list.children
			})
		}
	}

	handleAdd(info) {
		this.props.actions.addCodeList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
		})	
	}

	handleUpdate(info, id) {
		this.props.actions.updateCodeList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_2: false })
		})	
	}

	handleRemove(id) {
		this.props.actions.delCodeList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	uploadFile(file) {
		this.props.actions.uploadExcelFile(file, '/activity/activity-redeem-code/import-data').then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const aidProps = getFieldProps('aid', {
			onChange: ::this.getPrizeList
		})

		const prizeProps = getFieldProps('pid', {

		})

		const dataExportProps = {
			beforeUpload: this.uploadFile.bind(this),
		}

		const select = this.props.select.toJS()
		
		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["activity-redeem-code-add"]}>
						<Button onClick={() => {this.toggleModal(undefined, 'visible_1')}} type="primary">
							<Icon type="plus" />
							添加
						</Button>
					</Auth>
					<span> </span>
					<FormItem  label="活动类型：">
	    	        	<Select {...aidProps} size="large" placeholder="请选择活动" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			select.map(item => {
	    	        				return (
	    	        					<Option key={item.aid} value={item.aid+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<FormItem  label="奖品：">
	    	        	<Select {...prizeProps} size="large" placeholder="请选择奖品" style={{ width: 150 }}>
	    	        		{
	    	        			this.state.prizeList.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
					<Button onClick={::this.handleSearch} >
						<Icon type="search" />
						 查询
					</Button>
					<span style={{marginLeft: 5}}></span>
					<Button type="ghost" onClick={() => {window.location.href = `${this.props.backend_domain}/template/activity-redeem-code.xlsx`}}>
						<Icon type="download" />
						导入模板下载
					</Button>
					<span style={{marginLeft: 5}}></span>
					<Upload {...dataExportProps} showUploadList={false}>
						<Button type="ghost">
							<Icon type="upload" />
							数据导入
						</Button>
					</Upload>
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const select = this.props.select.toJS()
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const toggleModal = (obj, visible, cb) => _ => {
			return this.toggleModal(obj, visible, cb)
		}

		const columns = [{
			title: '活动名称',
			dataIndex: 'aid',
			key: 'aid',
			render(id, obj) {
				const info = select.find(item => item.aid == id)
				const name = info? info.name: ''
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '奖品名称',
			dataIndex: 'prize_id',
			key: 'prize_id',
			render(id, obj) {
				var name = ''
				select.forEach(item => {
					const info = item.children.find(item1 => item1.id == id)
					if(info){
						name = info.name
						return
					}
				})
				return(
					<span>{name}</span>
				)
			}
		}, {
			title: '兑换码',
			dataIndex: 'redeem_code',
			key: 'redeem_code',
		}, {
			title: '状态',
			dataIndex: 'change_status',
			key: 'change_status',
			render(status) {
				return(
					<span>{status? '已兑换': '未兑换'}</span>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["activity-redeem-code-check"]}>
							<a onClick={toggleModal(obj, 'visible_3')} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["activity-redeem-code-update"]}>
							<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["activity-redeem-code-delete"]}>
							<Popconfirm title="确定要删除吗？" onConfirm={handleRemove(obj.id)}>
								<a>删除</a>
							</Popconfirm>
						</Auth>
					</div>
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
				<AddModal
					toggle={::this.toggleModal}
					select={select}
					visible={this.state.visible_1}
					addLoading={this.props.addLoading}
					handleAdd={::this.handleAdd}
				/>
				<EditModal
					info={this.state.info}
					toggle={::this.toggleModal}
					select={select}
					visible={this.state.visible_2}
					updateLoading={this.props.updateLoading}
					handleUpdate={::this.handleUpdate}
				/>
				<SeeModal
					info={this.state.info}
					toggle={::this.toggleModal}
					select={select}
					visible={this.state.visible_3}
				/>
			</div>
		)
	}
}