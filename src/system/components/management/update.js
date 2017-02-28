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
	state = {
		ready: false
	}
  	
	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	static propTypes = {
		actions: PropTypes.object.isRequired,
		assets_domain: PropTypes.string.isRequired
	}

  	handleReset(e) {
  	    e.preventDefault();
  	    this.props.form.resetFields();
  	} 

  	componentWillReceiveProps(nextProps) {
		const info = nextProps.info.toJS()
		if(!this.state.ready) {
			this.setState({
				img_url: info.logo,
				ready: true
			})
		}
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
			this.props.actions.updateManagementList(values, this.context.location.query.id).then(resolve => {
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
			const info = this.props.info.toJS()
			const formItemLayout = {
			    labelCol: { span: 6 },
			    wrapperCol: { span: 18 }
			}

			const nameProps = getFieldProps('name', {
				rules: [
					{ required: true, message: '请输入企业名称' }
				],
				initialValue: info.name
			})

			const contactProps = getFieldProps('contact', {
				rules: [
					{ required: true, message: '请输入企业联系人' }
				],
				initialValue: info.contact
			})

			const logoProps = getFieldProps('logo', {
				initialValue: info.logo

			})

			const emailProps = getFieldProps('email', {
				rules: [
					{ required: true, message: '请输入邮箱' }
				],
				initialValue: info.email

			})

			const telProps = getFieldProps('tel', {
				rules: [
					{ required: true, message: '请输入联系人电话' }
				],
				initialValue: info.tel
			})

			const addressProps = getFieldProps('address', {
				rules: [
					{ required: true, message: '请输入地址' }
				],
				initialValue: info.address
			})

			const introProps = getFieldProps('intro', {
				rules: [
					{ required: true, message: '请输入简介' }
				],
				initialValue: info.intro

			})

			// const departmentProps = getFieldProps('department_data_exchange', {
			// 	rules: [
			// 		{ required: true, type:'number', message: '请选择数据互通状态' }
			// 	],
			// 	initialValue: info.department_data_exchange

			// })

			const positionProps = getFieldProps('position', {
				rules: [
					{ required: true, type:'array', message: '请选择位置' }
				],
				initialValue: [info.province, info.city, info.district]

			})

			const userStateProps = getFieldProps('use_state', {
				rules: [
					{ required: true, type:'number', message: '请选择使用状态' }
				],
				initialValue: info.use_state
				
			})


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
			<div className="pure-form">
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
							{/*<Input {...logoProps} value={this.state.img_url} readOnly/>*/}
							<Upload {...fileProps}>
								<Icon type="plus" />
								<div className="ant-upload-text">logo</div>
							</Upload>
				        </FormItem>

				        <FormItem
				          {...formItemLayout}
				          label="所在城市："
				          >
				          <Cascader options={city} {...positionProps}/>
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
			</div>
		)
	}
}


 