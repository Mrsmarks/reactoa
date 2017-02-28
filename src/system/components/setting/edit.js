import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Checkbox from 'antd/lib/checkbox'
import Radio from 'antd/lib/radio'
import Select from 'antd/lib/select'
import Col from 'antd/lib/col'


import Spin from 'antd/lib/spin'
import message from 'antd/lib/message'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

@Form.create()
export default class SettingComp extends React.Component{

	constructor(props, context) {
		super(props)
		this.state={
			open_yiqixiu: null,
			ready: false
		}
	}

	static propTypes = {
		setting: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired
	}

	componentWillReceiveProps(nextProps) {
		const info = nextProps.setting.toJS().result
		if(!this.state.ready && info && Object.keys(info).length) {
			this.setState({
				open_yiqixiu: this.eachRadio(info.open_yiqixiu),
				ready: true	
			})
		}
	}

	eachRadio(list) {
		var id =''
		list.forEach(item => {
			if(item.hasOwnProperty('check')){
				id =  item.id+''
			}	
		})
		return id
	}

	handleSubmit(e) {
		e.preventDefault()
	    this.props.form.validateFields((errors, values) => {
	      if (!!errors) {
	        return
	      }
	      values.open_yiqixiu = this.state.open_yiqixiu
	      this.props.actions.updateSystemData(values).then((reslove) => {
	      	  this.props.actions.fetchSystemData()
	      	  message.success(reslove.errormsg)
	      })
	    });
		
	}

	handleChangeRadio(e) {
		e.preventDefault()
	  		const value = e.target.value
	  		this.setState({
	  			open_yiqixiu: value
  		})
	}

