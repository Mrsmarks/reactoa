import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Radio from 'antd/lib/radio'
import Tag from 'antd/lib/tag'
import Modal from 'antd/lib/modal'
const img = require('Application/resources/404.png')


const FormItem = Form.Item
const RadioGroup = Radio.Group


@Form.create()

export default class MainModal extends React.Component {

	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible')
	}

	renderForm() {

		const { getFieldProps } = this.props.form
		const option = this.props.option
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		return(
			<Form horizontal form={this.props.info.form}>
				<FormItem
					{...formItemLayout}
					label="企业名称："
					hasFeedback
				>
					<Input value={this.props.info.name} readOnly/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="logo："
					hasFeedback
				>
					<img className='head-img' src={this.props.info.logo? this.props.assets_domain + this.props.info.logo: img}/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="联系人："
					hasFeedback
				>
					<Input value={this.props.info.contact} readOnly/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="联系邮箱："
					hasFeedback
				>
					<Input value={this.props.info.email} readOnly/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="联系电话："
					hasFeedback
				>
					<Input value={this.props.info.tel} readOnly/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="区域："
					hasFeedback
				>
					<Input value={`${this.props.info.province}/${this.props.info.city}/${this.props.info.district}`} readOnly/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label="地址："
					hasFeedback
				>
					<Input value={this.props.info.address} readOnly/>
				</FormItem>
				<FormItem
					{...formItemLayout}
					label='简介：'
					hasFeedback
				>
					<Input value={this.props.info.intro} type="textarea" rows="6" readOnly/>
				</FormItem>

				<FormItem
		          {...formItemLayout}
		          label="使用状态："
		          hasFeedback
		          >
		          <RadioGroup value={+this.props.info.use_state} readOnly>
		          	{
		          		option.userState.map(item => {
		          			return(
		          				<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		          			)
		          		})
		          	}
		          </RadioGroup>
		        </FormItem>

		        {/*<FormItem
		          {...formItemLayout}
		          label="部门数据互通状态："
		          hasFeedback
		          >
		          <RadioGroup value={+this.props.info.department_data_exchange} readOnly>
		          	{
		          		option.userState.map(item => {
		          			return(
		          				<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
		          			)
		          		})
		          	}
		          </RadioGroup>
		        </FormItem>*/}
			</Form>
		)
	}

	render(){
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