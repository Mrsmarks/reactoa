import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classnames from 'classnames'
import styles from '../index.scss'
import Row from 'antd/lib/row'
import { Link } from 'react-router'
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
			this.props.changeStatus({...values, status: state}, 'shakePrize')
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
		const shakePrize = this.props.shakePrize
		const { getFieldProps, getFieldsValue } = this.props.form
		const { id } = this.context.location.query
		const styleObj = shakePrize.status == 0? {color: 'white'}: {}
		const switchStatus = !this.context.pending && shakePrize.status != -1? <Col><Switch  onChange={::this.changeStatus} checked={!!shakePrize.status}></Switch></Col>: ''
		const content = shakePrize.status != -1? 
					(<Col offset={1} style={{marginTop: 5, marginBottom: 5}}>
			      		<FormItem  {...formItemLayout} label="当前项：" style={{width: "100%"}}>
			      			<Select {...getFieldProps('selected_id', {
			      				initialValue: shakePrize.selected_id+'',
		      					onChange: ::this.changePopStatus
			      			})} size="default">
		      					<OptGroup label="已参与">
			      					{
			      						shakePrize.option.join.map(item => {
				      						return(
				      							<Option key={item.id} value={item.id}>{item.name}</Option>
				      						)
				      					})
			      					}
			      				</OptGroup>
			      				
			      				<OptGroup label="未参与">
			      					{
			      						shakePrize.option.unjoin.map(item => {
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
			      				initialValue: shakePrize.phone_tid? shakePrize.phone_tid+'':'',
			      				onChange: ::this.changePopStatus
			      			})} 
			      				
			      				placeholder="请选择模板"
			      				size="default"
			      			>
			      			{
			      				shakePrize.templateListOfPhone.map(item => {
			      					return (
			      						<Option key={item.id} value={item.id+''}>{item.name}</Option>
			      					)
			      				})
			      			}
		      					
			      			</Select>
			      		</FormItem>

			      		<FormItem {...formItemLayout} label="大屏模板："style={{width: "100%"}}>
			      			<Select {...getFieldProps('screen_tid', {
			      				initialValue: shakePrize.screen_tid? shakePrize.screen_tid+'':'',
			      				onChange: ::this.changePopStatus
			      			})} 
			      				 
			      				placeholder="请选择模板"
			      				size="default"
			      			>
			      			{
			      				shakePrize.templateListOfScreen.map(item => {
			      					return (
			      						<Option key={item.id} value={item.id+''}>{item.name}</Option>
			      					)
			      				})
			      			}
		      					
			      			</Select>
			      		</FormItem>
		      		</Col>): (<Col offset={1}>
			      <div className={styles['paragraph']}>未设置摇大奖<Link to={{ pathname: '/wall-details/function-shake-prize/index', state: 'POP', query:{id: id, wallName: this.context.location.query.wallName}}}>去设置</Link></div>
		      </Col>)
		return(
			<div className={styles['panel-content-item']}>
				<div className={styles['shade']} hidden={shakePrize.status != 0}></div>
				<div>
					<Row type="flex" justify="space-between"  style={{zIndex: '9', position: 'relative', ...styleObj}}>
		      			<Col><IconFont type="icon-prize"/><span className={styles['title']}>摇大奖</span>（快捷键：W）<Link to={{ pathname: '/wall-details/data-shake-prize/index', state: 'POP', query:{id: id, wallName: this.context.location.query.wallName}}}>{shakePrize.status== 1? ' | 查看结果': ''}</Link></Col>
		      			{switchStatus}
		      		</Row>
		      		<div>{content}</div>
		      		<div className={styles['paragraph']}>tips: 开始摇大奖/再来一轮，快捷键[空格], 切换上/下一个活动</div>
				</div>
				<Popup 
	      			func={::this.changePopStatus} 
	      			popup={this.state.popup}
	      			params={getFieldsValue()}
	      			type="shakePrize"
	      			prop={this.props}
	      		/>
	      	</div>
		)
	}
}