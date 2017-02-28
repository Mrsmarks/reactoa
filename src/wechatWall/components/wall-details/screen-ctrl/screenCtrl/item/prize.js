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
import IconFont from 'Application/components/iconFont'
import Checkbox from 'antd/lib/checkbox'
import Popup from '../popup/popup'
import message from 'antd/lib/message'

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
			this.props.changeStatus({...values, status: state}, 'prize')
		})
	}

	freshPeopleNum() {
		const sid = this.context.getSid()
		this.props.freshPeopleNum(sid).then(resolve => {
			message.success('刷新成功！')
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
		const prize = this.props.prize
		const id = this.context.location.query.id
		const styleObj = prize.status == 0? {color: 'white'}: {}
		const switchStatus = !this.context.pending && prize.status != -1? <Col><Switch onChange={::this.changeStatus} checked={!!prize.status}></Switch></Col>: ''
		const checkBox = !this.context.pending? <Checkbox  defaultChecked={prize.draw_show_headimg} {...getFieldProps('draw_show_headimg', { onChange: ::this.changePopStatus})}>依次展现获奖人大头像</Checkbox>: ''
		const content = prize.status != -1? 
					(<Col offset={1} style={{marginTop: 5, marginBottom: 5}}>
			      		<FormItem {...formItemLayout} label="当前项：" style={{width: "100%"}}>
			      			<Select {...getFieldProps('selected_id', {
			      				initialValue: prize.selected_id+'',
			      				onChange: ::this.changePopStatus
			      			})}  size="default">
		      					<OptGroup label="已参与">
			      					{
			      						prize.option.join.map(item => {
				      						return(
				      							<Option key={item.id} value={item.id}>{item.name}</Option>
				      						)
				      					})
			      					}
			      				</OptGroup>
			      				
			      				<OptGroup label="未参与">
			      					{
			      						prize.option.unjoin.map(item => {
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
			      				initialValue: prize.phone_tid? prize.phone_tid+'':'',
			      				onChange: ::this.changePopStatus
			      			})} 
			      				
			      				placeholder="请选择模板"
			      				size="default"
			      			>
			      			{
			      				prize.templateListOfPhone.map(item => {
			      					return (
			      						<Option key={item.id} value={item.id+''}>{item.name}</Option>
			      					)
			      				})
			      			}
		      					
			      			</Select>
			      		</FormItem>

			      		<FormItem {...formItemLayout} label="大屏模板："style={{width: "100%"}}>
			      			<Select {...getFieldProps('screen_tid', {
			      				initialValue: prize.screen_tid? prize.screen_tid+'':'',
			      				onChange: ::this.changePopStatus
			      			})} 
			      				 
			      				placeholder="请选择模板"
			      				size="default"
			      			>
			      			{
			      				prize.templateListOfScreen.map(item => {
			      					return (
			      						<Option key={item.id} value={item.id+''}>{item.name}</Option>
			      					)
			      				})
			      			}
		      					
			      			</Select>
			      		</FormItem>
			      		<div style={{marginTop: 5}}>
				      		<FormItem label="参与抽奖：">
				      			<div>{prize.people_num}人 <a onClick={::this.freshPeopleNum}><Icon type="reload"/></a></div>
				      		</FormItem>
			      		</div>
			      		<div style={{marginTop: 5}}>
				      		<FormItem >
				      			{checkBox}
				      		</FormItem>
			      		</div>
		      		</Col>): (<Col offset={1}>
			      <div className={styles['paragraph']}>未设置抽奖<Link to={{ pathname: '/wall-details/function-lottery/index', state: 'POP', query:{id: id, wallName: this.context.location.query.wallName}}}> 去设置</Link></div>
		      </Col>)
		return(
			<div className={styles['panel-content-item']}>
				<div className={styles['shade']} hidden={prize.status != 0}></div>
				<div>
		      		<Row type="flex" justify="space-between" style={{zIndex: '9', position: 'relative', ...styleObj}}>
		      			<Col><IconFont type="icon-draw"/><span className={styles['title']}>抽奖</span>（快捷键：C）<Link to={{ pathname: '/wall-details/data-prize/index', state: 'POP', query:{id: id, wallName: this.context.location.query.wallName}}}>{prize.status == 1? ' | 查看结果': ''}</Link></Col>
		      			{switchStatus}
		      		</Row>
	      			<div>{content}</div>
		      		<div className={styles['paragraph']}>tips: 开始/停止抽奖,快捷键[空格],切换上/下一个活动</div>
	      		</div>
	      		<Popup
      				func={::this.changePopStatus} 
	      			popup={this.state.popup}
	      			params={getFieldsValue()}
	      			type="prize"
	      			prop={this.props}
      			/>
	      	</div>
		)
	}
}