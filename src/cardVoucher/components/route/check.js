import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'
import message from 'antd/lib/message'
import safeString from 'safeString'
import Tag from 'antd/lib/tag'
const FormItem = Form.Item
@Form.create()
export default class checkPicComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info:[],
		}
	}

	static propTypes = {
		info: PropTypes.instanceOf(Immutable.Map).isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}
	renderCards(obj,cardList){
		console.log(obj)
		let cards = []
		if(obj.indexOf(',') < 0){
			for(let item of cardList){
				if(item.id == obj){
					cards.push(item)
				}
			}
		}else{
			for(let i of obj.split(',')){
				for(let item of cardList){
					if(item.id == i){
						cards.push(item)
					}
				}	
			}
			
		}
		console.log(cards)
		return(
			cards.map(function(result){
		    	return <Tag key={result.id} style={{marginLeft:10}} id={result.id} >{result.name}</Tag>
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
		const renderCards = () =>{
			if(!!checkedInfo.get('cardid')){
				return this.renderCards(checkedInfo.get('cardid'),cardList)
			}
			
		}
		const renderCardWhiteListContent = () =>{
			if(!!checkedInfo.get('card_white_list_content')){
				return this.renderCards(checkedInfo.get('card_white_list_content'),cardList)
			}
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
			initialValue: checkedInfo.get('route_white_list') == '1' ? '开启' : '关闭'
		})
		const card_white_listProps = getFieldProps('card_white_list', {
			initialValue: checkedInfo.get('card_white_list') == '1' ? '开启' : '关闭'
		})
		const card_white_list_contentProps = getFieldProps('card_white_list_content', {
			initialValue: checkedInfo.get('card_white_list_content')
		})
		return (
			<div>
				<Form horizontal style={{marginTop: 40 }}>
					<FormItem 
			          	{...formItemProps}
			          	label="路由名称："
			         >
				     	<Input {...nameProps} readOnly/>
				     </FormItem>
					 <FormItem 
				        {...formItemProps}
				        label="模版路径："
			          >
			          <Input {...contentProps}  type="textarea" rows="6" readOnly/>
			        </FormItem>
			        <FormItem 
				        {...formItemProps}
				        label="错误模版路径："
			          >
			          <Input {...errorProps}  type="textarea" rows="6" readOnly/>
			        </FormItem>
			        <FormItem 
			          	{...longItemProps}
			          	label="选择卡券："
			         >
			          <Input {...caridProps} readOnly type="hidden"/>
			          {renderCards()}
			        </FormItem>
			        <FormItem 
			          	{...formItemProps}
			          	label="是否开启路由白名单："
			         >
				     	<Input {...route_white_listProps} readOnly/>
				     </FormItem>
				     <FormItem 
			          	{...formItemProps}
			          	label="是否开启卡券白名单："
			         >
				     	<Input {...card_white_listProps} readOnly/>
				     </FormItem>
				     <FormItem 
			          	{...longItemProps}
			          	label="使用白名单的卡券："
			         >
				     	{renderCardWhiteListContent()}
				     </FormItem>
					<FormItem>
						<Col offset="3">
							<Button type="ghost" style={{marginLeft:10}} onClick={() => {history.back()}}>返回</Button>
						</Col>	
					</FormItem>
				</Form>
			</div>
		)
	}
}
