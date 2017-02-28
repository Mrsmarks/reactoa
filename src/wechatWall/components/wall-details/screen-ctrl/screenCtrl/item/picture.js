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
import Radio from 'antd/lib/radio'
import Popup from '../popup/popup'
import IconFont from 'Application/components/iconFont'

const RadioGroup = Radio.Group
const FormItem = Form.Item

@Form.create()
export default class pictureComp extends React.Component {

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
			this.props.changeStatus({...values, status: state}, 'picture')
		})
	}

	render() {
		const picture = this.props.picture
		const { getFieldProps, getFieldsValue } = this.props.form
		const styleObj = picture.status == 0? {color: 'white'}: {}
		const switchStatus = !this.context.pending && picture.status != -1? <Col><Switch onChange={::this.changeStatus} checked={!!picture.status}></Switch></Col>: ''
		const content = picture.status != -1? (<Col offset={1}>
		      		<FormItem label="图片来源：">
		      			<RadioGroup {...getFieldProps('selected_id', {
		      				initialValue: picture.selected_id+'',
		      				onChange: ::this.changePopStatus
		      			})}>
			      			 <Radio key={1} value="1">上墙图片</Radio>
			      			 <Radio key={2} value="2">本地图片</Radio>
					    </RadioGroup>
		      		</FormItem>
	      		</Col>): (<Col offset={1}>
						      <div className={styles['paragraph']}>未设置照片墙<Link to={{ pathname: '/wall-details/function-photo/index', state:'POP', query:{id: id, wallName: this.context.location.query.wallName}}}> 去设置</Link></div>
					      </Col>)
		return(
			<div className={styles['panel-content-item']}>
				<div className={styles['shade']} hidden={picture.status != 0}></div>
	      		<Row type="flex" justify="space-between" style={{zIndex: '9', position: 'relative', ...styleObj}}>
	      			<Col><IconFont type="icon-picture"/><span className={styles['title']}>图片墙</span>（快捷键：P）</Col>
	      			{switchStatus}
	      		</Row>
      			<div>{content}</div>
      			<Popup
      				func={::this.changePopStatus} 
	      			popup={this.state.popup}
	      			params={getFieldsValue()}
	      			type="picture"
	      			prop={this.props}
      			/>
	      	</div>
		)
	}
}