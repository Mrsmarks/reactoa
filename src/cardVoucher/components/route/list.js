import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Form from 'antd/lib/form'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Popconfirm from 'antd/lib/popconfirm'
import Table from 'antd/lib/table'
import message from 'antd/lib/message'
import Input from 'antd/lib/input'
import Key from 'Application/decorators/key'
import Select from 'antd/lib/select'
const FormItem = Form.Item
const Option = Select.Option
@Key(['content'])
@Form.create()
export default class PictureComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			card_white_list:'',
			route_white_list:''
		}
	}

	static propTypes = {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}


	addRoute = () => {
		this.context.router.push({
			pathname:'/card-voucher/route/add'
		})
	}

	handlePageChange = (nextPage, pageSize) => {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		console.log(query)
		this.context.router.push({
			pathname: '/card-voucher/route/index',
			query:query
		})
		this.props.actions.fetchCardVoucherRoutes({ page:nextPage,psize:pageSize })
	}

	hanleCheck(id) {
		this.context.router.push({
			pathname:'/card-voucher/route/check',
			query: {
				id:id
			}
		})
	}

	handleEidt(id) {
		this.context.router.push({
			pathname:'/card-voucher/route/edit',
			query: {
				id: id
			}
		})
	}

	handleRemove(id) {
		this.props.actions.delCardVoucherRoute(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}
	handleSelect1(val){
		this.setState({
			route_white_list: val
		})
	}
	handleSelect2(val){
		this.setState({
			card_white_list: val
		})
	}
	handleSearch = () =>{
		let name = this.props.form.getFieldValue('tag')
		const params = {
			name:name,
			route_white_list:this.state.route_white_list,
			card_white_list:this.state.card_white_list
		}
	     this.props.actions.fetchCardVoucherRoutes(params)
	}
	renderToolbar() {
		const { getFieldProps } = this.props.form
		const tagProps = getFieldProps('tag', {
			rules: [
				{ required: false, message: '请输入名称' },
			]
		})
		const handleSelect1 = e => {
			return this.handleSelect1(e)
		}
		const handleSelect2 = e => {
			return this.handleSelect2(e)
		}
        return (
        	<div className="toolbar">
	        	<Form inline>
	        		<Button type="primary" onClick={this.addRoute}>
	        			<Icon type="plus"/>
	        			添加
	        		</Button>
	        		<span style={{marginLeft:5}}> </span>
					<FormItem style={{marginLeft:10}} label="名称："  >
						<Input {...tagProps} type="text"  placeholder="请输入名称"  />
					</FormItem>	
					<FormItem style={{marginLeft:10}} label="卡券白名单："  >
						<Select defaultValue="" style={{ width: 120 }} onChange={handleSelect1} placeholder="请选择">
							<Option value="">请选择</Option>
						    <Option value="0">关闭</Option>
						    <Option value="1">开启</Option>
					    </Select>
					</FormItem>
					<FormItem style={{marginLeft:10}} label="路由白名单："  >
						<Select defaultValue="" style={{ width: 120 }} onChange={handleSelect2} placeholder="请选择">
							<Option value="">请选择</Option>
							<Option value="0">关闭</Option>
							<Option value="1">开启</Option>
					    </Select>
					</FormItem>	
					<Button type="primary" onClick={ () => this.handleSearch()}>
						<Icon type="search" />
						 查询
					</Button>	
	        	</Form>
        	</div>	
        )
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		
		const hanleCheck = id => _ => {
			return this.hanleCheck(id)
		}

        const handleEidt = id => _ => {
        	return this.handleEidt(id)
        }

		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}
		const columns = [{
			title: '公众号',
			dataIndex: 'acid',
			key: 'acid',
			width: 150
		},{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		},{
			title: '模版路径',
			dataIndex: 'template_path',
			key: 'template_path'
		},{
			title: '卡券id',
			dataIndex: 'cardid',
			key: 'cardid'
		},{
			title: '操作',
			key: 'operation',
			width:150,
			render(_, obj){
				return(
					<div>
						<a style={{marginLeft: 5}} onClick={ hanleCheck(obj.id) }>查看</a>
						<a style={{marginLeft: 5}} onClick={ handleEidt(obj.id) }>编辑</a>
						<Popconfirm title="确定要删除吗？" onConfirm={ handleRemove(obj.id) }>
							<a style={{marginLeft: 5}}>删除</a>
						</Popconfirm>
					</div>
				)
			}
		}]

		const params = this.props.params.toJS()
		console.log(params)
		const pagination = {
			total: params.count,
			current: params.page,
			onChange: ::this.handlePageChange,
			showSizeChanger: true,
			pageSize: +params.psize,
			onShowSizeChange: ::this.handlePageChange,
			showTotal: function() {
				return `共${params.count}条`
			}.bind(this)
		}	

		return(
			<Table
				dataSource={dataSource}
				columns={columns}
				loading={this.props.loading} 
				pagination={pagination}
			/>
		)
	}

	render() {
		return(
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
			</div>		    	
		)
	}
}