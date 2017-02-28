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
	constructor(props, context) {
		super(props, context)
		this.state = {
			type: '',
			modalVisible:false,
			card: ""
		}
	}
	static propTypes = {
		
	}
	handleCancel() {
		this.props.toggle(undefined, 'modalVisible')
	}

	handleOk() {
		this.props.toggle(undefined, 'modalVisible')
	}
	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	this.props.actions.fetchCardVoucherRedeem(this.props.form.getFieldValue(['tag']))
    	})
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
					<FormItem style={{marginLeft:10}}>
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
		return(
			<Table 
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