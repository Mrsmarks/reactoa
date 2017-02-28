import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'
import format from 'Application/utils/formatDate'
import Upload from 'antd/lib/upload'

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
			visible_3: false
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
	      	console.log(values)
	      	const {type, aid, value_num} = {...values}
	      	const page = 1
	      	this.context.router.push({
				pathname: '/activity/white/list',
				query: {
					page,
					type,
					aid,
					value_num
				}
			})
			this.props.actions.fetchWhiteList({page, type, aid, value_num})
    	})
	}

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/activity/white/list',
			query: query
		})
		this.props.actions.fetchWhiteList(query)
	}

	handleAdd(info) {
		this.props.actions.addWhiteList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
		})	
	}

	handleUpdate(info, id) {
		this.props.actions.updateWhiteList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_2: false, info: resolve.result })
		})	
	}

	handleRemove(id) {
		this.props.actions.delWhiteList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	uploadFile(file) {
		this.props.actions.uploadExcelFile(file, '/activity/activity-white-list/import-data').then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const select = this.props.select.toJS()
		const typeProps = getFieldProps('type', {
			
		})
		const valueNumProps = getFieldProps('value_num', {

		})
		const aidProps = getFieldProps('aid', {

		})

		const dataExportProps = {
			beforeUpload: this.uploadFile.bind(this),
		}
		return (
			<div className="toolbar">
				<Form inline >
					<Auth type={["activity-white-list-add"]}>
						<Button onClick={() => {this.toggleModal(undefined, 'visible_1')}} type="primary">
							<Icon type="plus" />
							添加名单
						</Button>
					</Auth>
					<span style={{marginLeft:5}}> </span>					
					<FormItem  label="所属活动：">
	    	        	<Select {...aidProps} size="large" placeholder="请选择类型" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			select.activityList.map(item => {
	    	        				return (
	    	        					<Option key={item.aid} value={item.aid+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<FormItem  label="查询类型：">
	    	        	<Select {...typeProps} size="large" placeholder="请选择类型" style={{ width: 150 }}>
	    	        		<Option key={'x'} value="-1">全部</Option>
	    	        		{
	    	        			select.type.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<FormItem  label="号码：">
	    	        	<Input {...valueNumProps}/>
		        	</FormItem>
					<Button onClick={::this.handleSearch} >
						<Icon type="search" />
						 查询
					</Button>	
					<span style={{marginLeft: 5}}></span>
					<Auth type={["activity-black-list-add"]}>
						<Button type="ghost" onClick={() => {window.location.href = `${this.props.backend_domain}/template/activity-white-list.xlsx`}}>
							<Icon type="download" />
							导入模板下载
						</Button>
					</Auth>
					<span style={{marginLeft: 5}}></span>
					<Auth type={["activity-black-list-add"]}>
						<Upload {...dataExportProps} showUploadList={false}>
							<Button type="ghost">
								<Icon type="upload" />
								数据导入
							</Button>
						</Upload>
					</Auth>						
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

		const toggleModal = (obj, visible, cb ) => _ => {
			return this.toggleModal(obj, visible, cb )
		}

		const columns = [{
			title: '活动名称',
			dataIndex: 'aid',
			key: 'aid',
			render(type, obj) {
				const info = select.activityList.find(item => item.aid == type)
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
				const activity = select.activityList.find(item => item.aid == obj.aid)
				if(activity){
					const prize = activity.children.find(item1 => item1.id == id)
					if(prize)  name = prize.name
				}
				return (
					<span>{name}</span>
				)
			}
		}, {
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			render(type, obj) {
				const info = select.type.find(item => item.id == type)
				const name = info? info.name: ''
				return (
					<span>{name}</span>
				)
			}
		}, {
			title: '号码',
			dataIndex: 'value',
			key: 'value',
		}, {
			title: '有效期',
			dataIndex: 'validity_period',
			key: 'validity_period',
			render(time) {
				return (
					<span>{format(time*1000, 'yyyy-MM-dd hh:mm:ss')}</span>
				)
			}
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<Auth type={["activity-white-list-check"]}>
							<a onClick={toggleModal(obj, 'visible_3')} style={{paddingRight:5}}>查看</a>
						</Auth>
						<Auth type={["activity-white-list-update"]}>
							<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>编辑</a>
						</Auth>
						<Auth type={["activity-white-list-delete"]}>
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
					visible={this.state.visible_1}
					handleAdd={::this.handleAdd}
					addLoading={this.props.addLoading}
					toggle={::this.toggleModal}
					select={select}
				/>
				<EditModal
					visible={this.state.visible_2}
					handleUpdate={::this.handleUpdate}
					updateLoading={this.props.updateLoading}
					toggle={::this.toggleModal}
					select={select}
					info={this.state.info}
				/>
				<SeeModal
					visible={this.state.visible_3}
					toggle={::this.toggleModal}
					select={select}
					info={this.state.info}
				/>
			</div>
		)
	}
}