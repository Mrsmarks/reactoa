import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import Immutable from 'immutable'
import classnames from 'classnames'
import styles from '../index.scss'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import Switch from 'antd/lib/switch'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Popup from '../popup/popup'
import IconFont from 'Application/components/iconFont'

const Option = Select.Option
const OptGroup = Select.OptGroup
const FormItem = Form.Item

@Form.create()
export default class PictureComp extends React.Component {

	constructor(props, context) {
		super(props, context)
		this.state = {
			popup: false
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		getSid: PropTypes.func.isRequired,
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
			this.props.changeStatus({...values, status: state}, 'money')
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
		const money = this.props.money
		const id = this.context.location.query.id
		const styleObj = money.status == 0? {color: 'white'}: {}
		const switchStatus = !this.context.pending && money.status != -1? <Col><Switch onChange={::this.changeStatus} checked={!!money.status}></Switch></Col>: ''
		const content = money.status != -1? 
					(<Col offset={1} style={{marginTop: 5, marginBottom: 5}}>
			      		<FormItem {...formItemLayout} label="当前项："style={{width: "100%"}}>
			      			<Select {...getFieldProps('selected_id', {
			      				initialValue: money.selected_id+'',
		      					onChange: ::this.changePopStatus
			      			})}  size="default">
		      					<OptGroup label="已参与">
			      					{
			      						money.option.join.map(item => {
				      						return(
				      							<Option key={item.id} value={item.id}>{item.name}</Option>
				      						)
				      					})
			      					}
			      				</OptGroup>
			      				
			      				<OptGroup label="未参与">
			      					{
			      						money.option.unjoin.map(item => {
				      						return(
				      							<Option key={item.id} value={item.id}>{item.name}</Option>
				      						)
				      					})
			      					}
			      				</OptGroup>
			      			</Select>
			      		</FormItem>
			      		<FormItem {...formItemLayout} label="手机模板："style={{width: "100%"}}>
			      			<Select {...getFieldProps('phone_tid', {
			      				initialValue: money.phone_tid? money.phone_tid+'':'',
			      				onChange: ::this.changePopStatus
			      			})} 
			      				
			      				placeholder="请选择模板"
			      				size="default"
			      			>
			      			{
			      				money.templateListOfPhone.map(item => {
			      					return (
			      						<Option key={item.id} value={item.id+''}>{item.name}</Option>
			      					)
			      				})
			      			}
		      					
			      			</Select>
			      		</FormItem>

			      		<FormItem {...formItemLayout} label="大屏模板："style={{width: "100%"}}>
			      			<Select {...getFieldProps('screen_tid', {
			      				initialValue: money.screen_tid? money.screen_tid+'':'',
			      				onChange: ::this.changePopStatus
			      			})} 
			      				 
			      				placeholder="请选择模板"
			      				size="default"
			      			>
			      			{
			      				money.templateListOfScreen.map(item => {
			      					return (
			      						<Option key={item.id} value={item.id+''}>{item.name}</Option>
			      					)
			      				})
			      			}
		      					
			      			</Select>
			      		</FormItem>
		      		</Col>): (<Col offset={1}>
			      <div className={styles['paragraph']}>未设置数钱<Link to={{ pathname: '/wall-details/function-money/index', state: 'POP', query:{id: id, wallName: this.context.location.query.wallName}}}> 去设置</Link></div>
		      </Col>)
		return(
			<div className={styles['panel-content-item']}>
				<div className={styles['shade']} hidden={money.status != 0 }></div>
				<div>
					<Row type="flex" justify="space-between" style={{zIndex: '9', position: 'relative', ...styleObj}}>
		      			<Col><IconFont type="icon-money"/><span className={styles['title']}>数钱</span>（快捷键：S）<Link to={{ pathname: '/wall-details/data-money/index', state: 'POP', query:{id: id, wallName: this.context.location.query.wallName}}}>{money.status == 1? ' | 查看结果': ''}</Link></Col>
		      			{switchStatus}
		      		</Row>
	      			<div>{content}</div>
			      	<div className={styles['paragraph']}>tips: 开始数钱/再来一轮，快捷键[空格], 切换上/下一个活动</div>
				</div>
				<Popup 
	      			func={::this.changePopStatus} 
	      			popup={this.state.popup}
	      			params={getFieldsValue()}
	      			type="money"
	      			prop={this.props}
	      		/>
	      	</div>
		)
	}
}