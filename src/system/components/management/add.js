import city from 'Application/utils/city'
import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'

import Radio from 'antd/lib/radio'

import Cascader from 'antd/lib/cascader'
import Col from 'antd/lib/col'
import Spin from 'antd/lib/spin'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'


const FormItem = Form.Item
const RadioGroup = Radio.Group

/**
 * 微信－企业－新增
 */
@Form.create()
export default class EditComp extends React.Component {
	constructor(props, context) {
    	super(props, context)
    	this.state = {
    		img_url: ''
    	}
  	}
  	
	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	} 

  	handleReset(e) {
  	    e.preventDefault();
  	    this.props.form.resetFields();
  	} 

  	handleAdd(info) {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			values.province = values.position[0]
			values.city = values.position[1]
			values.district = values.position[2]
			values.logo = this.state.img_url
			this.props.actions.addManagementList(values).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push('system/management/list')
			})
		})
		
	}

	uploadFile(file) {
		this.props.actions.uploadFile(file).then(x => {
			message.success(x.errormsg)
			this.setState({
				img_url: x.result.file_url
			})
		})
	}

	render() {
			const { getFieldProps } = this.props.form
			const option = this.props.option.toJS()
			const formItemLayout = {
			    labelCol: { span: 3 },
			    wrapperCol: { span: 8 }
			}

			const nameProps = getFieldProps('name', {
				rules: [
					{ required: true, message: '请输入企业名称' }
				],
			})

			const contactProps = getFieldProps('contact', {
				rules: [
					{ required: true, message: '请输入企业联系人' }
				],
			})

			const emailProps = getFieldProps('email', {
				rules: [
					{ required: true, type: 'email', message: '请输入正确的邮箱格式' }
				],
			})

			const telProps = getFieldProps('tel', {
				rules: [
					{ required: true, pattern: /^1\d{10}$/, message: '请输入联系人电话' }
				],
			})

			const addressProps = getFieldProps('address', {
				rules: [
					{ required: true, message: '请输入地址' }
				],
			})

			const introProps = getFieldProps('intro', {
				rules: [
					{ required: true, message: '请输入简介' }
				],
			})

			// const departmentProps = getFieldProps('department_data_exchange', {
			// 	rules: [
			// 		{ required: true, type:'number', message: '请选择使用状态' }
			// 	],
			// 	initialValue: 0
			// })

			const positionProps = getFieldProps('position', {
				rules: [
					{ required: true, type:'array', message: '请选择位置' }
				],
			})

			const userStateProps = getFieldProps('use_state', {
				rules: [
					{ required: true, type:'number', message: '请选择数据互通状态' }
				],
				initialValue: 0

			})

			const setImgUrl = (img_url) => {
			this.setState({
		      	img_url: img_url
		      })
			}

			const fileProps = {
				accept: 'image/*',
				listType: 'picture-card',
				beforeUpload: this.uploadFile.bind(this),
				fileList: this.state.img_url ? [{
					uid: -1,
					status: 'done',
					url: this.props.assets_domain + this.state.img_url
				}] : []
			}

		return (
			<Spin tip="文件上传中..." spinning={this.props.fileLoading}>
				<Form horizontal style={{ marginTop: 40 }}>
					<FormItem
			          {...formItemLayout}
			          label="企业名称："
			          hasFeedback
			          >
			          <Input {...nameProps}/>
			       </FormItem>

			        <FormItem
			            {...formItemLayout}
			            label="logo："
			            required
				         >
						<Upload {...fileProps}>
							<Icon type="plus" />
							<div className="ant-upload-text">logo</div>
						</Upload>
				    </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="所在城市："
			          hasFeedback
			          >
			          <Cascader {...positionProps} options={city}/>
			        </FormItem>

			         <FormItem
			          {...formItemLayout}
			          label="详细地址："
			          hasFeedback
			          >
			          <Input {...addressProps} />
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="联系人："
			          hasFeedback
			          >
			          <Input {...contactProps}/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="联系邮箱："
			          hasFeedback
			          >
			          <Input {...emailProps}/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="联系电话："
			          hasFeedback
			          >
			          <Input {...telProps}/>
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="简介："
			          hasFeedback
			          >
			          <Input {...introProps} type="textarea" rows="6"/>
			        </FormItem>


			        <FormItem
			          {...formItemLayout}
			          label="使用状态："
			          hasFeedback
			          >
			          <RadioGroup {...userStateProps}>
			          	{
			          		option.userState.map(item => {
			          			return(
			          				<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
			          			)
			          		})
			          	}
			          </RadioGroup>
			        </FormItem>
		  			
		  			{/*<FormItem
			          {...formItemLayout}
			          label="部门数据互通状态："
			          hasFeedback
			          >
				          <RadioGroup {...departmentProps}>
				          	{
				          		option.exchangeState.map(item => {
				          			return(
				          				<Radio key={item.id} value={item.id+''}>{item.name}</Radio>
				          			)
				          		})
				          	}
				          </RadioGroup>
			        </FormItem>*/}

			        <FormItem  {...formItemLayout}>
			        	<Col offset="9">
	        	        	<Button type="primary" size="large" style={{width: 200}} onClick={::this.handleAdd}>确定</Button>
	        			</Col>
				    </FormItem>
			     
				</Form>
			</Spin>
		)
	}
}


 