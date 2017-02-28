import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classnames from 'classnames'
import styles from 'wechatWall/components/wall-details/wrap.scss'
import PreviewButton from 'wechatWall/components/wall-details/previewButton'

import Form from 'antd/lib/form'
const FormItem = Form.Item
import Input from 'antd/lib/input'
import DatePicker from 'antd/lib/date-picker'
const RangePicker = DatePicker.RangePicker
import Button from 'antd/lib/button'
import Spin from 'antd/lib/spin'
import message from 'antd/lib/message'

import format from 'Application/utils/formatDate'
const formatType = 'yyyy-MM-dd hh:mm:ss'
/**
 * 微信墙－基本信息
 */
@Form.create()
export default class InfoComp extends React.Component {
	static propTypes = {
		info: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired,
		loading: PropTypes.bool.isRequired
	}

	saveInfo() {
		this.props.form.validateFields((errors, values) => {
			if (errors) {
				return
			}

			this.props.actions.editActivity({
				id: this.props.info.get('id'),
				activity_name: values.activity_name,
				start_time: format(values.date[0], formatType),
				end_time: format(values.date[1], formatType)
			}, 'update').then(response => {
				message.success(response.errormsg)
			})
		})
	}

	render() {
		const formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 20
			}
		}

		const { form: {getFieldProps}, info } = this.props
		
		const nameProps = getFieldProps('activity_name', {
			rules: [
				{ required: true, message: '请输入活动主题' }
			],
			initialValue: info.get('activity_name')
		})

		let dateValue = []
		const startTime = info.get('start_time')
		const endTime = info.get('end_time')
		if (startTime && endTime) {
			dateValue = [new Date(startTime * 1000), new Date(endTime * 1000)]
		}
		const dateProps = getFieldProps('date', {
			rules: [
				{ type: 'array', required: true, message: '请选择生效时间' }
			],
			initialValue: dateValue
		})

		return (
			<div>
				<PreviewButton action="message"/>
				<div className={classnames(styles.wrap, "pure-form")}>
					<Form horizontal >
						<FormItem
							label="活动主题："
							{...formItemLayout}
						>
							<Input {...nameProps}/>
						</FormItem>
						<FormItem
							label="大屏生效时间："
							{...formItemLayout}
						>
							<RangePicker showTime format="yyyy-MM-dd hh:mm:ss" {...dateProps}/>
						</FormItem>
						<FormItem
							{...formItemLayout}
						>
                            <span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</span>
							<Button type="primary" onClick={::this.saveInfo} loading={this.props.loading}>提交</Button>
						</FormItem>
					</Form>
				</div>
			</div>
			
		)
	}
}