import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Select from 'antd/lib/select'
import message from 'antd/lib/message'
import Icon from 'antd/lib/icon'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'
import Key from 'Application/decorators/key'

const Option = Select.Option
const FormItem = Form.Item
@Key(['content'])
@Form.create()
export default class editWhiteComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info:[],
    		fileList : [],
    		modalVisible:false
    	}
	}

	static propTypes = {
		info: PropTypes.instanceOf(Immutable.Map).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired,
		listLoading: PropTypes.bool.isRequired,
		selectData: PropTypes.instanceOf(Immutable.Map).isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	handleSubmit = () => {
		this.props.form.validateFields((errors) => {
			if(!!errors){
				return
			}
			let values = {}
			values.type = this.props.form.getFieldValue(['type'])
			values.white_list_type = this.props.form.getFieldValue(['white_list_type'])
			values.white_list_content = this.props.form.getFieldValue(['white_list_content'])
			values.card = parseInt(this.context.location.query.id)
			const id = parseInt(this.context.location.query.id)
			this.props.actions.updateCardVoucherWhite(values,id).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push({
					pathname:'/card-voucher/whitelist/index'
				})
			})
		})
	}

	renderTable() {
		const formItemProps = {
			labelCol: { span: 3 },
			wrapperCol: { span:6 }
		}

		const selectData = this.props.selectData
		
		const { getFieldProps } = this.props.form

		const objectTypeProps = getFieldProps('objectType',{
		})

		const whiteTypeProps = getFieldProps('whiteType',{
		})

		const checkedInfo = this.props.info

		const typeProps = getFieldProps('type', {
			initialValue: checkedInfo.get('type')
		})

		const nameProps = getFieldProps('white_list_type', {
			initialValue: checkedInfo.get('white_list_type')
		})

		const contentProps = getFieldProps('white_list_content', {
			initialValue: checkedInfo.get('white_list_content')
		})

		return (
			<div>
				<Form horizontal style={{marginTop: 40 }}>
					<FormItem
					label="作用对象："
					style={{ marginLeft:20 }}
					{...formItemProps}
					>
						<Select style={{ width: 150 }} {...typeProps}>
					    	<Option key={'x'} value="-1">请选择作用对象</Option>
					    	{
								selectData.get('objectType').map(item => 
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
								)
							}
						</Select>
					</FormItem>
					<FormItem
					label="白名单类型："
					style={{ marginLeft:20 }}
					{...formItemProps}
					>
						<Select style={{ width: 150 }} {...nameProps}>
					    	<Option key={'x'} value="-1">请选择白名单类型</Option>
					    	{
								selectData.get('whiteType').map(item => 
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
								)
							}
						</Select>
					</FormItem>
					<FormItem
				      label="白名单内容"
				      {...formItemProps}
				    >
				      <Input type="textarea" rows="5" cols="5" defaultValue {...contentProps}/>
				    </FormItem>
					<FormItem>
						<Col offset="3">
							<Button type="primary" onClick={this.handleSubmit}>确定</Button>
							<Button type="ghost" style={{marginLeft:10}} onClick={() => {history.back()}}>取消</Button>
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