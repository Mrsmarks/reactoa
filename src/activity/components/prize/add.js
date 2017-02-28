import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Modal from 'antd/lib/modal'
import Select from 'antd/lib/select'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'
import ColorPicker from 'react-colors-picker'
import AddSupport from '../support/addModal'
import AddRule from '../prize_rule/addModal'
import 'react-colors-picker/assets/index.css'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class EditComp extends React.Component {
	constructor(props, context) {
    	super(props, context)
    	this.state = {
    		fileList : [],
    		color: '',
    		visible_1: false,
    		visible_2: false
    	}
  	}

  	static propTypes = {
  		select: PropTypes.instanceOf(Immutable.Map).isRequired
  	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	} 

  	handleSubmit(e) {
  		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	        const fileList = this.state.fileList
			fileList.forEach((item, index) => {
				values[`screenshots${index+1}`] = item.url.replace(this.props.assetsUrl, '')
			})
			values.color = this.state.color? this.state.color: ''
      		this.props.actions.addPrizeList(values).then(resolve => {
      			message.success(resolve.errormsg)
      			this.context.router.push('activity/prize/list')
      		})
    	})
  	}	

  	changeHandler(obj) {
  		this.setState({
  			color: obj.color
  		})
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

	handleAddSupport(info) {
		this.props.actions.addSupportList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchPrizeSelect()
			this.setState({ visible_1: false })
		})	
	}

	handleAddRule(info) {
		this.props.actions.addPrizeRuleList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.fetchPrizeSelect()
			this.setState({ visible_2: false })
		})	
	}

  	uploadFile(file) {
  		if(this.state.fileList.length == 5){
  			return
  		}
  		const fileObj = {}
  		const fileList = this.state.fileList
  		const assetsUrl = this.props.assetsUrl
		this.props.actions.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			fileObj.uid = file.uid
			fileObj.status = 'done'
			fileObj.url = assetsUrl + resolve.result.file_url
			fileList.push(fileObj)
			this.setState({
				fileList: fileList,
			})
		})
	}

