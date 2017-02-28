import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Form from 'antd/lib/form'
import Button from 'antd/lib/button'
import Checkbox from 'antd/lib/checkbox'
import message from 'antd/lib/message'
import Spin from 'antd/lib/spin'
import Col from 'antd/lib/col'
import Auth from 'Application/components/auth'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

@Form.create()
export default class MainModal extends React.Component{
	constructor(props, context) {
		super(props, context)
		this.state = {
			auth: [],
			ready: false
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	componentWillReceiveProps(nextProps) {
		const auth = nextProps.auth.toJS()
		if(auth.length > 0 && !this.state.ready) {
			this.getDefaultCheck(auth)
		}
	}

	handleSubmit() {
		const id = this.context.location.query.id
		const auth = this.state.auth
		this.props.actions.updateExampleAuth(id, auth).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	onChange(checkedValues) {
		this.setState({auth: checkedValues})
	}

	getDefaultCheck(auth) {
		const list =  auth.map(item => {
			if(item.check == 1) {
				return item.value
			}
		})
		this.setState({
			auth: list,
			ready: true
		})
	}

	renderForm() {
		const { getFieldProps } = this.props.form
		const auth = this.props.auth.toJS()
		const formItemLayout = {
		    labelCol: { span: 4 },
		    wrapperCol: { span: 12 }
		}

		return(
			<Form horizontal style={{marginTop: 30}}>
		        <FormItem  {...formItemLayout} label="主配置：" hasFeedback>
		        {this.state.auth.length > 0? 
    	        	<CheckboxGroup options={auth} defaultValue={this.state.auth} onChange={::this.onChange}/>:
    	        	<span></span>
		        }
	        	</FormItem>

	        	<FormItem  {...formItemLayout}>
		        	<Col offset="8">
			        	<Auth type={['cards-example-update']}>
	        	        	<Button type="primary" size="default" onClick={::this.handleSubmit}>确定</Button>
	        	        </Auth>
        	        	<Button type="ghost" size="default" onClick={() => {history.back()}} style={{ marginLeft: 40 }}>返回</Button>
        			</Col>
			    </FormItem>
			</Form>
		)
	}
	render() {
		return (
			<div>
				{this.renderForm()}
			</div>
		)
	}
}