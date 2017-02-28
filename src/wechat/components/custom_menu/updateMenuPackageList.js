import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Select from 'antd/lib/select'
import Modal from 'antd/lib/modal'


const FormItem = Form.Item

const Option = Select.Option


@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			type: ''
		}
	}

	static contextTypes = {
		location: PropTypes.object.isRequired,
		router: PropTypes.object.isRequired
	}

	handleCancel() {
		this.props.toggle(undefined, 'visible_3')
	}

	onChangeType(value) {
		this.setState({
			type: value
		})
	}

	handleSubmit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const info = this.props.info
			const parentKey = info.parentKey
			values.type = this.state.type
			if(values.type == 'media_id') values.value = values.media
			if(values.type == 'view_limited') values.value = values.view
			info.hasOwnProperty('childKey')? this.props.handleUpdate(values, parentKey+'', info.childKey): this.props.handleUpdate(values, parentKey)
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
		}
		if(nextProps.info.name && !this.props.visible ) {
			this.setState({
				type: nextProps.info.type,
			})
		}
	}

	renderForm() {

		const { getFieldProps } = this.props.form
		const select = this.props.select
		const info = this.props.info
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 14
			}
		}

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入名称' }
			],
			initialValue: info.name
		})

		const typeProps = getFieldProps('type', {
			rules: [
				{ required: true, message: '请选择菜单类型' }
			],
			initialValue: info.type

		})

		const contentProps = getFieldProps('value', {
			
			initialValue: info.type != 'view_limited' && info.type != 'media_id'? info.content: ''

		})

		const viewProps = getFieldProps('view', {
			initialValue:info.type == 'view_limited'? info.content: ''
		})

		const mediaProps = getFieldProps('media', {
			initialValue:info.type == 'media_id'? info.content: ''
		})

		return(
			<Form horizontal >
				<FormItem
		          {...formItemLayout}
		          label="名称："
		          hasFeedback
		          >
		          <Input {...nameProps} />
			    </FormItem>
			    
			    <FormItem
		          {...formItemLayout}
		          disabled
		          label="菜单类型："
		          hasFeedback
		          >
		           <Select  {...typeProps}  onChange={::this.onChangeType} value={this.state.type} placeholder="请选择类型" style={{ width: 180 }}>
		        		{
		        			select.menuType.map(item => {
		        				return <Option key={item.key} value={item.key}>{item.value}</Option>
		        			})
		        		}
		        	</Select>
			    </FormItem>

			     <div hidden={this.state.type != 'media_id'}>
			        <FormItem  
					{...formItemLayout} 
					label="素材："
					hasFeedback
					>
	    	        	<Select 
	    	        	 showSearch
	    	        	 notFoundContent="无法找到"
	    	        	 optionFilterProp="children"
	    	        	 {...mediaProps}  
	    	        	 placeholder="请选择素材" 
	    	        	 style={{ width: 180 }}

	    	        	 >
	    	        		{
	    	        			select.allMaterial.map(item => {
	    	        				return <Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        			})
	    	        		}
	    	        	</Select>
			        </FormItem>
				</div>

				<div hidden={this.state.type != 'view_limited'}>
			        <FormItem  
					{...formItemLayout} 
					label="图文："
					hasFeedback
					>
	    	        	<Select 
	    	        	 showSearch
	    	        	 notFoundContent="无法找到"
	    	        	 optionFilterProp="children"
	    	        	 {...viewProps}
	    	        	 placeholder="请选择图文" 
	    	        	 style={{ width: 180 }}>
	    	        		{
	    	        			select.allTxt.map(item => {
	    	        				return <Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        			})
	    	        		}
	    	        	</Select>
			        </FormItem>
				</div>

				<div hidden={this.state.type == 'view_limited' || this.state.type == 'media_id' }>
					<FormItem 
					{...formItemLayout}
					 label="内容："
					 hasFeedback
					 >
						<Input {...contentProps}/>
					</FormItem>
				</div>
			</Form>
		)
	}

	render() {
		return(
			<Modal 
				title="编辑"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				confirmLoading={this.props.updateLoading}
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}