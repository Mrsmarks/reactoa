import React, { PropTypes } from 'react'
import { Link } from 'react-router' 
import Immutable from 'immutable'
import classnames from 'classnames'
import styles from '../index.scss'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import Switch from 'antd/lib/switch'
import IconFont from 'Application/components/iconFont'

export default class CustomerComp extends React.Component {

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		getSid: PropTypes.func.isRequired,
        pending: PropTypes.bool.isRequired
	}

     changeStatus(status) {
		const state = Number(status)
		this.props.changeStatus({status: state}, 'custom')
	}


	render() {
		const custom = this.props.custom
		const id = this.context.location.query.id
		const styleObj = custom.status == 0? {color: 'white'}: {}
		const switchStatus = !this.context.pending && custom.status != -1? <Col><Switch onChange={::this.changeStatus} checked={!!custom.status}></Switch></Col>: ''
		const content = custom.status != -1? 
		    '':(<Col offset={1}>
			      <div className={styles['paragraph']}>未设置嘉宾墙<Link to={{ pathname: '/wall-details/function-guest/index', query:{id: id, state: 'POP', wallName: this.context.location.query.wallName}}}> 去设置</Link></div>
		      </Col>)
		return(
			<div className={styles['panel-content-item']}>
				<div className={styles['shade']} hidden={custom.status != 0}></div>
				<div>
					<Row type="flex" justify="space-between" style={{zIndex: '9', position: 'relative', ...styleObj}}>
		      			<Col><IconFont type="icon-user"/><span className={styles['title']}>嘉宾墙</span>（快捷键：U）</Col>
		      			{switchStatus}
		      		</Row>
		      		{content}
		      		<div className={styles['paragraph']}>tips: 展开/收起详情快捷键[空格],翻页快捷键</div>
				</div>
	      	</div>
		)
	}
}