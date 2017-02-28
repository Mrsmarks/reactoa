import React, { PropTypes } from 'react'

import Immutable from 'immutable'

export default function key(attrs) {

	return DecoratedComponent =>
	class KeyDecorator extends React.Component {

		constructor(props) {
			super(props)
			
			const ret = this.each(props)
			this.state = ret
			
		}

		static propTypes = {
			actions: PropTypes.object
		}

		each(props) {
			const ret = {}
			attrs.forEach((item, index) => {
				const list = props[item]
				
				if (!(list instanceof Immutable.List)) {
					throw new Error('@Key 对象必须为Immutable.List')
				}
				if (list.size) {
			
					ret[item] = list.map(item => item.set('key', item.get('id') || index))
				} else {
					ret[item] = Immutable.fromJS([])
				}
			})

			return ret
		}


		
		componentWillReceiveProps(nextProps) {
			const ret = this.each(nextProps)
			this.setState({...this.state, ...ret})
		}

		render () {
			const obj = {...this.props, ...this.state}
			return (
				<DecoratedComponent {...obj} />
			)
		}
	}
}
