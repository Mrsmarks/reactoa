import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'

@connect(({ application }) => ({
	auth: application.get('auth'),
	user: application.get('user')
}))
export default class Auth extends React.Component {
	// static contextTypes = {
	// 	auth: PropTypes.object.isRequired
	// }

	static propTypes = {
		children: PropTypes.any.isRequired,

		user: PropTypes.instanceOf(Immutable.Map).isRequired,
		auth: PropTypes.object.isRequired,

		type: PropTypes.array.isRequired,

		// 一般在｀删除｀，`更新`操作的时候才需要传入
		dpid: PropTypes.any,
		nid: PropTypes.any,
		cpid: PropTypes.any,
		uid: PropTypes.any

	}

	hasAuth() {
		return this.props.type.some(item => this.props.auth[item] === null)
	}

	render() {
		const {
			type,
			dpid,
			nid,
			cpid,
			uid,
			user
		} = this.props

		// 有相关操作权限
		if (this.hasAuth()) {
			return this.props.children

			if (dpid && nid && cpid && uid) {
				if (
					user.get('level') == 1 ||
					(user.get('level') == 2 && dpid == user.get('dpid')) ||
					(user.get('level') == 3 && nid == user.get('nid') && this.props.auth[`${type}_free`]) ||
					user.get('uid') == uid
				) {
					return this.props.children	
				}
			} else {
				return this.props.children
			}

			

			
			// // 判断是否同一部门
			// if (dpid === undefined) {
			// 	return this.props.children
			// }
			
			// if (user.get('uid') == uid ) {
			// 	return this.props.children
			// }

			// if (user.get('dpid') == dpid && user.get('nid') == nid && user.get('cpid') == cpid && this.props.auth[`${type}_free`]) {
			// 	return this.props.children
			// }
				
		}

		return null
	}
}

























