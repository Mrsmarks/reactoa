import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Button from 'antd/lib/button'
import Table from 'antd/lib/table'
import Select from 'antd/lib/select'
const Option = Select.Option
import Form from 'antd/lib/form'
const FormItem = Form.Item
import Icon from 'antd/lib/icon'
import Key from 'Application/decorators/key'
import Popconfirm from 'antd/lib/popconfirm'
import Message from 'antd/lib/message'

@Key(['content'])
@Form.create()
export default class StoreComp extends React.Component {
	constructor(props, context) {
		super(props, context)
	}

	static propTypes = {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired,
		listLoading: PropTypes.bool.isRequired,
		selectData: PropTypes.instanceOf(Immutable.Map).isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	addStore = () => {
		this.context.router.push({
			pathname: '/card-voucher/store/store-add'
		})
	}

	syncStoreLists = () => {
		this.props.actions.syncStoreList().then(response => {
			Message.success(response.errormsg)
		})
	}

	handleDelStore = id => {
		this.props.actions.deleteStore(id).then(response => {
			Message.success(response.errormsg)
		})
	}

	searchStore = () => {
		const params = this.props.params.toJS()
		let values = this.props.form.getFieldValue('availableStatus')
		const query = {
			...params,
			available_state:values
		}
		delete query.count
		this.props.actions.fetchStoreLists(query)
	}

	handleCheckStore = id => {
		this.context.router.push({
			pathname: '/card-voucher/store/store-check',
			query:{
				id:id
			}
		})
	}

	handleEditStore = (id, category) => {
		this.context.router.push({
			pathname: '/card-voucher/store/store-edit',
			query:{
				id: id,
				categoryId: category?category.split(',')[0]:''			
			}
		})
		
	}

	handleSyncStore = id => {
		this.props.actions.syncStoreOne(id).then(response => {
			Message.success(response.errormsg)
		})
	}

	handlePageChange = (nextPage, pageSize) => {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname:'/card-voucher/store/index',
			query:query
		})
		this.props.actions.fetchStoreLists(query)
	}

	renderToolbar() {
		const selectData = this.props.selectData
		const params = this.props.params

		const { getFieldProps } = this.props.form

		const availableStatusProps = getFieldProps('availableStatus',{
		})

		return (
			<div className="toolbar">
				<Form inline>
					<Button type="primary" icon="plus" style={{marginLeft:10}} onClick={this.addStore}>新建门店</Button>
					<Button type="primary" icon="plus" style={{marginLeft:20}} onClick={this.syncStoreLists}>同步门店列表</Button>

					<FormItem label="类型：" style={{ marginLeft:20 }}>
						<Select style={{ width: 150 }} {...availableStatusProps} placeholder="请选择类型">
					    	<Option key={'x'} value="-1">全部</Option>
						{
							selectData.get('availableStatus').map(item => 
								<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
							)
						}
						</Select>
					</FormItem>
					<Button type="primary" icon="search" onClick={this.searchStore}>查询</Button>
				</Form>
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()

		const handleCheckStore = id => _ => {
			return this.handleCheckStore(id)
		}

		const handleEditStore = (id, category) => _ => {
			return this.handleEditStore(id, category)
		}

		const handleSyncStore = id => _ => {
			return this.handleSyncStore(id)
		}

		const handleDelStore = id => _ => {
			return this.handleDelStore(id)
		}

		const columns = [{
			title: '公众号',
			dataIndex: 'acname',
			key: 'acname'
		},{
			title: '门店名称',
			dataIndex:'business_name',
			key: 'business_name'
		},{
			title: '分店名称',
			dataIndex: 'branch_name',
			key: 'branch_name'
		},{
			title: '审核状态',
			dataIndex: 'available_state_name',
			key: 'available_state_name'
		},{
			title: '修改状态',
			dataIndex: 'update_status_name',
			key: 'update_status_name'
		},{
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return(
					<div>
					    { obj.is_synch == 1? <a style={{marginLeft:5}} onClick={ handleSyncStore(obj.id) }>同步</a> : '' }
						<a style={{marginLeft:5}} onClick={ handleCheckStore(obj.id) }>查看</a>
						{ obj.edit == 1? <a style={{marginLeft:5}} onClick={ handleEditStore(obj.id, obj.categories) }>编辑</a> : ''}
						<Popconfirm title="确定要删除吗？" onConfirm= { handleDelStore(obj.id) }>
							<a style={{marginLeft:5}}>删除</a>
						</Popconfirm>					
					</div>
				)
			}
		}]
		const params = this.props.params.toJS()

		const pagination = {
			total: +params.count,
			current: +params.page,
			onChange: this.handlePageChange,
			showSizeChanger:true,
			pageSize: +params.psize,
			onShowSizeChange: this.handlePageChange,
			showTotal:function(){
				return `共${params.count}条`
			}.bind(this)
		}

		return (
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