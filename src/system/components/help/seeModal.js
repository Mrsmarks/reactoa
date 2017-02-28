import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Modal from 'antd/lib/modal'


const FormItem = Form.Item


@Form.create()

export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_1')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
	}

	renderForm() {

		const { getFieldProps } = this.props.form

		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}


		const renderTableName = () => {
			if(this.props.info.type == 2){
				return (
					<FormItem
					{...formItemLayout}
					label="表名："
					hasFeedback
					>
					<Input defaultValue={this.props.info.parent_name} disabled/>
					</FormItem>
				)
			}
		}

		return(
			<Form horizontal>
				{ renderTableName() }
				<FormItem
					{...formItemLayout}
					label={this.props.info.type == 1? '表名：': '字段名：'}
					hasFeedback
				>
					<Input value={this.props.info.name} readOnly/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="备注："
					hasFeedback
				>
					<Input value={this.props.info.remark} readOnly/>
				</FormItem>
			</Form>
		)
	}

	render() {
		return(
			<Modal 
				title="查看"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				onOk={::this.handleCancel}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}