import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classnames from 'classnames'
import styles from '../index.scss'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Select from 'antd/lib/select'
import { Link } from 'react-router'
import Icon from 'antd/lib/icon'
import Form from 'antd/lib/form'
import Switch from 'antd/lib/switch'
import Checkbox from 'antd/lib/checkbox'
import InputNumber from 'antd/lib/input-number'
import IconFont from 'Application/components/iconFont'
import Popup from '../popup/popup'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option

@Form.create()
export default class WallComp extends React.Component {

	constructor(props, context) {
		super(props, context)
		this.state = {
			popup: false
		}
	}

	static contextTypes = {
		pending: PropTypes.bool.isRequired
	}

	changePopStatus(bool) {
		this.setState({
			popup: !bool? false: true
		})
	}

	changeStatus(status) {
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			const state = Number(status)
			this.props.changeStatus({...values, status: state}, 'wall')
		})
	}

	render() {
		const formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 9
			}
		}
		const { getFieldProps, getFieldsValue } = this.props.form
		const wall= this.props.wall
		const styleObj = wall.status == 0? {color: 'white'}: {}
		const options = [{label: '图片自动弹出', value: 1}, {label: '显示消息数', value: 2}]
		const switchStatus = !this.context.pending && wall.status != -1? <Col><Switch  onChange={::this.changeStatus} checked={!!wall.status}></Switch></Col>: ''
		const content = wall.status != -1? (<div><Col offset={1}>
		      		<FormItem  label="上墙消息："style={{width: "100%"}}>
		      			<CheckboxGroup {...getFieldProps('option', {
		      				initialValue: wall.option,
		      				onChange: ::this.changePopStatus
		      			})} options={options} />
		      		</FormItem>
	      		</Col>
	      		<FormItem {...formItemLayout} label="刷新时间："style={{width: "100%"}}>
	      			 <InputNumber  {...getFieldProps('fresh_time', {
	      			 	initialValue: wall.fresh_time || 0,
	      			 	onChange: ::this.changePopStatus
	      			 })} size="default" min={1} max={60}/>
	      		</FormItem>
	      		<FormItem {...formItemLayout} label="手机模板："style={{width: "100%"}}>
			      			<Select {...getFieldProps('phone_tid', {
			      				initialValue: wall.phone_tid? wall.phone_tid+'':'',
			      				onChange: ::this.changePopStatus
			      			})} 
			      				placeholder="请选择模板"
			      				size="default"
			      			>
			      			{
			      				wall.templateListOfPhone.map(item => {
			      					return (
			      						<Option key={item.id} value={item.id+''}>{item.name}</Option>
			      					)
			      				})
			      			}
		      					
			      			</Select>
			      		</FormItem>
	      		</div>): (<Col offset={1}>
						      <div className={styles['paragraph']}>未设置消息墙<a> 去设置</a></div>
					      </Col>)
		return(
			<div className={styles['panel-content-item']}>
				<div className={styles['shade']} hidden={wall.status != 0}></div>
					<div>
			      		<Row type="flex" justify="space-between" style={{zIndex: '9', position: 'relative', ...styleObj}}>
			      			<Col><IconFont type="icon-message"/><span className={styles['title']}>消息墙</span>（快捷键：X）</Col>
			      			{switchStatus}
			      		</Row>
			      		<div>{content}</div>
		      		</div>
		      		<Popup 
		      			func={::this.changePopStatus} 
		      			popup={this.state.popup}
		      			params={getFieldsValue()}
		      			type="wall"
		      			prop={this.props}
	      			/>
	      	</div>
		)
	}
}