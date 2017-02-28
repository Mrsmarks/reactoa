import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import ReplyEditComp from 'wechat/components/reply/check'

/**
 * 微信－回复－查看
 */
export default class EditRoute extends React.Component {
	static fillStore(redux, props) {

	}
	
	render() {
		return (
			<ReplyEditComp></ReplyEditComp>
		)
	}
}