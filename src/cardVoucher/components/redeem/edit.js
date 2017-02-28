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

const FormItem = Form.Item
@Key(['content'])
@Form.create()
export default class editRedeemComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info:[],
    		fileList : []
    	}
	}

	static propTypes = {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired,
		selectData: PropTypes.instanceOf(Immutable.Map).isRequired,
		info: PropTypes.instanceOf(Immutable.Map).isRequired,
		listLoading: PropTypes.bool.isRequired
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
			values.card_id = this.props.form.getFieldValue(['card_id'])
			values.redeem_code = this.props.form.getFieldValue(['redeem_code'])
			const id = parseInt(this.context.location.query.id)
			this.props.actions.updateCardVoucherRedeem(values,id).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push({
					pathname:'/card-voucher/redeem/index'
				})
			})
		})
	}

	toggleModal(info, visible) {
		this.setState({
			[visible]: !this.state[visible]
		})
	}

	renderTable() {
		const formItemProps = {
			labelCol: { span: 3 },
			wrapperCol: { span:6 }
		}

		const selectData = this.props.selectData
		
		const { getFieldProps } = this.props.form

		const checkedInfo = this.props.info

		const idProps = getFieldProps('card_id', {
			initialValue: checkedInfo.get('card_id')
		})

		const codeProps = getFieldProps('redeem_code', {
			initialValue: checkedInfo.get('redeem_code')
		})

		const statusProps = getFieldProps('check_status', {
			initialValue: checkedInfo.get('check_status')
		})

		return (
			<div>
				<Form horizontal style={{marginTop: 40 }}>
					<FormItem
			          	{...formItemProps}
			          	label="卡券名："
			         >
			          <Input {...idProps} type="text"/>
			        </FormItem>
					<FormItem 
			          	{...formItemProps}
			          	label="兑换码："
			         >
			          <Input {...codeProps} type="text"/>
			        </FormItem>
			        <FormItem 
			          	{...formItemProps}
			          	label="兑换状态："
			         >
			          <Input {...statusProps} type="text" disabled />
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