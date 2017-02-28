import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Modal from 'antd/lib/modal'
import city from 'Application/utils/city'
import Cascader from 'antd/lib/cascader'
import safeString from 'safeString'

const FormItem = Form.Item

const Option = Select.Option


@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_2')
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			this.props.handleAdd(values)
		})
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
		const select = this.props.select
		const cityList = this.props.cityList
		const info = this.props.info
		return(
			<Form horizontal >
				<FormItem {...formItemLayout} label="名称：">
					<Input value={info.name} readOnly/>
				</FormItem>
				<FormItem {...formItemLayout} label="备注：">
					<Input value={info.remark} readOnly type="textarea" rows="6"/>
				</FormItem>
				<FormItem  {...formItemLayout} label="个性化菜单：">
    	        	<Select value={safeString(info.menu_id)} readOnly placeholder="请选择" style={{ width: 180 }}>
    	        		{
    	        			select.packageList.map(item => {
    	        				return <Option key={item.id} value={item.id+''}>{item.name}</Option>
    	        			})
    	        		}
    	        	</Select>
		        </FormItem>
		        <FormItem  {...formItemLayout} label="微信分组：">
    	        	<Select value={safeString(info.group_id)} readOnly placeholder="请选择" style={{ width: 180 }}>
    	        		{
    	        			select.weixinGroup.map(item => {
    	        				return <Option key={item.group_id} value={item.group_id+''}>{item.name}</Option>
    	        			})
    	        		}
    	        	</Select>
		        </FormItem>
				<FormItem  {...formItemLayout} label="性别：">
    	        	<Select value={safeString(info.sex)} readOnly placeholder="请选择" style={{ width: 180 }}>
    	        		<Option key={0} value=''>未选择</Option>
    	        		{
    	        			select.sexList.map(item => {
    	        				return <Option key={item.id} value={item.id+''}>{item.name}</Option>
    	        			})
    	        		}
    	        	</Select>
		        </FormItem>
		        <FormItem  {...formItemLayout} label="国家：">
    	        	<Select value={safeString(info.country)} readOnly placeholder="请选择" style={{ width: 180 }}>
    	        		<Option key={0} value=''>未选择</Option>
    	        		<Option key={1} value='中国'>中国</Option>
    	        	</Select>
		        </FormItem>
		        <FormItem  {...formItemLayout} label="位置：">
    	        	<Cascader  value={[info.province, info.city]} options={city} readOnly/>
		        </FormItem>
		        <FormItem  {...formItemLayout} label="客户端类别：">
    	        	<Select value={safeString(info.client_platform_type)} readOnly placeholder="请选择" style={{ width: 180 }}>
    	        		<Option key={0} value=''>未选择</Option>
    	        		{
    	        			select.clientType.map(item => {
    	        				return <Option key={item.id} value={item.id+''}>{item.name}</Option>
    	        			})
    	        		}
    	        	</Select>
		        </FormItem>
				<FormItem  {...formItemLayout} label="语言：">
    	        	<Select value={safeString(info.language)} readOnly placeholder="请选择" style={{ width: 180 }}>
    	        		{
    	        			select.languageList.map(item => {
    	        				return <Option key={item.key} value={item.key}>{item.value}</Option>
    	        			})
    	        		}
    	        	</Select>
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