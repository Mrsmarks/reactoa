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
import Auth from 'Application/components/auth'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'

@Key(['content'])
@Form.create()
export default class WhitelistComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
    		fileList : []
    	}
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

	addList = () => {
		this.context.router.push({
			pathname: '/card-voucher/whitelist/add'
		})
	}

	searchList = () => {
		const params = this.props.params.toJS()
		let values = this.props.form.getFieldValue(['objectType'])
		let value = this.props.form.getFieldValue(['whiteType'])
		const query = {
			type:values,
			white_list_type:value
		}
		delete query.count
		this.props.actions.fetchCardVoucherWhite(query)
	}

	hanleCheck(id) {
		this.context.router.push({
			pathname:'/card-voucher/whitelist/check',
			query: {
				id:id
			}
		})
	}

	handleEidt(id) {
		this.context.router.push({
			pathname:'/card-voucher/whitelist/edit',
			query: {
				id: id
			}
		})
	}

	handleRemove = id => {
		this.props.actions.delCardVoucherWhite(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	} 

	handlePageChange = (nextPage, pageSize) => {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname:'/card-voucher/whitelist/index',
			query:query
		})
		this.props.actions.fetchCardVoucherWhite(query)
	}

	uploadFile(file) {
		this.props.actions.uploadExcelFile(file, '/wechat/wechat-cards-white-list/import').then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	renderToolbar() {

		const selectData = this.props.selectData
		
		const { getFieldProps } = this.props.form

		const objectTypeProps = getFieldProps('objectType',{
		})

		const whiteTypeProps = getFieldProps('whiteType',{
		})

		const dataExportProps = {
			beforeUpload: this.uploadFile.bind(this)
		}

		return (
			<div className="toolbar" style={{ border:"1px solid #ccc",padding:15 }}>
				<Form inline>
					<Button type="primary" icon="plus" style={{marginLeft:10}} onClick={this.addList}>添加</Button>
					<FormItem label="作用对象：" style={{ marginLeft:20 }}>
						<Select style={{ width: 150 }} {...objectTypeProps} placeholder="请选择作用对象" >
					    	<Option key={'x'} value="-1">请选择作用对象</Option>
					    	{
								selectData.get('objectType').map(item => 
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
								)
							}
						</Select>
					</FormItem>
					<FormItem label="白名单类型：" style={{ marginLeft:20 }}>
						<Select style={{ width: 150 }} {...whiteTypeProps} placeholder="请选择白名单类型" >
					    	<Option key={'x'} value="-1">请选择白名单类型</Option>
					    	{
								selectData.get('whiteType').map(item => 
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
								)
							}
						</Select>
					</FormItem>
					<Button type="primary" icon="search" onClick={this.searchList}>查询</Button>
					<span style={{marginLeft: 15}}></span>
					<Auth type={["wechat-cards-white-list-add"]}>
						<Upload {...dataExportProps} showUploadList={false}>
							<Button type="ghost">
								<Icon type="folder" />
								数据导入
							</Button>
						</Upload>
					</Auth>
					<span style={{marginLeft: 15}}></span>
					<Auth type={["wechat-cards-white-list-add"]}>
						<Button type="ghost" onClick={() => {window.location.href = `${this.props.backend_domain}/template/wechat-cards-white-list-template.xlsx`}}>
							<Icon type="download" />
							导入模板下载
						</Button>
					</Auth>
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
			dataIndex: 'acname',
			key: 'acname'
		},{
			title: '作用对象',
			dataIndex:'type_name',
			key: 'type_name'
		},{
			title: '值',
			dataIndex: 'value',
			key: 'value'
		},{
			title: '白名单类型',
			dataIndex: 'white_list_type_name',
			key: 'white_list_type_name'
		},{
			title: '白名单内容',
			dataIndex: 'white_list_content',
			key: 'white_list_content'
		},{
			title: '操作',
			key: 'operation',
			width:150,
			render(_, obj) {
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