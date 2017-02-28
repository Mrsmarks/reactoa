import styles from './crashPage.scss'
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

export default class CrashPage extends React.Component {
	static PropTypes = {
		crashMsg: PropTypes.string.isRequired
	}

	render() {
		return (
			<div className={styles.wrap}>
				<div className={styles.bg}></div>
				<p>{this.props.crashMsg || '系统异常，请联系管理员。'}</p>
			</div>
		)
	}
}
