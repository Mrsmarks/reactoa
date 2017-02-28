import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classnames from 'classnames'
import styles from 'wechatWall/components/wall-details/wrap.scss'
import PreviewButton from 'wechatWall/components/wall-details/previewButton'

import Form from 'antd/lib/form'
const FormItem = Form.Item
import Input from 'antd/lib/input'
import Switch from 'antd/lib/switch'
import Radio from 'antd/lib/radio'
const RadioGroup = Radio.Group
import Checkbox from 'antd/lib/checkbox'
const CheckboxGroup = Checkbox.Group
import Slider from 'antd/lib/slider'
import Button from 'antd/lib/button'
import Col from 'antd/lib/col'

import message from 'antd/lib/message'

/**
 * 微信墙－弹幕
 */
@Form.create()
export default class MsgReviewComp extends React.Component {
	static propTypes = {
		info: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired,

		loading: PropTypes.bool.isRequired
	}

	static contextTypes = {
		location: PropTypes.object.isRequired
	}

	saveMsgreview() {
		this.props.form.validateFields((errors, values) => {

			const id = this.context.location.query.id
			values.loop = +values.loop
			this.props.actions.updateMsgreview(values, id).then(response => {
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

		const fontMarks = {
			24: '默认',
			36: '中',
			48: '大'
		}
		const speedMarks = {
			'0': '默认',
			'50': '中',
			'100': '快'
		}

		const positionOptions = [
			{ label: '屏幕顶部', value: 'top' },
			{ label: '屏幕中部', value: 'middle' },
			{ label: '屏幕底部', value: 'bottom' }
		]

		const { getFieldProps } = this.props.form
		const loopProps = getFieldProps('loop', {
			valuePropName: 'checked',
			initialValue: this.props.info.get('loop') == 1
		})
		const styleProps = getFieldProps('style', {
			initialValue: this.props.info.get('style')
		})
		const positionProps = getFieldProps('position', {
			initialValue: this.props.info.get('position').toJS()
		})
        const fontSizeValue = this.props.info.get('font_size')
		const fontSizeProps = getFieldProps('font_size', {
			initialValue: fontSizeValue ? +fontSizeValue : undefined
		})

        const speedValue = this.props.info.get('speed')
		const speedProps = getFieldProps('speed', {
			initialValue: speedValue ? +speedValue : undefined
		})
		return (
			<div>
				<PreviewButton action="danmu"/>
				<div className={classnames(styles.wrap, "pure-form")}>
					<Form horizontal >
						<FormItem
							label="弹幕循环："
							{...formItemLayout}
						>
							<Switch 
								checkedChildren="开" 
								unCheckedChildren="关" 
								
								{...loopProps}/>
						</FormItem>
						<FormItem
							label="弹幕样式："
							{...formItemLayout}
						>
							<RadioGroup {...styleProps}>
								<Radio key="1" value="simple">婉约</Radio>
								<Radio key="2" value="rough">粗犷</Radio>
							</RadioGroup>
						</FormItem>
						<FormItem
							label="显示位置："
							{...formItemLayout}
						>
							<CheckboxGroup options={positionOptions} {...positionProps}/>
						</FormItem>
						<FormItem
							label="显示字号："
							{...formItemLayout}
						>
							<Slider {...fontSizeProps} marks={fontMarks} step={12} min={24} max={48} tipFormatter={null}/>
						</FormItem>
						<FormItem
							label="移动速度："
							{...formItemLayout}
						>
							<Slider {...speedProps} marks={speedMarks} min={.2} max={.4} step={.1} tipFormatter={null}/>
						</FormItem>
						<FormItem
							label=" "
							{...formItemLayout}
						>
							<Button type="primary" onClick={::this.saveMsgreview} loading={this.props.loading}>保存</Button>
						</FormItem>
						
					</Form>
					
				</div>
			</div>
			
		)
	}
}