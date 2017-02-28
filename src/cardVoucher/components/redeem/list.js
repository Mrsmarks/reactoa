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
export default class RedeemlistComp extends React.Component {
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
			pathname: '/card-voucher/redeem/add'
		})
	}

	searchList = () => {
		const params = this.props.params.toJS()
		let values = this.props.form.getFieldValue(['cardsList'])
		let value = this.props.form.getFieldValue(['redeemType'])
		let valuey = this.props.form.getFieldValue(['synchType'])
		const query = {
			cardsList:values,
			check_status:value,
			status:valuey
		}
		delete query.count
		this.props.actions.fetchCardVoucherRedeem(query)
	}

	hanleCheck(id) {
		this.context.router.push({
			pathname:'/card-voucher/redeem/check',
			query: {
				id:id
			}
		})
	}

	handleEidt(id) {
		this.context.router.push({
			pathname:'/card-voucher/redeem/edit',
			query: {
				id: id
			}
		})
	}

	handleRemove = id => {
		this.props.actions.delCardVoucherRedeem(id).then(resolve => {
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
			pathname:'/card-voucher/redeem/index',
			query:query
		})
		this.props.actions.fetchCardVoucherRedeem(query)
	}

	uploadFile(file) {
		this.props.actions.uploadExcelFile(file, '/wechat/wechat-cards-redeem-code/import').then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	renderToolbar() {

		const selectData = this.props.selectData
		
		const { getFieldProps } = this.props.form

		const cardsListProps = getFieldProps('cardsList',{
		})

		const redeemTypeProps = getFieldProps('redeemType',{
		})

		const synchTypeProps = getFieldProps('synchType',{
		})

		const dataExportProps = {
			beforeUpload: this.uploadFile.bind(this)
		}

		return (
			<div className="toolbar" style={{ border:"1px solid #ccc",padding:15 }}>
				<Form inline>
					<Button type="primary" icon="plus" style={{marginLeft:10}} onClick={this.addList}>添加</Button>
					<FormItem label="卡卷：" style={{ marginLeft:20 }}>
						<Select style={{ width: 150 }} {...cardsListProps} placeholder="请选择卡卷" >
					    	<Option key={'x'} value="-1">请选择卡卷</Option>
					    	{
								selectData.get('cardsList').map(item => 
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
								)
							}
						</Select>
					</FormItem>
					<FormItem label="兑换类型：" style={{ marginLeft:20 }}>
						<Select style={{ width: 150 }} {...redeemTypeProps} placeholder="请选择兑类型" >
					    	<Option key={'x'} value="-1">请选择兑类型</Option>
					    	{
								selectData.get('redeemType').map(item => 
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
								)
							}
						</Select>
					</FormItem>
					<FormItem label="同步类型：" style={{ marginLeft:20 }}>
						<Select style={{ width: 150 }} {...synchTypeProps} placeholder="请选择同步类型" >
					    	<Option key={'x'} value="-1">请选择同步类型</Option>
					    	{
								selectData.get('synchType').map(item => 
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
								)
							}
						</Select>
					</FormItem>
					<Button type="primary" icon="search" onClick={this.searchList}>查询</Button>
					<span style={{marginLeft: 15}}></span>
					<Auth type={["wechat-cards-redeem-code-add"]}>
						<Upload {...dataExportProps} showUploadList={false}>
							<Button type="ghost">
								<Icon type="folder" />
								数据导入
							</Button>
						</Upload>
					</Auth>
					<span style={{marginLeft: 15}}></span>
					<Auth type={["wechat-cards-redeem-code-add"]}>
						<Button type="ghost" onClick={() => {window.location.href = `${this.props.backend_domain}/template/wechat-cards-redeem-code-template.xlsx`}}>
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
			title: '卡卷名',
			dataIndex: 'card_id',
			key: 'card_id'
		},{
			title: '兑换码',
			dataIndex:'redeem_code',
			key: 'redeem_code'
		},{
			title: '同步状态',
			dataIndex: 'status',
			key: 'status',
			render(id,obj){
				return(
					obj.status = obj.status === 1 ? "有效" : "删除"
				)
			}
		},{
			title: '兑换状态',
			dataIndex: 'check_status',
			key: 'check_status',
			render(id,obj){
				return(
					obj.check_status = obj.check_status === 0 ? "未兑换" : "已兑换"
				)
			}
		},{
			title: '操作',
			key: 'operation',
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