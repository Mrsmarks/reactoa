import React, { PropTypes } from 'react'

import Immutable from 'immutable'
import ErrorComp from '../components/Error'

export default function onError(callbackName) {

	return DecoratedComponent =>
	class OnErrorDecorator extends React.Component {

		constructor(props) {
			super(props)
		}

		static propTypes = {
			error: PropTypes.object,
			loading: PropTypes.bool
		}

		handleClick() {
			const { request } = this.props.error
			// 回调action的参数必须以object接受
			// 
			// 错误
			// function act(page, psize) {
			// 
			// }
			// 
			// 正确
			// function act({ page, psize }) {
			// 
			// }
			// 
			if (request['per-page']) {
				request.psize = request['per-page']
				delete request['per-page']
			}
			this.props.actions[callbackName](request)
		}

		
		render () {
			const error = this.props.error
			if (Object.keys(error).length) {
				return (
					<ErrorComp 
						callback={::this.handleClick}
						loading={this.props.loading}
						errormsg={error.errormsg}
					/>
				)
			} else {
				return (
					<DecoratedComponent {...this.props}/>
				)
			}
		}
	}
}
