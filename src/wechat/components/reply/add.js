import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import Table from 'antd/lib/table'
import Popconfirm from 'antd/lib/popconfirm'
import Col from 'antd/lib/col'

import Icon from 'antd/lib/icon'

import message from 'antd/lib/message'

import AddModal from './addImgTextModal'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const Option = Select.Option

@Form.create()
export default class MainModal extends React.Component{
	constructor(props, context) {
		super(props, context)
		this.state = {
			visible: false,
			dataSource: [],
			replyType: 1,
			eventType: 3,
			signType: 0,
			imgId: '',
			info:{}
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	onChangeReplyType(value) {
		this.setState({
			replyType: value
		})
	}

	onImgChange(value) {
		this.setState({
			content: value
		})
	}

	onChangeEventType(value) {
		this.setState({
			eventType: value,
			content: ''
		})
	}

	onChangeSignType(event) {
		this.setState({
			signType: event.target.value
		})
	}

	handleTextChange(event) {
		this.setState({
			content: event.target.value
		})
	}

	onChangeGroup(value) {
		const { setFieldsValue } = this.props.form
		const obj = value.find(item => item == -1)
		
		if(obj == -1) {
			setFieldsValue({'wechat_group': ['-1']})
		}
	}


	setDataSource(info) {
		const dataSource = this.state.dataSource
		const dataEdit = this.state.info
		if(Object.keys(dataEdit).length > 0) {
			const index = dataSource.findIndex(item => item.key == info.key)
			if(index > -1) dataSource[index] = info
		}else{
			info.key = info.content_txt_pictrue
			dataSource.unshift(info)
		}
		this.setState({
			info: info,
			dataSource: dataSource,
			visible: false
		})
	}

	removeItem(title, dataSource) {
		dataSource = dataSource.filter(item => {
			return item.content_txt_title != title
		})
		this.setState({
			dataSource: dataSource
		})
	}

	changeSort(obj, type) {
		const dataSource = this.state.dataSource
		const index = dataSource.findIndex(item => item.key == obj.key)
		if(index > -1) {
			var z = ''
			if(type == 'up' && index != 0) {
				z = dataSource[index]
				dataSource[index] = dataSource[index - 1]
				dataSource[index - 1] = z
			}
			if(type == 'down' && index != dataSource.length - 1) {
				z = dataSource[index]
				dataSource[index] = dataSource[index + 1]
				dataSource[index + 1] = z
			}
			this.setState({dataSource: dataSource})
		}
		else return 
	}

	handleAdd(info) {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const dataSource = this.state.dataSource
			const content_txt_title = []
			const content_txt_description = []
			const content_txt_pictrue =[]
			const content_txt_url = []
			dataSource.forEach(item => {
				content_txt_title.push(item.content_txt_title)
				content_txt_description.push(item.content_txt_description)
				content_txt_pictrue.push(item.content_txt_pictrue)
				content_txt_url.push(item.content_txt_url)
			})
			values.content_txt_title = content_txt_title
			values.content_txt_description = content_txt_description
			values.content_txt_pictrue = content_txt_pictrue
			values.content_txt_url = content_txt_url
			values.reply_type = this.state.replyType
			values.type = this.state.eventType
			values.sign = this.state.signType
			values.wechat_group = values.wechat_group? values.wechat_group.join(): ''
			if (values.reply_type == 1) values.content_text = this.state.content 
			if (values.reply_type == 2) values.content_pictrue = this.state.content
            
			this.props.actions.addReplyList(values).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push('wechat/reply/list')
			})	
		})
		
	}


	toggleModal(info, visible, cb) {
		if(info) {
			if(cb) {
				cb(info)
			}
			this.setState({
				[visible]: !this.state[visible],
				info: info,
				ready: true
			})
		}else{
			this.setState({
				[visible]: !this.state[visible],
				ready: true,
				info: {}
			})
		}	
	}


	renderForm() {
		const { getFieldProps } = this.props.form
		const editSelect = this.props.editSelect.toJS()
		const toggleModal = (obj, visible, fn) => _ => {
			return this.toggleModal(obj, visible, fn)
		}
		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 12 }
		}

		const keywordProps = getFieldProps('keyword', {
			
		})

		const signProps = getFieldProps('sign', {
			rules: [
				{ required: true,  message: '请选择是否签到' }
			],
			onChange: ::this.onChangeSignType
		})

		const signNameProps = getFieldProps('sid', {
			
		})

		const typeProps = getFieldProps('type', {
			rules: [
				{ required: true,  message: '请选择事件类型' }
			],
			onChange: ::this.onChangeEventType
		})

		const replyTypeProps = getFieldProps('reply_type', {
			rules: [
				{ required: true,  message: '请选择回复类型' }
			],
			onChange: ::this.onChangeReplyType
		})

        const mstchingProps = getFieldProps('mstching_type', {
            rules: [
                { required: true,  message: '请选择匹配类型' }
            ]
        })

		const groupProps = getFieldProps('wechat_group', {
			onChange: ::this.onChangeGroup
		})

		const sceneProps = getFieldProps('scene', {

		})

		const contentProps = getFieldProps('content_text', {
			
		})

		const imgProps = getFieldProps('content_pictrue')

		const offset = (replyType) => {
			switch(replyType) {
				case 1:
				return '6'
				case 2:
				return '6'
				case 3:
				return '20'
			}
		}

        const groupOptionList = [<Option key="x" value='-1'>全部</Option>]
        editSelect.weixinGroup.map(item => {
            groupOptionList.push(
                <Option key={item.id} value={item.id+''}>{item.name}</Option>
            )
        })

		return(
			<Form horizontal style={{marginTop: 30}} >
			       
			        <FormItem  {...formItemLayout} label="事件类型：">
	    	        	<Select {...typeProps} size="large" placeholder="请选择类型：">
	    	        		{
	    	        			editSelect.evenType.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<div hidden={this.state.eventType != 2}>
		        		 <FormItem
				          {...formItemLayout}
				          label="关键字："
				          disabled
				          hasFeedback
				          >
				          <Input {...keywordProps} type="text" />
			        	</FormItem>
		        	</div>
		        	<div hidden={this.state.eventType != 4}>
		        		<FormItem  {...formItemLayout} label="场景回复：">
		    	        	<Select 
		    	        		{...sceneProps} 
		    	        		size="large"  
		    	        		placeholder="请选择类型：" 
		    	        		>
		    	        		{
		    	        			editSelect.sceneList.map(item => {
		    	        				return (
		    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
		    	        				)
		    	        			})
		    	        		}
		    	        	</Select>
		        		</FormItem>
		        	</div>
		        	<div hidden={this.state.eventType == 4 || this.state.eventType == 1 }>
			        	<FormItem {...formItemLayout} label="微信分组：">
		    	        	<Select {...groupProps} multiple size="large" placeholder="请选择类型：">
		    	        		{groupOptionList}
		    	        	</Select>
			        	</FormItem>
		        	</div>

                    <FormItem
                      {...formItemLayout}
                      label="匹配类型："
                      hasFeedback
                      >
                        <RadioGroup {...mstchingProps}>
                            {
                                editSelect.mstchingType.map(item => {
                                    return (
                                        <Radio key={item.id} value={item.id+''}>{item.name}</Radio>
                                    )
                                })
                            }
                        </RadioGroup>
                    </FormItem>

		        	<FormItem
			          {...formItemLayout}
			          label="签到："
			          hasFeedback
			          >
			            <RadioGroup {...signProps}>
		                  	{
			            		editSelect.signType.map(item => {
			            			return (
		                  				<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
			            			)
			            		})
			            	}
			            </RadioGroup>
			        </FormItem>

			        <div hidden={this.state.signType != 1}>
		        		<FormItem  {...formItemLayout} label="签到名称：">
		    	        	<Select {...signNameProps} size="large"  placeholder="请选择签到名称：" >
		    	        		{
		    	        			editSelect.signName.map(item => {
		    	        				return (
		    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
		    	        				)
		    	        			})
		    	        		}
		    	        	</Select>
		        		</FormItem>
		        	</div>

		        	<FormItem  {...formItemLayout} label="回复类型：">
	    	        	<Select {...replyTypeProps} size="large" placeholder="请选择类型：" >
	    	        		{
	    	        			editSelect.replyType.map(item => {
	    	        				return (
	    	        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
	    	        				)
	    	        			})
	    	        		}
	    	        	</Select>
		        	</FormItem>
		        	<div hidden={this.state.replyType != 1}>
			        	<FormItem 
				          {...formItemLayout}
				          label="文本内容："
				          hasFeedback
				          >
				          <Input {...contentProps} value={this.state.content} onChange={::this.handleTextChange} type="textarea" rows="6"/>
				        </FormItem>
			 		</div>
			 		<div hidden={this.state.replyType != 2}>
			        	<FormItem  {...formItemLayout} label="选择图片素材：">
		    	        	<Select 
		    	        	    showSearch 
		    	        		optionFilterProp="children"
    							notFoundContent="无法找到" 
		    	        	    {...imgProps} 
		    	        	    size="large" 
		    	        	    value={this.state.content} 
		    	        	    onChange={::this.onImgChange} 
		    	        	    placeholder="请选择素材：" 
		    	        	    >
		    	        		{
		    	        			editSelect.allImage.map(item => {
		    	        				return (
		    	        					<Option key={item.media_id} value={item.media_id}>{item.name}</Option>
		    	        				)
		    	        			})
		    	        		}
		    	        	</Select>
		        		</FormItem>
			 		</div>
			 		<div hidden={this.state.replyType != 3}>
			        	<FormItem 
				          {...formItemLayout}
				          label="图文内容："
				          hasFeedback
				          >
				          <Button  type="primary" onClick={toggleModal(undefined, 'visible')}>
				          	<Icon type="plus" />添加图文
				          </Button>
				        </FormItem>
			 		</div>
			 		<div>
			 			{this.renderTable()}
			 		</div>
			         <FormItem  {...formItemLayout} style={{marginTop: 20}}>
				        	<Col offset={offset(this.state.replyType)}>
		        	        	<Button style={{width: 120}} type="primary" onClick={::this.handleAdd}  size="large">提交</Button>
		        			</Col>
				     </FormItem>
				</Form>
		)
	}

	renderTable() {
		const dataSource = this.state.dataSource
		const assetsUrl = this.props.assetsUrl
		const removeItem = (title, dataSource) => _ => {
			return this.removeItem(title, dataSource)
		}
		const toggleModal = (obj, visible, fn) => _ => {
			return this.toggleModal(obj, visible, fn)
		}
		const changeSort = (obj, type) => _ => {
			return this.changeSort(obj, type)
		}
		
		const columns = [{
			title: '标题',
			dataIndex: 'content_txt_title',
			key: 'content_txt_title'
		}, {
			title: '图片地址',
			dataIndex: 'content_txt_pictrue',
			key: 'content_txt_pictrue',
			render(img) {
                img = img.match(/(http|https):\/\//g) ? img : assetsUrl + img
				return (
					<div><img className="head-img" src={img}/></div>
				)
			}
		}, {
			title: '链接地址',
			dataIndex: 'content_txt_url',
			key: 'content_txt_url',
		}, {
			title: '排序',
			key: 'sort',
			render(status, obj) {
				return(
					<div>
						<div><a><Icon onClick={changeSort(obj, 'up')} type="caret-up"/></a></div>
						<div><a><Icon onClick={changeSort(obj, 'down')} type="caret-down"/></a></div>
					</div>
				)
			}
		}, {
			title: '描述',
			dataIndex: 'content_txt_description',
			key: 'content_txt_description',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<a onClick={toggleModal(obj, 'visible')}>修改</a>
						<span style={{marginLeft: 5}}></span>
						<Popconfirm title="确定要删除吗？" onConfirm={removeItem(obj.content_txt_title, dataSource)}>
							<a>删除</a>
						</Popconfirm>
					</div>
				)
			}
		}]

		return (
			<div hidden={this.state.replyType != 3} >
				<Table 
					columns={columns}
					dataSource={this.state.dataSource}
					pagination={false}
				/>
			</div>
		)
	}
	render() {
		return (
			<div>
				{this.renderForm()}
				<AddModal
					visible={this.state.visible}
				    toggle={::this.toggleModal}
				    setDataSource={::this.setDataSource}
				    uploadFile={this.props.actions.uploadFile}
				    fileLoading={this.props.fileLoading}
				    assetsUrl={this.props.assetsUrl}
				    info={this.state.info}

				/>
			</div>
		)
	}
}