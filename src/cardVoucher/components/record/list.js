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
import Select from 'antd/lib/select'
import SeeModal from './seeModal'
const FormItem = Form.Item
const Option = Select.Option
@Key(['content'])
@Form.create()
export default class PictureComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state= {
			info:{},
			visible: false
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
	handlePageChange = (nextPage, pageSize) => {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/card-voucher/record/index',
			query:query
		})
		this.props.actions.fetchCardVoucherQrcodeList({ page:nextPage,psize:pageSize })
	}
	hanleCheck(id) {
		this.context.router.push({
			pathname:'/card-voucher/record/check',
			query: {
				id:id
			}
		})
	}
	handleSearch = () =>{
		let tag = this.props.form.getFieldValue('tag')
	     this.props.actions.fetchCardVoucherRecordList({cards_status:tag})
	}
	renderToolbar() {
		const { getFieldProps } = this.props.form
		const cardStatus = this.props.cardStatus.toJS()
		const tagProps = getFieldProps('tag', {
		})
		 
        return (
        	<div className="toolbar">
	        	<Form inline>
	        		<FormItem
			         label="事件状态"
			        >
						<Select {...tagProps} size="large" placeholder="事件状态" style={{ width: 150 }}>
	    	        		{
	    	        			cardStatus.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
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

		const toggleModal = (obj, visible, initChildSource) => _ => {
			return this.toggleModal(obj, visible, initChildSource)
		}
		const columns = [{
			title: '公众号',
			dataIndex: 'acname',
			key: 'acname',
			width: 150
		},{
			title: '用户',
			dataIndex: 'uid_name',
			key: 'uid_name'
		},{
			title: '卡券',
			dataIndex: 'card_id',
			key: 'card_id'
		},{
			title: '事件状态',
			dataIndex: 'cards_status',
			key: 'cards_status'
		},{
			title: '时间',
			dataIndex: 'create_time',
			key: 'create_time',
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
						<a style={{marginLeft: 5}} onClick={toggleModal(obj, 'visible')}>查看</a>
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
				<SeeModal 
					info={this.state.info}
					visible={this.state.visible}
					toggle={::this.toggleModal}
				/>
			</div>		    	
		)
	}
}