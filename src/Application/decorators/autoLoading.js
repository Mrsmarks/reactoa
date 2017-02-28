import message from 'antd/lib/message'

export default function autoLoading() {
	let attr = ''
	let desc = null

	if (arguments.length === 4) {
		// case:
		// 		@autoLoading.bind(this, 'xxxLoading')
		attr = arguments[0]
		desc = arguments[3]
	} else {
		// 默认attr是loading
		// case: 
		// 		@autoLoading.bind(this)
		// 		@autoLoading
		attr = 'loading'
		desc = arguments[2]
	}

	const oldFunc = desc.value

	desc.value = function() {
		this.setState({
			[attr]: true
		})

		return oldFunc.bind(this)(...arguments).then(x => {
			this.setState({
				[attr]: false
			})
			return Promise.resolve(x)
		}).catch(content => {
			this.setState({
				[attr]: false
			})

			let msg = '操作失败'
			if (content instanceof Error) {
				msg = content.message
			} else if (content.err) {
				msg = content.err.errormsg
			}
			message.error(msg)
			
			if (process.env.NODE_ENV === 'development') {
				console.error(content)
			}

			return Promise.reject(content)

			
		})
	}

	return desc
}