	renderForm() {
		const { getFieldProps } = this.props.form
		const formItemLayout = {
		    labelCol: { span: 6 },
		    wrapperCol: { span: 18 }
		}

		const setting = this.props.setting.toJS().result
		if(setting && this.state.ready) {
			const open_db_log = setting.open_db_log
			const open_operate_log = setting.open_operate_log
			const open_request_log = setting.open_request_log
			const open_yiqixiu = setting.open_yiqixiu
			const yqx_option = this.state.open_yiqixiu? (<div><FormItem 
							  {...formItemLayout}
					          label="易企秀地址："
					          hasFeedback
					          required
					          >
					          <Input {...getFieldProps('yiqixiu_url', {
									initialValue: setting.yiqixiu_url
					          })} type="text"/>
					        </FormItem>
							<FormItem 
							 {...formItemLayout}
					         label="易企秀key："
					         hasFeedback
					         required
					         >
					          <Input {...getFieldProps('yiqixiu_key', {
									initialValue: setting.yiqixiu_key
								})} type="text"/>
					        </FormItem></div>): ''
			const assetsProps = getFieldProps('assets_domain', {
				rules: [
					{ required: true, message: '请输入静态域名：' }
				],
				initialValue: setting.assets_domain
			})

			const backendProps = getFieldProps('backend_domain', {
				rules: [
					{ required: true, message: '请输入后端域名：' }
				],
				initialValue: setting.backend_domain
			})

			const frontendProps = getFieldProps('frontend_domain', {
				rules: [
					{ required: true, message: '请输入前端域名：' }
				],
				initialValue: setting.frontend_domain
			})

			const uploadProps = getFieldProps('upload_path', {
				rules: [
					{ required: true, message: '请输入上传地址：' }
				],
				initialValue: setting.upload_path
			})

			const appIdProps = getFieldProps('appId', {
				rules: [
					{ required: true, message: '请输入appId：' }
				],
				initialValue: setting.appId
			})

			const appSecretProps = getFieldProps('appSecret', {
				rules: [
					{ required: true, message: '请输入appSecret：' }
				],
				initialValue: setting.appSecret
			})

			const tokenProps = getFieldProps('token', {
				rules: [
					{ required: true, message: '请输入token：' }
				],
				initialValue: setting.token
			})

			const encodingAesKeyProps = getFieldProps('encodingAesKey', {
				rules: [
					{ required: true, message: '请输入encodingAesKey：' }
				],
				initialValue: setting.encodingAesKey
			})

			const operateLogProps = getFieldProps('open_operate_log', {
				rules: [
					{ required: true, type: 'number', message: '请选择是否开启请求日志：' }
				],
				initialValue: this.eachRadio(open_operate_log)
			})

			const requestLogProps = getFieldProps('open_request_log', {
				rules: [
					{ required: true,  type: 'number', message: '请选择是否开启数据库日志：' }
				],
				initialValue: this.eachRadio(open_request_log)
			})

			const dbLogProps = getFieldProps('open_db_log', {
				rules: [
					{ required: true,  type: 'number', message: '请选择是否开启操作日志：' }
				],
				initialValue: this.eachRadio(open_db_log)
			})


			const yqxProps = getFieldProps('open_yiqixiu', {
				rules: [
					{ required: true,  type: 'number', message: '请选择是否开启易企秀：' }
				],
				initialValue: this.eachRadio(open_yiqixiu),
				onChange: ::this.handleChangeRadio
			})

			return (
				<div className="pure-form">
					<Spin spinning={this.props.loading}>
						<Form horizontal style={{ marginTop: 40 }}>
							<FormItem 
							  {...formItemLayout}
					          label="静态资源访问域名："
					          hasFeedback>
					          <Input {...assetsProps} type="text"/>
					        </FormItem>
							<FormItem 
							 {...formItemLayout}
					         label="后端访问域名："
					         hasFeedback>
					          <Input {...backendProps} type="text"/>
					        </FormItem>
							<FormItem 
							  {...formItemLayout}
					          label="前端访问域名："
					          hasFeedback>
					          <Input {...frontendProps} type="text"/>
					        </FormItem>
							<FormItem
							{...formItemLayout}
					          label="上传保存地址："
					          hasFeedback>
					          <Input {...uploadProps} type="text"/>
							</FormItem>
							<FormItem 
							  {...formItemLayout}
					          label="appId："
					          hasFeedback>
					          <Input {...appIdProps} type="text"/>
					        </FormItem>
							<FormItem 
							  {...formItemLayout}
					          label="appSecret："
					          hasFeedback>
					          <Input {...appSecretProps}  type="text"/>
					        </FormItem>
							<FormItem
							  {...formItemLayout}
					          label="token："
					          hasFeedback>
					          <Input {...tokenProps} type="text"/>
					        </FormItem>
							<FormItem
							  {...formItemLayout}
					          label="encodingAesKey："
					          hasFeedback>
				        	  <Input {...encodingAesKeyProps} type="text"/>
							</FormItem>
							 <FormItem  {...formItemLayout} label="开启易企秀：">
			    	        	<RadioGroup {...yqxProps} value={+this.state.open_yiqixiu}>
						            {	
						            	open_yiqixiu.map(item => {
						            		return (
						            			<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
						            		)
						            	})
						            }
					            </RadioGroup>
					        </FormItem>
					        {yqx_option}
							<FormItem {...formItemLayout} label="请求日志：">
								<RadioGroup {...requestLogProps} >
						            {	
						            	open_db_log.map(item => {
						            		return (
						            			<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
						            		)
						            	})
						            }
					            </RadioGroup>
					        </FormItem>
					        <FormItem  {...formItemLayout} label="数据库日志：">
			    	        	<RadioGroup {...dbLogProps} >
						            {	
						            	open_operate_log.map(item => {
						            		return (
						            			<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
						            		)
						            	})
						            }
					            </RadioGroup>
					        </FormItem>
					        <FormItem  {...formItemLayout} label="操作日志：">
			    	        	<RadioGroup {...operateLogProps} >
						            {	
						            	open_request_log.map(item => {
						            		return (
						            			<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
						            		)
						            	})
						            }
					            </RadioGroup>
					        </FormItem>
					        <FormItem  {...formItemLayout}>
					        	<Col offset="12">
			        	        	<Button style={{width: 200}} type="primary" onClick={::this.handleSubmit} size="large">确定</Button>
			        			</Col>
					        </FormItem>
						</Form>
					</Spin>
				</div>
			)
		}
		
	}

	render() {
		return(
			<Spin spinning={this.props.loading}>
				{this.renderForm()}
			</Spin>				
		)
	}
}