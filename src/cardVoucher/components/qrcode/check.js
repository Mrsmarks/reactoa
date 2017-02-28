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
import AddModal from './cardModal'

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
					console.log(i)
					return i
			}
			return {name:'未添加', id:'111'}
		}
		const { getFieldProps } = this.props.form
		const checkInfo = this.props.info
		console.log(this.props.info.toJS())
		const formItemProps = {
			labelCol: { span: 3 },
			wrapperCol: { span:6 }
		}
		const select = this.props.select.toJS()
		const nameProps = getFieldProps('name', {
			initialValue: checkInfo.get('name')
		})
		const cardidProps = getFieldProps('card_id', {
			initialValue: checkInfo.get('card_id')
		})				
		const select1Props = getFieldProps('scene_id', {
			initialValue: getSceneItem(select.sceneList).name
		})

		const outerStrProps = getFieldProps('outer_str', {
			initialValue: checkInfo.get('outer_str')
		})
		const expireSecondsProps = getFieldProps('expire_seconds', {
			initialValue: checkInfo.get('expire_seconds')
		})
		return (
			<div>
				<Form horizontal style={{marginTop: 40 }}>
					<FormItem
					 	{...formItemProps}
					 	label="名称："
					>
						<Input  {...nameProps} placeholder="请输入名称" disabled/>
					</FormItem>
			        <FormItem 
			          {...formItemProps}
			          label="选择卡券："
			          >
				        <Auth type={["wechat-menu-add"]}>
							<Button type="primary" onClick={() => {this.toggleModal({}, 'modalVisible')}} style={{marginRight:16}} disabled >
								选择卡券
							</Button>
						</Auth>
			          <Input {...cardidProps} value={this.state.cardid} type="hidden"/>
			          {this.renderCards()}
			        </FormItem>
			        <FormItem
			         {...formItemProps}
			         label="选择场景"
			        >
						<Select {...select1Props} size="large" placeholder="选择场景" style={{ width: 150 }} disabled>
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
			        >
			        	<Input {...outerStrProps} disabled/>
			        </FormItem>
			        <FormItem
			         labelCol={ {span: 3} }
					 wrapperCol={ {span:16} }
			         label="是否唯一"
			        >
						<Select size="large"  defaultValue="false" style={{ width: 200 }} onChange={this.handleSelectChange} disabled >
							<Option value="false">否</Option>
							<Option value="true">是</Option>
						</Select>
			        	<span style={{color:"red",marginLeft:8}}> 指定下发二维码，生成的二维码随机分配一个code，领取后不可再次扫描。</span>
			        </FormItem>			        
			        <FormItem
			         labelCol={ {span: 3} }
			         wrapperCol={ {span:16} }
			         label="二维码有效期"
			        >
			        	<Input {...expireSecondsProps} disabled/>
			        	<p style={{color:"red"}}>范围是60 ~ 1800秒。不填默认为365天有效。</p>
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

	render() {
		return (
			<div>
				{this.renderTable()}
			</div>
		)
	}

}