render() {
	const select = this.props.select.toJS()
	const { getFieldProps } = this.props.form
	/*验证开始*/
	//
	const nameProps = getFieldProps('name', {
		rules: [
	       { required: true, message: '请输入奖品名称' },
		],
	})

	const moneyProps = getFieldProps('money', {
		
	})

	const aidProps = getFieldProps('aid', {
		rules: [
		       { required: true, message: '请选择活动' },
			],
	})

	const typeProps = getFieldProps('type', {
		rules: [
		       { required: true, message: '请选择奖品类型' },
			],
	}) 
	
	const psidProps = getFieldProps('psid', {
		rules: [
		       { required: true, message: '请选择赞助方' },
			],
	}) 

	const prizeRuleProps = getFieldProps('prize_rule', {
		
	})

	const ruleProps = getFieldProps('rule', {
		rules: [
		       { required: true, message: '请选择兑奖规则' },
			],
	})

	const customProps = getFieldProps('custom_service', {
		
	})

	const profileProps = getFieldProps('profile', {
		
	})

	const instructionsProps = getFieldProps('instructions', {
		
	})

	const userInfoProps = getFieldProps('user_info', {
		
	})

	const changeUrlProps = getFieldProps('change_url', {
		
	})

	const depositUrlProps = getFieldProps('deposit_url', {
		
	})

	const formItemLayout = {
	    labelCol: { span: 3 },
	    wrapperCol: { span: 12 }
	}

	const fileProps = {
	  listType: 'picture-card',
	  fileList: this.state.fileList,
	  beforeUpload: ::this.uploadFile,
	  onChange: (info) => {
	  	if(info.fileList.length == 6) {
	  		message.error('最多上传5张图片')
	  		info.fileList.pop()
	  	}
	  	this.setState({
	  		fileList: info.fileList,
	  	})
	  }
	}

	return (
		<div>
			<Form horizontal style={{ marginTop: 40 }}>
				<FormItem
		          {...formItemLayout}
		          label="奖品名称："
		          hasFeedback
		          >
		          <Input {...nameProps}/>
		       </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="所值金额："
		          hasFeedback
		          >
		          <Input {...moneyProps}/>
		        </FormItem>

		        <FormItem  {...formItemLayout} label="所属活动：" hasFeedback>
		        	<Select {...aidProps} placeholder="请选择活动：" style={{ width: 150 }}>
		        		{
		        			select.activityList.map(item => {
		        				return (
		        					<Option key={item.aid} value={item.aid+''}>{item.name}</Option>
		        				)
		        			})
		        		}
		        	</Select>
		        </FormItem>

		         <FormItem  {...formItemLayout} label="奖品类型：" hasFeedback>
		        	<Select {...typeProps} placeholder="请选择类型：" style={{ width: 150 }}>
		        		{
		        			select.prizeType.map(item => {
		        				return (
		        					<Option key={item.id} value={item.id+''}>{item.name}</Option>
		        				)
		        			})
		        		}
		        	</Select>
		        </FormItem>

		        <FormItem  {...formItemLayout} label="所属赞助方：" hasFeedback>
		        	<Select {...psidProps} placeholder="请选择赞助方：" style={{ width: 150 }}>
		        		{
		        			select.sponsorList.map(item => {
		        				return (
		        					<Option key={item.psid} value={item.psid+''}>{item.name}</Option>
		        				)
		        			})
		        		}
		        	</Select>
		        	<a style={{marginLeft: 20}} onClick={() => {this.toggleModal(undefined, 'visible_1')}}><Icon type="plus"/> 去添加</a>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="奖品说明："
		          hasFeedback
		          >
		          <Input {...prizeRuleProps}/>
		        </FormItem>

		        <FormItem  {...formItemLayout} label="奖品规则：" hasFeedback>
		        	<Select {...ruleProps} size="large" placeholder="请选择兑奖规则" style={{ width: 150 }}>
		        		{
		        			select.prizeRule.map(item => {
		        				return (
		        					<Option key={item.rule} value={item.rule+''}>{item.prize_rule}</Option>
		        				)
		        			})
		        		}
		        	</Select>
		        	<a style={{marginLeft: 20}} onClick={() => {this.toggleModal(undefined, 'visible_2')}}><Icon type="plus"/> 去添加</a>
		        </FormItem>

		         <FormItem
			          {...formItemLayout}
			          label="奖品颜色："
			          hasFeedback
			          >
			           
			          <Input value={this.state.color} placeholder="点击拾取颜色按钮选择颜色" readOnly/>
			          <ColorPicker
						      animation="slide-up"
						      color={this.state.color? this.state.color:'#17bdd4'}
						      onChange={::this.changeHandler}
						      trigger={<Button type="primary" size="small"><Icon type="edit"/>拾取颜色</Button>}
					    />
			        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="客服电话："
		          hasFeedback
		          >
		          <Input {...customProps}/>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="奖品详情："
		          hasFeedback
		          >
		          <Input {...profileProps}/>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="使用说明："
		          hasFeedback
		          >
		          <Input {...instructionsProps} type="textarea" rows="6"/>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="用户颁奖信息："
		          hasFeedback
		          >
		          <Input {...userInfoProps}/>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="兑奖地址："
		          hasFeedback
		          >
		          <Input {...changeUrlProps}/>
		        </FormItem>

		        <FormItem
		          {...formItemLayout}
		          label="充值地址："
		          hasFeedback
		          >
		          <Input {...depositUrlProps}/>
		        </FormItem>

		         <FormItem
		          {...formItemLayout}
		          label="奖品图片："
		          hasFeedback
		          >
		            <div  className="clearfix">
		                <Upload {...fileProps} >
		                  <Icon type="plus" />
		                  <div className="ant-upload-text">上传照片(1-5张)</div>
		                </Upload>
		            </div>
		        </FormItem>
		        
		        <FormItem  {...formItemLayout}>
		        	<Col offset="9">
	    	        	<Button type="primary" size="large" onClick={::this.handleSubmit}>确定</Button>
	    	        	<Button onClick={() => {history.back()}}type="ghost" size="large"  style={{ marginLeft: 40 }}>返回</Button>
	    			</Col>
		        </FormItem>
			</Form>
			<AddSupport
				toggle={::this.toggleModal}
				visible={this.state.visible_1}
				handleAdd={::this.handleAddSupport}
				uploadFile={this.props.actions.uploadFile}
				fileLoading={this.props.fileLoading}
				assetsUrl={this.props.assetsUrl}
				addSupportLoading={this.props.addSupportLoading}
			/>
			<AddRule
				toggle={::this.toggleModal}
				select={this.props.ruleOption.toJS()}
				visible={this.state.visible_2}
				handleAdd={::this.handleAddRule}
				addRuleLoading={this.props.addRuleLoading}
			/>
		</div>
		)
	}
}


 