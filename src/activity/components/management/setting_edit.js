import React, { PropTypes } from 'react'

import Form from 'antd/lib/form'

import Button from 'antd/lib/button'



import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'

import message from 'antd/lib/message'
import DatePicker from 'antd/lib/date-picker'
import TimePicker from 'antd/lib/time-picker'
import Table from 'antd/lib/table'
import Popconfirm from 'antd/lib/popconfirm'
import Spin from 'antd/lib/spin'

import SettingAddModal from './setting_add_modal'

import format from 'Application/utils/formatDate'


const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker


@Form.create()
export default class MainModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			dataSource: [],
			visible: false,
			ready: false,
			start_time:'',
			end_time: '',
			draw_start_time:'',
			draw_end_time: '',
			info: {}
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	componentWillReceiveProps(nextProps) {
		const info = nextProps.info.toJS()
		const dataSource = nextProps.info.toJS().prize_config
		if(Object.prototype.toString.call(dataSource) == '[object Array]'){
			dataSource.forEach(item => {
				item.key = Math.random().toString(36).substr(2,7)
			})
		}
		if(!this.state.ready) {
			this.setState({
				dataSource: dataSource? dataSource: [],
				ready: true
			})
		}
	}

	handleSubmit() {
		const type = this.context.location.query.type
		const info = this.props.info.toJS()
		this.props.form.validateFields((err, values) => {
			if(err) {
				return
			}
			let formData = {
				prize_id: [],
				factor: '',
				factor_len: [],
				lucky_num: []
			}
			const dataSource = this.state.dataSource
			dataSource.forEach(item => {
				formData.prize_id.push(item.prize_id)
				formData.lucky_num.push(item.lucky_num)
				if(type == 'lottery') {
					formData.factor = formData.factor? formData.factor + '-' + item.factor: item.factor
					formData.factor_len.push(item.factor_len)
				}
			})

			formData.start_time = this.state.start_time? this.state.start_time: info.start_time
			formData.end_time =this.state.end_time? this.state.end_time: info.end_time
			formData.draw_start_time = this.state.draw_start_time? this.state.draw_start_time: info.draw_start_time
			formData.draw_end_time = this.state.draw_end_time? this.state.draw_end_time: info.draw_end_time
			formData.aid = this.context.location.query.aid
			const aid = this.context.location.query.aid
			const id = this.context.location.query.id
			console.log(formData)
			this.props.actions.updateSettingList(formData, id, aid).then(resolve => {
				message.success(resolve.errormsg)
				this.context.router.push({
					pathname: '/activity/setting/list',
					query: {
						aid: this.context.location.query.aid,
						type: this.context.location.query.type
					}
				})
			})
		})
	}

	setDataSource(info) {
		const dataSource = this.state.dataSource
		const dataEdit = this.state.info
		if(Object.keys(dataEdit).length > 0) {
			const index = dataSource.findIndex(item => item.key == info.key)
			if(index > -1) dataSource[index] = info
		}else{
			info.key = Math.random().toString(36).substr(2,7)
			dataSource.unshift(info)
		}
		this.setState({
			dataSource: dataSource,
			visible: false
		})
	}

	removeItem(key, dataSource) {
		dataSource = dataSource.filter(item => {
			return item.key != key
		})
		this.setState({
			dataSource: dataSource
		})
	}

	toggleModal(info, visible, cb) {
		if(info) {
			if(cb) {
				cb(info)
			}
			this.setState({
				[visible]: !this.state[visible],
				info: info
			})
		}else{
			this.setState({
				[visible]: !this.state[visible],
				info: {}
			})
		}	
	}

	activeTimeChange(value, dateString) {
		this.setState({
			start_time: dateString[0],
			end_time: dateString[1]
		})
		console.log('From: ', dateString[0], ', to: ', dateString[1])
	}

	drawTimeChange(value, dateString) {
		this.setState({
			draw_start_time: dateString[0],
			draw_end_time: dateString[1]
		})
		console.log('From: ', dateString[0], ', to: ', dateString[1]);
	}

	renderForm() {

		const { getFieldProps, getFieldValue } = this.props.form
		const info = this.props.info.toJS()
		const formItemLayout = {
		    labelCol: { span: 3 },
		    wrapperCol: { span: 12 }
		}
		if(Object.keys(info).length > 0 && info.id == this.context.location.query.id) {
			return(
				<Form horizontal >
			       <FormItem
			          {...formItemLayout}
			          label="活动时间："
			          required
			          hasFeedback
			          >
			         <RangePicker defaultValue={[info.start_time, info.end_time]} showTime format="yyyy-MM-dd HH:mm:ss" onChange={::this.activeTimeChange} />
			        </FormItem>

			      
			         <FormItem
			          {...formItemLayout}
			          label="开奖时间："
			          required
			          hasFeedback
			          >
			         <RangePicker defaultValue={[info.draw_start_time, info.draw_end_time]} showTime format="yyyy-MM-dd HH:mm:ss" onChange={::this.drawTimeChange} />
			        </FormItem>

			        <FormItem
			          {...formItemLayout}
			          label="操作："
			          disabled
			          hasFeedback
			          >
			          <Button size="default" onClick={() => {this.toggleModal(undefined, 'visible')}} type="primary">
			          	<Icon type="plus"/>
			          	增加奖品
			          </Button>
			        </FormItem>
			        {this.renderTable()}
			        <Col style={{marginTop: 20}} offset='7'>
				        <Button onClick={::this.handleSubmit} style={{width: 120}} type="primary">
				        	确定
				        </Button>
				        <Button onClick={() => {history.back()}}style={{width: 120, marginLeft: 80}} type="ghost">
				        	返回
				        </Button>
			        </Col>
				</Form>
			)
		}
	}

	renderTable() {
		const removeItem = (key, dataSource) => _ => {
			return this.removeItem(key, dataSource)
		}
		const dataSource = this.state.dataSource
		const select = this.props.select.toJS()
		const type = this.context.location.query.type
		const toggleModal = (info, visible, cb) => _ => {
			return this.toggleModal(info, visible, cb)
		}
		const typeCloumn = type == 'lottery'? [{
			title: '中奖因子',
			dataIndex: 'factor',
			key: 'factor'
		}, {
			title: '因子长度',
			dataIndex: 'factor_len',
			key: 'factor_len',
		}]: ''
		const columns = [{
			title: '奖品',
			dataIndex: 'prize_id',
			key: 'prize_id',
			render(id, obj) {
				const info = select.find(item => item.id == id)
				const name = info? info.name: ''
				return (
					<span>{name}</span>
				)
			}
		}, ...typeCloumn, {
			title: '最大中奖数量',
			dataIndex: 'lucky_num',
			key: 'lucky_num',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<a onClick={toggleModal(obj, 'visible')}>修改</a>
						<span style={{marginLeft: 5}}></span>
						<Popconfirm title="确定要删除吗？" onConfirm={removeItem(obj.key, dataSource)}>
								<a>删除</a>
						</Popconfirm>
						</div>
				)
			}
		}]

		return (
			<Table 
				dataSource={this.state.dataSource}
				columns={columns}
				pagination={ false }
			/>
		)
	}

	render() {
		return(
			<div style={{paddingTop: 20}}>
				<Spin spinning={!this.state.ready}>
					{this.renderForm()}
				</Spin>
				<SettingAddModal
					visible={this.state.visible}
					toggle={::this.toggleModal}
					info={this.state.info}
					select={this.props.select.toJS()}
					setDataSource={::this.setDataSource}
				/>
			</div>
		)
	}
}