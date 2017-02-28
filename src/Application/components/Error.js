import React, { PropTypes } from 'react'
import styles from './error.scss'
import Button from 'antd/lib/button'
const img = require('../resources/Bug-50.png')

export default class Error extends React.Component {
	static propTypes = {
		callback: PropTypes.func.isRequired,
		errormsg: PropTypes.string,
		loading: PropTypes.bool
	}


	handleClick() {
		this.props.callback && this.props.callback()
	}

	render() {
		const errormsg = this.props.errormsg || '系统异常，请联系管理员。'
		return (
			<div className={styles.error}>
				<img className={styles.img} src={img}/>
				<div>{errormsg}</div>
				<Button type="primary" loading={this.props.loading} onClick={::this.handleClick} className={styles.btn}>重新加载</Button>
			</div>
		)
	}
}