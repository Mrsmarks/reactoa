import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import message from 'antd/lib/message'
import Select from 'antd/lib/select'

import Modal from 'antd/lib/modal'

const FormItem = Form.Item
const OptGroup = Select.OptGroup
const Option = Select.Option


@Form.create()
export default class MainModal extends React.Component{
	constructor(props, context) {
		super(props, context)
		this.state = {
			visible: false,
			cover_id: '',
			cover_name: '',
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	handleChangeRadio(e) {
		this.setState({
			cover_id: e.target.value,
		})
	}

	handleOk() {
		const option = this.props.option.toJS()
		option.templateList.forEach(item => {
			if(item.id == this.state.cover_id) {
				this.setState({
					cover_name: item.name,
					visible: false
				})
			}
		})
	}

	handleSumbit() {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			values.tid = this.state.cover_id
			values.aid = values.active.join()
			delete values.active
			this.props.actions.addRouteList(values).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push('/activity/route/list')
			})
		})
	}

	renderModal() {
		const option = this.props.option.toJS()
		var i = Math.ceil(option.templateList.length/4)
		var array = []
		for(let n = 1; n < i + 1; n++) {
			array.push(n)
		}
		return(
			<div style={{maxHeight:350, overflow:'auto'}}>
				{
					array.map(index => {
						return (
							<Row key={index} type="flex" style={{height: 110}} justify="start">
								{
									option.templateList.slice((index-1)*4, index*4).map((item, index1) => {
										if(index1 < 4*index ) {
											return (
												<Col key={index1} span={6} style={{textAlign: 'center'}}>
													 <div><img className='head-img' src={this.props.assetsUrl + item.cover_image}/></div>
													 <input type="radio" onChange={::this.handleChangeRadio}   key={item.id} value={item.id+''} name="name"/> {item.name}
												</Col>
											)
										}
									})
								}
							</Row>
						)
					})
				}
			</div>
		)
	}

	toggleModal() {
		this.setState({
			visible: !this.state.visible
		})
	}


	renderForm() {
		const { getFieldProps } = this.props.form
		const option = this.props.option.toJS()
		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 12 }
		}

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入路由名称' }
			]
		})

		const activeProps = getFieldProps('active', {
			rules: [
				{required: true, type:'array', message: '请选择活动'}
			],
		})

		return(
			<Form horizontal style={{marginTop: 30}} >
		        <FormItem  {...formItemLayout} label="路由名称：" hasFeedback>
    	        	<Input {...nameProps}/>
	        	</FormItem>

	        	<FormItem  {...formItemLayout} label="关联活动：" hasFeedback>
	        		<Select
	        			showSearch
	        			notFoundContent="无法找到"
                        optionFilterProp="children"
	        			{...activeProps}
	        			style={{width: '100%'}}
	        			multiple
	        			>
	        			{
	        				option.activityList.map(item => {
	        					return (
	        						<OptGroup key={item.value} label={item.label}>
	        							{
	        								item.children.map(children => {
	        									return (
	        										 <Option value={children.value} key={children.value}>
	        										 	{children.label}
	        										 </Option>
	        									)
	        								})
	        							}
	        						</OptGroup>
	        					)
	        				})
	        			}
	        		</Select>
	        	</FormItem>
		        	
		        <FormItem inline-block {...formItemLayout} label="访问模板：" hasFeedback>
	        	 	<Input value={this.state.cover_name}  onClick={::this.toggleModal} placeholder="点击我选择模板"/>
	        	</FormItem>

	        	<FormItem  {...formItemLayout}>
		        	<Col offset="6">
        	        	<Button type="primary" onClick={::this.handleSumbit} size="large" >确定</Button>
        	        	<Button type="ghost" size="large" onClick={() => {history.back()}} style={{ marginLeft: 40 }}>返回</Button>
        			</Col>
			    </FormItem>
			</Form>
		)
	}
	render() {
		return (
			<div>
				{this.renderForm()}
				<Modal
					title="添加"
					visible={this.state.visible}
					cancelText='返回'
					width="600px"
					onCancel={::this.toggleModal}
					onOk={::this.handleOk}
					confirmLoading={this.props.addLoading}
				>
					{this.renderModal()}
				</Modal>
			</div>
		)
	}
}