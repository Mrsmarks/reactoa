import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import message from 'antd/lib/message'
import Icon from 'antd/lib/icon'
import Form from 'antd/lib/form'
import Upload from 'antd/lib/upload'
import Input from 'antd/lib/input'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'
import Auth from 'Application/components/auth'
import AddModal from './cardModal'
import Tag from 'antd/lib/tag'
import Radio from 'antd/lib/radio'
import Checkbox from 'antd/lib/checkbox'
const RadioGroup = Radio.Group;
const FormItem = Form.Item
@Form.create()
export default class addPicComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			addModalVisible:false,
			checkboxVisible:false,
			cardid: '',
			cardName: [],
			route_white_list: "0",
			card_white_list: "0",
			card_white_list_content:[]
		}
	}

	static propTypes = {

	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	toggleModal(info, visible, cb) {
		if(info) {
			if(cb) {
				cb(info)
			}
			this.setState({
				[visible]: !this.state[visible],
				info: info
			})
		}else{
			this.setState({
				[visible]: !this.state[visible],
			})
		}	
	}

	handleTextChange(event) {
		console.log(event.target.value)
		this.setState({
			template_path: event.target.value
		})
	}
	handleSubmit = () => {
		this.props.form.validateFields((errors) => {
			if(!!errors){
				return
			}
			let values = {}
			let temp = []
			values.name = this.props.form.getFieldValue(['name'])
			values.template_path = this.props.form.getFieldValue(['template_path'])
			values.error_path = this.props.form.getFieldValue(['error_path'])
			values.route_white_list = this.state.route_white_list
			values.card_white_list = this.state.card_white_list
			values.card_white_list_content = this.state.card_white_list_content

			console.log(this.state.cardName,'122')
			let obj = this.state.cardName
			for (var i of obj) {
				temp.push(i.id)
			}
			values.cardid = temp.join(',')
			console.log(values)
			this.props.actions.addCardVoucherRoute(values).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push({
					pathname:'/card-voucher/route/index'
				})
			},reject => {
				console.log(reject)
				message.error(reject.err.errormsg)
			})
		})
	}
	handleRadio1(val){
		this.setState({
			route_white_list: val
		})
	}
	handleRadio2(val){
		this.setState({
			checkboxVisible: val === "1",
			card_white_list: val
		})
	}
	handleCheckbox(obj){
		console.log(obj)
		if(obj.checked){
			this.state.card_white_list_content.push(obj.id)
		}else{
			this.state.card_white_list_content.splice(this.state.card_white_list_content.indexOf(obj.id),1)
		}
		console.log(this.state.card_white_list_content)
	}
	onCardsChange = newobj =>{
		this.state.cardName = newobj
	}
	renderCards = () => {
		return(
			this.state.cardName.map(function(result){
		    	return <Tag key={result.id} style={{marginLeft:10}} id={result.id} >{result.name}</Tag>
		    })
		)
	}
	renderCheckbox = () => {
		const handleCheckbox = e =>{
			return this.handleCheckbox(e.target)
		}
		return(
			this.state.cardName.map(function(result){
		    	return <Checkbox className="ant-checkbox-inline"  key={result.id} id={result.id} onChange={handleCheckbox}>{result.name}</Checkbox>
		    })
		)
	}
	renderTable() {
		const { getFieldProps } = this.props.form
		 
		const formItemProps = {
			labelCol: { span: 3 },
			wrapperCol: { span:6 }
		}
		const longItemProps = {
			labelCol: { span: 3 },
			wrapperCol: { span:16 }
		}		
		const nameProps = getFieldProps('name', {
			rules: [
				{ required:true, message: '请输入路由名称' }
			]
		})		
		const contentProps = getFieldProps('template_path', {
			rules: [
				{ required:true, message: '请输入模版路径' }
			]
		})
		const errorProps = getFieldProps('error_path', {
			rules: [
				{ required:true, message: '请输入错误模版路径' }
			]
		})
		const route_white_listrProps = getFieldProps('route_white_list', {
			
		})
		const handleRadio1 = e => {
			return this.handleRadio1(e.target.value)
		}
		const handleRadio2 = e => {
			return this.handleRadio2(e.target.value)
		}
		return (
			<div>

				<Form horizontal style={{marginTop: 40 }}>
					<FormItem
					 	{...formItemProps}
					 	label="名称："
					 	hasFeedback
					 	required
					>
						<Input  {...nameProps} placeholder="请输入路由名称"/>
					</FormItem>
					 <FormItem 
				          {...formItemProps}
				          label="模版路径："
				          hasFeedback
				          >
			          <Input {...contentProps} type="textarea" rows="6"/>
			        </FormItem>
			        <FormItem 
				          {...formItemProps}
				          label="错误模版路径："
				          hasFeedback
				          >
			          <Input {...errorProps} type="textarea" rows="6"/>
			        </FormItem>
			        <FormItem 
			          {...longItemProps}
			          label="选择卡券："
			          hasFeedback
			          >
				        <Auth type={["wechat-menu-add"]}>
							<Button type="primary" onClick={() => {this.toggleModal({}, 'modalVisible')}} style={{marginRight:16}}>
								选择卡券
							</Button>
						</Auth>
			          <Input  value={this.state.cardid} type="hidden" />
			          {this.renderCards()}
			        </FormItem>
			        <FormItem 
			        	{...formItemProps}
			          label="是否开启路由白名单："
			          hasFeedback
			        >
			        	<RadioGroup defaultValue="0" onChange={handleRadio1} >
					        <Radio value="1">开启</Radio>
					        <Radio value="0">关闭</Radio>
					      </RadioGroup>
			        </FormItem>
			        <FormItem 
			        	{...formItemProps}
			          label="是否开启卡券白名单："
			          hasFeedback
			        >
			        	<RadioGroup defaultValue="0" onChange={handleRadio2} >
					        <Radio value="1">开启</Radio>
					        <Radio value="0">关闭</Radio>
					    </RadioGroup>
			        </FormItem>
			        <FormItem 
			        	{...longItemProps}
			          label="使用白名单的卡券："
			          style={{"display":this.state.checkboxVisible ? 'block' : 'none'}}
			          hasFeedback
			        >
						{this.renderCheckbox()}
			        </FormItem>			        
					<FormItem>
						<Col offset="3">
							<Button type="primary" onClick={this.handleSubmit}>确定</Button>
							<Button type="ghost" style={{marginLeft:10}} onClick={() => {history.back()}}>返回</Button>
						</Col>	
					</FormItem>
				</Form>
				<AddModal
					visible={this.state.modalVisible}
					addLoading={this.props.addLoading}
					toggle={::this.toggleModal}
					actions={{
						addCardVoucherRoute: ::this.props.actions.addCardVoucherRoute,
						fetchCardVoucherCardList: ::this.props.actions.fetchCardVoucherCardList
					}}
					cardList={this.props.content}
					onCardsChange={this.onCardsChange}
					context={this.context}
				/>				
			</div>
		)

	}

	render() {
		return (
			<div>
				{this.renderTable()}
			</div>
		)
	}

}