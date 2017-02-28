import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import TimePicker from 'antd/lib/time-picker'
import Modal from 'antd/lib/modal'

import format from 'Application/utils/formatDate'


const FormItem = Form.Item

const Option = Select.Option

@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			end_time: ''
		}
	}
	

	handleCancel() {
		this.props.toggle(undefined, 'visible')
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
	}

	handleSubmit() {
		const info = this.props.info
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			console.log(values)
			Object.keys(info).length > 0? values.key = info.key: values.key = ''
			this.props.setDataSource(values)
		})
	}

	renderForm() {
		const { getFieldProps } = this.props.form
		const type = this.context.location.query.type
		const info = this.props.info
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const idProps = getFieldProps('prize_id', {
			rules: [
				{ required: true, message: '请选择奖品' }
			],
			initialValue: Object.keys(info).length > 0? this.props.info.prize_id+'': ''
		})

		const numProps = getFieldProps('lucky_num', {
			rules: [
				{ required: true, message: '请设置最大中奖数量' }
			],
			initialValue: Object.keys(info).length > 0? this.props.info.lucky_num+'': ''

		})
		
		const lotteryItem = type == 'lottery'? <div><FormItem
		          {...formItemLayout}
		          label="中奖因子："
		          disabled
		          hasFeedback
		          >
		          <Input {...getFieldProps('factor', {
						rules: [
							{ required: true, message: '请设置中奖因子' }
						],
						initialValue: Object.keys(info).length > 0? this.props.info.factor+'': ''
					})} />
		        </FormItem>

		         <FormItem
		          {...formItemLayout}
		          label="因子长度："
		          disabled
		          hasFeedback
		          >
		          <Input {...getFieldProps('factor_len', {
						rules: [
							{ required: true, message: '请设置因子长度' }
						],
						initialValue: Object.keys(info).length > 0? this.props.info.factor_len+'': ''
					})} />
		        </FormItem></div>: ''


		return(
			<Form horizontal >
	        	<FormItem
		          {...formItemLayout}
		          label="奖品："
		          disabled
		          hasFeedback
		          >
		          <Select {...idProps}>
		          	{
		          		this.props.select.map(item => {
		          			return (
		          				<Option key={item.id} value={item.id+""} >
		          					{item.name}
		          				</Option>
		          			)
		          		})
		          	}
		          </Select>
		        </FormItem>

		        {lotteryItem}

		        <FormItem
		          {...formItemLayout}
		          label="最大中奖数量："
		          disabled
		          hasFeedback
		          >
		          <Input {...numProps} />
		        </FormItem>
			</Form>
		)
	}

	render() {
		return(
			<Modal 
				title={Object.keys(this.props.info).length > 0? "修改": "新增奖品"}
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}