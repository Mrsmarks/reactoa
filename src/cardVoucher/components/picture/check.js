import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'

const FormItem = Form.Item
@Form.create()
export default class checkPicComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info:[],
			img_url:''
		}
	}

	static propTypes = {
		info: PropTypes.instanceOf(Immutable.Map).isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}
	
	render(){
		const { getFieldProps } = this.props.form
		const checkedInfo = this.props.info
		const imgInfo = checkedInfo.get('img_url')

		const formItemProps = {
			labelCol: { span: 3 },
			wrapperCol: { span:6 }
		}

		const acnameProps = getFieldProps('acname', {
			initialValue: checkedInfo.get('acname')
		})

		const nameProps = getFieldProps('name', {
			initialValue: checkedInfo.get('name')
		})

		return (
			<div>
				<Form horizontal style={{marginTop: 40 }}>
					<FormItem
						{...formItemProps}
						label="公众号："						
					>
						<Input {...acnameProps} disabled/>
					</FormItem>
					<FormItem
					 	{...formItemProps}
					 	label="图片名称："
					 	hasFeedback
					 	required
					>
						<Input  {...nameProps} disabled/>
					</FormItem>
					<FormItem
						{...formItemProps}
						label="上传图片："
					>
						<img src={ imgInfo?this.props.assetsUrl + imgInfo:'' }/>
					</FormItem>

					<FormItem
					>
						<Col offset="3">
							<Button type="ghost" style={{marginLeft:10}} onClick={() => {history.back()}}>返回</Button>
						</Col>	
					</FormItem>
				</Form>
			</div>
		)
	}
}
