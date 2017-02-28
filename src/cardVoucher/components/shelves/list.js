import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import format from 'Application/utils/formatDate'
import Form from 'antd/lib/form'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Key from 'Application/decorators/key'
import Input from 'antd/lib/input'

const FormItem = Form.Item

@Key(['content'])
@Form.create()
export default class PictureComp extends React.Component {
	constructor(props, context) {
		super(props, context)
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


	addQrcode = () => {
		this.context.router.push({
			pathname:'/card-voucher/qrcode/add'
		})
	}

	handlePageChange = (nextPage, pageSize) => {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/card-voucher/qrcode/index',
			query:query
		})
		this.props.actions.fetchCardVoucherQrcodeList({ page:nextPage,psize:pageSize })
	}
	hanleGenerate(id) {
		this.props.actions.generateCardVoucherQrcode(id).then(resolve => {
			message.success(resolve.errormsg)
			this.context.router.push({
				pathname:'/card-voucher/qrcode/index'
			},reject => {
				message.error(reject.err.errormsg)
			})
		})
	}
	hanleCheck(id) {
		this.context.router.push({
			pathname:'/card-voucher/qrcode/check',
			query: {
				id:id
			}
		})
	}

	handleEidt(id) {
		this.context.router.push({
			pathname:'/card-voucher/qrcode/edit',
			query: {
				id: id
			}
		})
	}

	handleRemove(id) {
		this.props.actions.delCardVoucherQrcode(id).then(resolve => {
			message.success(resolve.errormsg)
			this.context.router.push({
				pathname:'/card-voucher/qrcode/index'
			})
		})
	}
	handleSearch = () =>{
		let name = this.props.form.getFieldValue('tag')
	     this.props.actions.fetchCardVoucherQrcodeList({name:name})
	}
	renderToolbar() {
		const { getFieldProps } = this.props.form
		const tagProps = getFieldProps('tag', {
			rules: [
				{ required: false, message: '请输入名称' },
			]
		})
		 
        return (
        	<div className="toolbar">
	        	<Form inline>
		        		<Button type="primary" onClick={this.addQrcode}>
		        			<Icon type="plus"/>
		        			添加
		        		</Button>
	        		<span style={{marginLeft:5}}> </span>
					<FormItem style={{marginLeft:10}} label="名称："  >
						<Input {...tagProps} type="text"  placeholder="请输入名称"  />
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
		const hanleGenerate = id => _ => {
			return this.hanleGenerate(id)
		}
		const hanleCheck = id => _ => {
			return this.hanleCheck(id)
		}

        const handleEidt = id => _ => {
        	return this.handleEidt(id)
        }

		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}
		const showQRCode = obj => _ => {
			Modal.info({
				title: '`' + obj.name + '` 的二维码',
				content: <img style={{width: 300, marginLeft: -19}} src={`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${obj.ticket}` 

			} />
			})
		}
		const columns = [{
			title: '公众号',
			dataIndex: 'acname',
			key: 'acname',
			width: 150
		},{
			title: '名称',
			dataIndex: 'name',
			key: 'name'
		},{
			title: '场景名',
			dataIndex: 'scene_name',
			key: 'scene_name'
		},{
			title: '卡券名',
			dataIndex: 'card_name',
			key: 'card_name'
		},{
			title: '二维码',
			dataIndex: 'qrcode',
			key: 'qrcode',
			render(val,obj) {
				return  val ? <Button type="primary" onClick={showQRCode(obj)}> 查看二维码 </Button> : <div></div>
			}
		},{
			title: '过期时间',
			dataIndex: 'expire_time',
			key: 'expire_time',
			render(val) {
				return format(val * 1000, 'yyyy-MM-dd hh:mm:ss')
			}
		},{
			title: '操作',
			key: 'operation',
			width:150,
			render(_, obj){
				return(
					<div>
						<a style={{marginLeft: 5}} onClick={ hanleGenerate(obj.id) }>同步</a>
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
			showSizeChanger: true,
			pageSize: +params.psize,
			onShowSizeChange: this.handlePageChange,
			showTotal: function() {
				return `共${params.count}条`
			}.bind(this)
		}

		return(
			<Table
				dataSource={dataSource}
				columns={columns}
				pagination={ pagination }
				loading={this.props.loading} 
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