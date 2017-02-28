import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import { Checkbox } from 'antd';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import autoLoading from 'Application/decorators/autoLoading'


const FormItem = Form.Item

const Option = Select.Option

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props, context)
		this.state = {
			type: '',
		}
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			if(this.props.info){
				values.parent_id = this.props.info.id
				values.type = this.state.type
				if(values.type == 'media_id') values.value = values.media
				if(values.type == 'view_limited') values.value = values.view
			}else{
				values.parent_id = 0
			}
			this.props.handleAdd(values)
		})
	}
	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const page = 1
	      	const name = values.name
	      	this.context.router.push({
				pathname: '/wechat/menu/list',
				query: {
					page: page,
					name: values.name
				}
			})
			this.props.actions.fetchMenuList({page, name})
    	})
	}

	handlePageChange = (nextPage, pageSize) => {
		console.log(this.props)
		const query = this.props.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		console.log(query)
		this.props.context.router.push({
			pathname: '/card-voucher/route/add',
			query:query
		})
		this.props.actions.fetchCardVoucherCardList({ page:nextPage,psize:pageSize })
	}
	renderForm() {
		const { getFieldProps } = this.props.form
		const nameProps = getFieldProps('name', {
			rules: [
				{ required: false, message: '请输入路由名称' },
			]
		})

		return(
				<Form inline >
					<span style={{marginLeft:5}}> </span>
					<FormItem style={{marginLeft:10}} label="名称：">
						<Input {...nameProps} type="text"  placeholder="请输入路由名称" style={{height:28}}/>
					</FormItem>	
						<Button onClick={::this.handleSearch} type="primary" >
							<Icon type="search" />
							 查询
						</Button>	
				</Form>
		)
	}

	renderTable() {
		const columns = [{
		  title: '名称：',
		  dataIndex: 'title',
		}]
		const dataSource =  this.props.cardList.toJS()

		// 通过 rowSelection 对象表明需要行选择
		const rowSelection = {
		  onChange(selectedRowKeys, selectedRows) {
		    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
		  },
		  onSelect(record, selected, selectedRows) {
		    console.log(record, selected, selectedRows);
		  },
		  onSelectAll(selected, selectedRows, changeRows) {
		    console.log(selected, selectedRows, changeRows);
		  }
		}
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
				rowSelection={rowSelection}
				dataSource={dataSource}
				columns={columns}
				pagination={ pagination }
				loading={this.props.loading} 
			/>
		)
	}
	render() {
		return(
			<Modal 
				title="选择卡券"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				onOk={::this.handleSubmit}
			>
				{ this.renderForm() }
				{ this.renderTable() }
			</Modal>
		)
	}
}