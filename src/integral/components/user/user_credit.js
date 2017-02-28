import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import format from 'Application/utils/formatDate'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import DatePicker from 'antd/lib/date-picker'

const FormItem = Form.Item
const Option = Select.Option

@Key(['singer_record'])
@Form.create()
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
	}

	static propTypes= {
		singer_record: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	renderTable() {
		const dataSource = this.props.singer_record.toJS()	
		const total = this.props.total
		const columns = [{
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			render(type) {
				const list = {'1': '新用户', '2': '活动', '3': '兑换', '4': '绑卡', '5': '签到'}
				return(
					<span>{list[type]}</span>
				)
			}
		}, {
			title: '积分',
			dataIndex: 'credit',
			key: 'credit',
		}, {
			title: '备注',
			dataIndex: 'remark',
			key: 'remark',
		}, {
			title: '时间',
			dataIndex: 'create_time',
			key: 'create_time',
			render(time) {
				return(
					<span>{format(time)}</span>
				)
			}
		}]
		
		return (
			<div>
				<div style={{marginBottom: 10,fontWeight: 'bold',textAlign:'left'}}>共有积分：<i style={{fontSize: 15, color:'#2db7f5'}}>{total}</i> 分</div>
				<Table 
					dataSource={dataSource}
					columns={columns}
					pagination= {false}
					loading={this.props.loading}
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