import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import message from 'antd/lib/message'
import Icon from 'antd/lib/icon'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Tag from 'antd/lib/tag'
import Radio from 'antd/lib/radio'

import Upload from 'antd/lib/upload'
import Input from 'antd/lib/input'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'
import Auth from 'Application/components/auth'
import EditModal from './cardModal'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
@Form.create()
export default class addPicComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			cardid: '',
			cardName: []
		}
	}

	static propTypes = {

	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}
	toggleModal(info, visible) {
		this.setState({
			[visible]: !this.state[visible],
		})
	}
	handleSubmit = () => {
		this.props.form.validateFields((errors) => {
			if(!!errors){
				return
			}
			if(!this.state.cardid){
				alert('请选择卡券')
				return
			}
			let values = {}
			values.name = this.props.form.getFieldValue(['name'])
			// values.card_id = this.props.form.getFieldValue(['card_id'])
			values.card_id = this.state.cardid
			values.is_urnique_code = this.props.form.getFieldValue(['is_urnique_code'])
			values.scene_id = this.props.form.getFieldValue(['scene_id'])
			values.outer_str = this.props.form.getFieldValue(['outer_str'])
			values.expire_seconds = this.props.form.getFieldValue(['expire_seconds'])
			 console.log(this.props.form.getFieldsValue());
			const id = parseInt(this.context.location.query.id)
			this.props.actions.updateCardVoucherQrcode(values,id).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push({
					pathname:'/card-voucher/qrcode/index'
				})
			},reject => {
				message.error(reject.err.errormsg)
			})
		})
	}
	handleSelectChange  = event => {
		console.log(event.target.value)
	}
	onCardsChange = newobj =>{
		this.setState({
			cardName: newobj,
			cardid: parseInt(newobj[0].id)
		})
		console.log(this.state.cardid)
	}
	renderCards = () => {
		return(
			this.state.cardName.map(function(result){
		    	return <Tag style={{marginLeft:10}} id={result.id} key={result.id}>{result.name} </Tag>
		    })
		)
	}
	renderTable() {
		const getSceneItem = sceneList => {
			for(let i of sceneList){
				if(i.id == checkInfo.get('scene_id'))
					return i
			}
			return {name:'未添加', id:'111'}
		}
		const { getFieldProps } = this.props.form
		const checkInfo = this.props.info
		this.state.cardid = checkInfo.get('card_id');
		const formItemProps = {
			labelCol: { span: 3 },
			wrapperCol: { span:6 }
		}
		const select = this.props.select.toJS()

		const nameProps = getFieldProps('name', {
			initialValue: checkInfo.get('name'),
			rules: [
				{ required:true, message: '请输入名称' }
			]
		})
		const cardidProps = getFieldProps('card_id', {
			initialValue: checkInfo.get('card_id')
		})		
		const select1Props = getFieldProps('scene_id', {
			rules: [
				{ required:true, message: '请选择场景' }
			],
			initialValue: getSceneItem(select.sceneList).name
		})

		const outerStrProps = getFieldProps('outer_str', {
			initialValue: checkInfo.get('outer_str'),
			rules: [
				{ required:true, message: '请输入场景串' }
			]
		})
		const expireSecondsProps = getFieldProps('expire_seconds', {
			initialValue: checkInfo.get('expire_seconds'),
		})
		return (
			<div>
				<Form horizontal style={{marginTop: 40 }}>
					<FormItem
					 	{...formItemProps}
					 	label="名称："
					 	hasFeedback
					>
						<Input  {...nameProps} placeholder="请输入名称"/>
					</FormItem>
			        <FormItem 
			          {...formItemProps}
			          label="选择卡券："
			          hasFeedback
			          >
				        <Auth type={["wechat-menu-add"]}>
							<Button type="primary" onClick={() => {this.toggleModal({}, 'modalVisible')}} style={{marginRight:16}} >
								选择卡券
							</Button>
						</Auth>
			          <Input  type="hidden"/>
			          {this.renderCards()}
			        </FormItem>
			        <FormItem
			         {...formItemProps}
			         label="选择场景"
			         hasFeedback
			        >
						<Select {...select1Props} size="large" placeholder="选择场景" style={{ width: 150 }}>
	    	        		{
	    	        			select.sceneList.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
			        </FormItem>
			         <FormItem
			        	labelCol={ {span: 3} }
			         wrapperCol={ {span:16} }
			         label="场景串"
			         hasFeedback
			        >
			        	<Input {...outerStrProps}/>
			        </FormItem>
			        <FormItem
			         labelCol={ {span: 3} }
					 wrapperCol={ {span:16} }
			         label="是否唯一"
			         hasFeedback
			        >
						<Select size="large"  defaultValue="false" style={{ width: 200 }} onChange={this.handleSelectChange} >
							<Option value="false">否</Option>
							<Option value="true">是</Option>
						</Select>
			        	<span style={{color:"red",marginLeft:8}}> 指定下发二维码，生成的二维码随机分配一个code，领取后不可再次扫描。</span>
			        </FormItem>			        
			        <FormItem
			         labelCol={ {span: 3} }
			         wrapperCol={ {span:16} }
			         label="二维码有效期"
			         hasFeedback
			        >
			        	<Input {...expireSecondsProps}/>
			        	<p style={{color:"red"}}>范围是60 ~ 1800秒。不填默认为365天有效。</p>
			        </FormItem>
			        
					<FormItem>
						<Col offset="3">
							<Button type="primary" onClick={this.handleSubmit}>确定</Button>
							<Button type="ghost" style={{marginLeft:10}} onClick={() => {history.back()}}>返回</Button>
						</Col>	
					</FormItem>
				</Form>
				<EditModal
					visible={this.state.modalVisible}
					toggle={::this.toggleModal}
					addLoading={this.props.addLoading}
					actions={{
						fetchCardVoucherQrcodeSelector: ::this.props.actions.fetchCardVoucherQrcodeSelector
					}}					
					cardList={Immutable.fromJS(select.cardList)}
					onCardsChange={this.onCardsChange}
					params={this.props.params}
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