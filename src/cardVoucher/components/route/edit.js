import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'
import message from 'antd/lib/message'
import Auth from 'Application/components/auth'
import CardModal from './cardModal'
import Tag from 'antd/lib/tag'
import Radio from 'antd/lib/radio'
import Checkbox from 'antd/lib/checkbox'
const RadioGroup = Radio.Group
const FormItem = Form.Item
@Form.create()
export default class editPicComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		console.log(this.props.content)
		const checkedInfo = this.props.info
		this.state = {
			info:[],
			cardName: [],
			cardid: checkedInfo.get('cardid'),
			checkboxVisible:checkedInfo.get('card_white_list')==1,
			route_white_list: checkedInfo.get('route_white_list')+'',
			card_white_list: checkedInfo.get('card_white_list')+'',
			card_white_list_content:[]
		}
	}

	static propTypes = {
		info: PropTypes.instanceOf(Immutable.Map).isRequired
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

			let obj = this.state.cardName
			for (var i of obj) {
				temp.push(i.id)
			}
			values.cardid = temp.join(',')
			const id = parseInt(this.context.location.query.id)
			console.log(values,id)
			this.props.actions.updateCardVoucherRoute(values,id).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push({
					pathname:'/card-voucher/route/index'
				})
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
	renderCheckbox(obj,cardList) {
		const handleCheckbox = e =>{
			return this.handleCheckbox(e.target)
		}
		return(
			this.state.cardName.map(function(result){
				const mchecked = this.state.cardid.indexOf(result.id) > -1
		    	return <Checkbox className="ant-checkbox-inline"  key={result.id} id={result.id} onChange={handleCheckbox} checked={mchecked}>{result.name}</Checkbox>
		    })
		)
	}
	// renderCards(obj,cardList,isCheckbox,cardid){
	// 	console.log(obj)
	// 	let cards = []
	// 	if(obj.indexOf(',') < 0){
	// 		for(let item of cardList){
	// 			if(item.id == obj){
	// 				cards.push(item)
	// 			}
	// 		}
	// 	}else{
	// 		for(let i of obj.split(',')){
	// 			for(let item of cardList){
	// 				if(item.id == i){
	// 					cards.push(item)
	// 				}
	// 			}	
	// 		}
	// 	}
	// 	if(isCheckbox){
	// 		const handleCheckbox = e =>{
	// 			return this.handleCheckbox(e.target)
	// 		}
	// 		return(
	// 			cards.map(function(result){
	// 				const mchecked = cardid.indexOf(result.id) > -1
	// 		    	return <Checkbox className="ant-checkbox-inline"  key={result.id} id={result.id} onChange={handleCheckbox} checked={mchecked}>{result.name}</Checkbox>
	// 		    })
	// 		)			
	// 	}else{
	// 		return(
	// 			cards.map(function(result){
	// 		    	return <Tag key={result.id} style={{marginLeft:10}} id={result.id} >{result.name}</Tag>
	// 		    })
	// 		)
	// 	}
		
	// }
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
	render(){
		const { getFieldProps } = this.props.form
		const checkedInfo = this.props.info
		const cardList = this.props.cardList.toJS()

		const formItemProps = {
			labelCol: { span: 3 },
			wrapperCol: { span:6 }
		}
		const longItemProps = {
			labelCol: { span: 3 },
			wrapperCol: { span:12 }
		}	
		const contentProps = getFieldProps('template_path', {
			initialValue: checkedInfo.get('template_path')
		})
		const errorProps = getFieldProps('error_path', {
			initialValue: checkedInfo.get('error_path')
		})
		const nameProps = getFieldProps('name', {
			initialValue: checkedInfo.get('name')
		})
		const caridProps = getFieldProps('cardid', {
			initialValue: checkedInfo.get('cardid')
		})
		const route_white_listProps = getFieldProps('route_white_list', {
			initialValue: checkedInfo.get('route_white_list')
		})
		const card_white_listProps = getFieldProps('card_white_list', {
			initialValue: checkedInfo.get('card_white_list')
		})
		const card_white_list_contentProps = getFieldProps('card_white_list_content', {
			initialValue: checkedInfo.get('card_white_list_content')
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
			        	{this.renderCards()}
			          <Input  value={this.state.cardid} type="hidden" />
			        </FormItem>
			        <FormItem 
			        	{...formItemProps}
			          label="是否开启路由白名单："
			          hasFeedback
			        >
			        	<RadioGroup defaultValue={this.state.route_white_list} onChange={handleRadio1} >
					        <Radio value="1">开启</Radio>
					        <Radio value="0">关闭</Radio>
					     </RadioGroup>
			        </FormItem>
			        <FormItem 
			        	{...formItemProps}
			          label="是否开启卡券白名单："
			          hasFeedback
			        >
			        	<RadioGroup defaultValue={this.state.card_white_list} onChange={handleRadio2} >
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
				<CardModal
					info={this.state.info}
					visible={this.state.modalVisible}
					toggle={::this.toggleModal}
					actions={{
						updateCardVoucherRoute: ::this.props.actions.updateCardVoucherRoute,
						fetchCardVoucherCardList: ::this.props.actions.fetchCardVoucherCardList
					}}
					cardList={this.props.cardList}
					onCardsChange={this.onCardsChange}
					cardid={this.state.cardid}
					params={this.props.params}
					context={this.context}
				/>	
			</div>
		)
	}
}
