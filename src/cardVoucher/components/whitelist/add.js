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
import Auth from 'Application/components/auth'
import AddModal from './addModal'

const FormItem = Form.Item
const Option = Select.Option
@Key(['content'])
@Form.create()
export default class addWhiteComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			modalVisible:false,
			card: ""
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

	toggleModal(info, visible) {
		this.setState({
			[visible]: !this.state[visible],
		})
	}

	handleTextChange(event) {
		this.setState({
			template_path: event.target.value
		})
	}

	handleSubmit = () => {
		this.props.form.validateFields((errors) => {
			if(!!errors){
				return
			}
			let values = {}
			values.type = this.props.form.getFieldValue(['type'])
			values.white_list_type = this.props.form.getFieldValue(['white_list_type'])
			this.props.actions.addCardVoucherWhite(values).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push('/card-voucher/whitelist/index')
			})
		})
	}

	handChange = (value) => {
		if(value === "card"){
			this.setState({ card : "卡卷"})
		}else if(value === "route"){
			this.setState({ card : "路由" })
		}
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


		return (
			<div>
				<Form horizontal style={{marginTop: 40 }}>
					<FormItem
					label="作用对象："
					style={{ marginLeft:20 }}
					{...formItemProps}
					>
						<Select style={{ width: 150 }} placeholder="请选择作用对象" onChange={this.handChange}>
					    	<Option key={'x'} value="-1">请选择作用对象</Option>
					    	{
								selectData.get('objectType').map(item => 
									<Option key={item.get('id')} value={item.get('id')+''}>{item.get('name')}</Option>
								)
							}
						</Select>
					</FormItem>
					<FormItem 
			          {...formItemProps}
			          label={this.state.card}
			          hasFeedback
			          style={{marginLeft:20}}
			         >
				        <Auth type={["wechat-menu-add"]}>
							<Button type="primary" onClick={() => {this.toggleModal({}, 'modalVisible')}} style={{marginRight:16}}>
								选择卡券
							</Button>
						</Auth>
			        </FormItem>
					<FormItem
					label="白名单类型："
					style={{ marginLeft:20 }}
					{...formItemProps}
					>
						<Select style={{ width: 150 }} placeholder="请选择白名单类型">
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
				      <Input type="textarea" rows="5" cols="5" />
				    </FormItem>
					<FormItem>
						<Col offset="3">
							<Button type="primary" onClick={this.handleSubmit}>确定</Button>
							<Button type="ghost" style={{marginLeft:10}} onClick={() => {history.back()}}>返回</Button>
						</Col>	
					</FormItem>
				</Form>
				<AddModal
					visible={this.state.modalVisible}
					toggle={::this.toggleModal}
					addLoading={this.props.addLoading}
					actions={{
						fetchCardVoucherWhite: ::this.props.actions.fetchCardVoucherWhite
					}}					
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