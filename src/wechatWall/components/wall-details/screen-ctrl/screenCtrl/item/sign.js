import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classnames from 'classnames'
import styles from '../index.scss'
import Row from 'antd/lib/row'
import { Link } from 'react-router'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import Switch from 'antd/lib/switch'
import IconFont from 'Application/components/iconFont'

export default class SignComp extends React.Component {

	static contextTypes = {
        pending: PropTypes.bool.isRequired
    }

     changeStatus(status) {
		const state = Number(status)
		this.props.changeStatus({status: state}, 'sign')
	}

	render() {
		const sign = this.props.sign
		const styleObj = sign.status == 0? {color: 'white'}: {}
		const switchStatus = !this.context.pending && sign.status != -1? <Col><Switch  onChange={::this.changeStatus} checked={!!sign.status}></Switch></Col>: ''
		return(
			<div className={styles['panel-content-item']}>
				<div className={styles['shade']} hidden={sign.status != 0}></div>
				<div>
					<Row type="flex" justify="space-between" style={{zIndex: '9', position: 'relative', ...styleObj}}>
						<Col><IconFont type="icon-luck"/><span className={styles['title']}>签到墙</span>（快捷键：Q）</Col>
						{switchStatus}
					</Row>
				</div>
			</div>
		)
	}
}