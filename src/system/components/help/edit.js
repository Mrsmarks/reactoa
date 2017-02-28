import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'



import Col from 'antd/lib/col'



const FormItem = Form.Item


export default class AdminEditComp extends React.Component{

	renderForm() {
		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 8 }
		}
		return(
			<div style={{marginTop:40}}>
				<Form horizontal>
					<FormItem  {...formItemLayout} label="表名："
			          hasFeedback>
			          <Input type="text"/>
					</FormItem>
					 <FormItem  {...formItemLayout} label="备注："
			          hasFeedback>
			          <Input type="text"/>
					</FormItem>
		        	<FormItem  {...formItemLayout}>
		        	<Col offset="9">
        	        	<Button type="primary" size="large" >确定</Button>
        	        	<Button type="ghost" size="large" style={{ marginLeft: 40 }}>重置</Button>
        			</Col>
		        </FormItem>
				</Form>
			</div>
		)
	}

	render() {
		return(
			<div>
				{this.renderForm()}
			</div>
		)
	}
}