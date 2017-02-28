import styles from './popup.scss'
import Button from 'antd/lib/button'
import React, { PropTypes } from 'react'
import Immutable from 'immutable'
export default class PopupComp extends React.Component {

	constructor(props, context) {
		super(props, context)
	}

	static propTypes= {
		popup: PropTypes.bool.isRequired,
		func: PropTypes.func.isRequired,
	}

	handleCancel() {
		this.props.func(false)
	}

	handleSubmit() {
		const prop = this.props.prop
		const params = this.props.params
		const type = this.props.type
		prop.changeStatus({...params, status: +prop[type].status}, type, () => {
			this.handleCancel()
		})
	}

	render() {
		var content = this.props.popup? (
			<div className={styles['popup']}>
				<div><Button  size="small" onClick={::this.handleCancel}>取消</Button></div>
				<div><Button type="primary" onClick={::this.handleSubmit} size="small">保存</Button></div>
			</div>
		): ''
		return(
			<div>{content}</div>
		)
	}
}
