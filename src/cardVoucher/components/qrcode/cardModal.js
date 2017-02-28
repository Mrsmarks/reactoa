import React, { PropTypes } from 'react'
import Immutable from 'immutable'

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
	constructor(props, context) {
		super(props, context)
		this.state = {
			type: '',
			selectedObj: {}
		}
	}
	static propTypes = {
		cardList: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired,
		context: PropTypes.object.isRequired,
		actions: PropTypes.object.isRequired,
		toggle: PropTypes.func.isRequired
	}
	handleCancel() {
		this.props.toggle(undefined, 'modalVisible')
	}

	handleOk() {
		this.props.onCardsChange(this.state.selectedObj)
		this.props.toggle(undefined, 'modalVisible')
	}
	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	this.props.actions.fetchCardVoucherQrcodeSelector(this.props.form.getFieldValue(['tag']))
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
		const tagProps = getFieldProps('tag', {
			rules: [
				{ required: false, message: '请输入名称' },
			]
		})

		return(
				<Form inline >
					<span style={{marginLeft:5}}> </span>
					<FormItem style={{marginLeft:10}} label="名称：">
						<Input {...tagProps} type="text"  placeholder="请输入名称" style={{height:28}}/>
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
		  dataIndex: 'name',
		}]
		console.log(this.props.cardList)
		const dataSource =  this.props.cardList.toJS()
		let tempThis = this;
		// 通过 rowSelection 对象表明需要行选择
		const rowSelection = {
			type: 'checkbox',
			onChange(selectedRowKeys, selectedRows) {
				tempThis.state.selectedObj = selectedRows
				console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
			},
			onSelect(record, selected, selectedRows) {
				tempThis.state.selectedObj = selectedRows
				console.log(record, selected, selectedRows);
			},
			onSelectAll(selected, selectedRows, changeRows) {
				tempThis.state.selectedObj = selectedRows
				console.log(selected, selectedRows, changeRows);
			}
		}

		return(
			<Table 
				rowSelection={rowSelection}
				dataSource={dataSource}
				columns={columns}
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
				onOk={::this.handleOk}
			>
				{ this.renderForm() }
				{ this.renderTable() }
			</Modal>
		)
	}
}