import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import message from 'antd/lib/message'
import Spin from 'antd/lib/spin'
import Cascader from 'antd/lib/cascader'
import Modal from 'antd/lib/modal'
import Auth from 'Application/components/auth'
import Select from 'antd/lib/select'
import Radio from 'antd/lib/radio'
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
			ready: false
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			cover_id: nextProps.info.toJS().tid,
		})
		if(nextProps.option.toJS().templateList.length > 0 && !this.state.ready && nextProps.info.size) {
			const templateList = nextProps.option.toJS().templateList
			const tid = nextProps.info.toJS().tid
			
			const name = templateList.find(item => item.id == tid).name
			this.setState({
				cover_name: name,
				ready: true
			})
		}
	}

	handleChangeRadio(e) {
		this.setState({
			cover_id: e.target.value,
			radioCheckedId: e.target.value
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
		const info = this.props.info.toJS()
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			values.tid = this.state.cover_id
			values.aid = values.active.join()
			delete values.active
			this.props.actions.updateRouteList(values, info.id).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push('/activity/route/list')
			})
		})
	}

	// renderModal() {
	// 	const option = this.props.option.toJS()
	// 	var i = Math.ceil(option.templateList.length/4)
	// 	var array = []
	// 	for(let n = 1; n < i + 1; n++) {
	// 		array.push(n)
	// 	}
	// 	return(
	// 		<div style={{maxHeight:350, overflow:'auto'}}>
	// 			{
	// 				array.map(index => {
	// 					return (
	// 						<Row key={index} type="flex" style={{height: 110}} justify="start">
	// 							{
	// 								option.templateList.slice((index-1)*4, index*4).map((item, index1) => {
	// 									if(index1 < 4*index ) {
	// 										return (
	// 											<Col key={index1} span={6} style={{textAlign: 'center'}}>
	// 												 <div><img className='head-img' src={this.props.assetsUrl + item.cover_image}/></div>
	// 												 <input type="radio" onChange={::this.handleChangeRadio}   key={index1} value={item.id+''} name="name"/> {item.name}
	// 											</Col>
	// 										)
	// 									}
	// 								})
	// 							}
	// 						</Row>
	// 					)
	// 				})
	// 			}
	// 		</div>
	// 	)
	// }

	renderModal() {
		const option = this.props.option.toJS()
		const templateList = option.templateList
		const shownData = []
		let tempData = []
		templateList.forEach((item, index) => {
			if (index !== 0 && index % 4 === 0) {
				shownData.push(tempData)
				tempData = []
			}
			tempData.push(item)
		})
		if (tempData.length) {
			shownData.push(tempData)
		}

		return (
			<div style={{maxHeight:350, overflow:'auto'}}>
				{
					shownData.map(item => 
						<Row key={Math.random()} type="flex" style={{height: 110}} justify="start">
							{
								item.map((item, index) => {

									return (
										<Col key={index} span={6} style={{textAlign: 'center'}}>
											<div><img className='head-img' src={this.props.assetsUrl + item.cover_image}/></div>
											<Radio checked={this.state.radioCheckedId == item.id} key={index} value={item.id+''} onChange={::this.handleChangeRadio}>{item.name}</Radio>
										</Col>
									)
								})
							}
						</Row>
					)
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
		const info = this.props.info.toJS()
		const option = this.props.option.toJS()
		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 12 }
		}

		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请输入路由名称' }
			],
			initialValue: info.name
		})

		const activeProps = getFieldProps('active', {
			rules: [
				{required: true, type:'array', message: '请选择活动'}
			],
			initialValue: (info.aid+'').split(',')
		})

		const accessUrlProps = getFieldProps('access_url', {
			rules: [
				{required: true, message: '请输入链接地址'}
			],
			initialValue: info.access_url
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
		        	
		        <FormItem  {...formItemLayout} label="访问模板：" hasFeedback>
	        	 	<Input value={this.state.cover_name}  onClick={::this.toggleModal} placeholder="点击我选择模板"/>
	        	</FormItem>

	        	 <FormItem  {...formItemLayout} label="链接访问地址：" hasFeedback>
    	        	<Input {...accessUrlProps} disabled/>
	        	</FormItem>

	        	<FormItem  {...formItemLayout}>
		        	<Col offset="6">
			        	<Auth type={["activity-route-update"]}>
		    	        	<Button type="primary" onClick={::this.handleSumbit} size="large" >确定</Button>
		    	        </Auth>
        	        	<Button type="ghost" size="large" onClick={() => {history.back()}} style={{ marginLeft: 40 }}>返回</Button>
        			</Col>
			    </FormItem>
			</Form>
		)
	}
	render() {
		return (
			<Spin spinning={this.props.loading}>
				<div>
					{this.renderForm()}
					<Modal
						title="编辑"
						visible={this.state.visible}
						cancelText='返回'
						width="600px"
						onCancel={::this.toggleModal}
						onOk={::this.handleOk}
						confirmLoading={this.props.updateLoading}
					>
						{this.renderModal()}
					</Modal>
				</div>
			</Spin>
		)
	}
}