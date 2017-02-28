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
		this.props.toggle(undefined, 'visible_1')
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
			var info = this.props.info
			values.type = this.state.type
			if(values.type == 'media_id') values.value = values.media
			if(values.type == 'view_limited') values.value = values.view
			info?this.props.handleAdd(values, info.parentKey): this.props.handleAdd(values)
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible === false) {
			this.props.form.resetFields()
			this.setState({type: ''})
		}
	}

	// checkLength(rule, value, cb) {
	// 	if(value) {

	// 	}
	// }

	renderForm() {

		const { getFieldProps } = this.props.form
		const select = this.props.select
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
				{ required: true, message: '请输入按钮名称' },
				// { validator: ::this.checkLength }
			]
		})

		const typeProps = getFieldProps('type', {
			rules: [
				{ required: true, message: '请选择菜单类型' }
			],
			onChange: ::this.onChangeType
		})

		const contentProps = getFieldProps('value', {
			
		})

		const mediaProps = getFieldProps('media', {

		})


		const viewProps= getFieldProps('view', {

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
		           <Select  {...typeProps}  placeholder="请选择类型" style={{ width: 180 }}>
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
				title="新增"
				visible={this.props.visible}
				cancelText='返回'
				onCancel={::this.handleCancel}
				confirmLoading={this.props.addLoading}
				onOk={::this.handleSubmit}
			>
				{this.renderForm()}
			</Modal>
		)
	}
}