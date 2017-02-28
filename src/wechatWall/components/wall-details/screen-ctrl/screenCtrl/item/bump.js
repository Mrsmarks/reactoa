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

const Option = Select.Option
const FormItem = Form.Item
@Form.create()
export default class BumpComp extends React.Component {

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

	changePopStatus(bool = true) {
		this.setState({
			popup: bool
		})
	}

    changeStatus(status) {
		const state = Number(status)
		this.props.changeStatus({status: state}, 'bump')
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
		const bump = this.props.bump
		const id = this.context.location.query.id
		const switchStatus = !this.context.pending && bump.status != -1?  <Col><Switch onChange={::this.changeStatus} checked={!!bump.status}></Switch></Col>: ''
		const styleObj = bump.status == 0? {color: 'white'}: {}
		const content = bump.status != -1? 
		    (<div><FormItem {...formItemLayout} label="手机模板："style={{width: "100%"}}>
			      			<Select {...getFieldProps('phone_tid', {
			      				initialValue: bump.phone_tid? bump.phone_tid+'':'',
			      				onChange: ::this.changePopStatus
			      			})} 
			      				
			      				placeholder="请选择模板"
			      				size="default"
			      			>
			      			{
			      				bump.templateListOfPhone.map(item => {
			      					return (
			      						<Option key={item.id} value={item.id+''}>{item.name}</Option>
			      					)
			      				})
			      			}
		      					
			      			</Select>
			      		</FormItem>

			      		<FormItem {...formItemLayout} label="大屏模板："style={{width: "100%"}}>
			      			<Select {...getFieldProps('screen_tid', {
			      				initialValue: bump.screen_tid? bump.screen_tid+'':'',
			      				onChange: ::this.changePopStatus
			      			})} 
			      				 
			      				placeholder="请选择模板"
			      				size="default"
			      			>
			      			{
			      				bump.templateListOfScreen.map(item => {
			      					return (
			      						<Option key={item.id} value={item.id+''}>{item.name}</Option>
			      					)
			      				})
			      			}
		      					
			      			</Select>
			      		</FormItem></div>):(<Col offset={1}>
			      <div className={styles['paragraph']}>未设置对对碰<Link to={{ pathname: '/wall-details/function-mstching/index', query:{id: id, state: 'POP', wallName: this.context.location.query.wallName}}}> 去设置</Link></div>
		      </Col>)
		return(
			<div className={styles['panel-content-item']}>
				<div className={styles['shade']} hidden={bump.status != 0}></div>
				<div>
					<Row type="flex" justify="space-between" style={{zIndex: '9', position: 'relative', ...styleObj}}>
						<Col><IconFont type="icon-luck"/><span className={styles['title']}>对对碰</span>（快捷键：B）</Col>
						{switchStatus}
					</Row>
					{content}

					<div className={styles['paragraph']}>tips: 开始/停止对对碰,快捷键[空格]</div>
				</div>	
			</div>
		)
	}
}