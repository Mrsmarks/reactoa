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
@Key(['content'])
@Form.create()
export default class addRedeemComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			modalVisible:false
		}
	}

	static propTypes = {
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
			values.cardsList = this.props.form.getFieldValue(['cardsList'])
			console.log(values)
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

		// const selectData = this.props.selectData

		// console.log(selectData.toJS())
		
		// const { getFieldProps } = this.props.form

		// const cardsListProps = getFieldProps('cardsList',{
		// })

		return (
			<div>
				<Form horizontal style={{marginTop: 40}}>
					<FormItem 
			          {...formItemProps}
			          label="卡券:"
			          hasFeedback
			          style={{marginLeft:16}}
			         >
				        <Auth type={["wechat-menu-add"]}>
							<Button type="primary" onClick={() => {this.toggleModal({}, 'modalVisible')}} style={{marginRight:16}}>
								请选择卡券
							</Button>
						</Auth>
			        </FormItem>
					<FormItem
				      label="卡券兑换码："
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
						fetchCardVoucherRedeem: ::this.props.actions.fetchCardVoucherRedeem
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