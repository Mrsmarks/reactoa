import styles from './initLoading.scss'
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

import Spin from 'antd/lib/spin'

export default class InitLoading extends React.Component {
	static propsTypes = {
		ready: PropTypes.bool.isRequired
	}

	constructor(props) {
		super(props)
	}

	state = {
		hidden: false,
		ready: false,
		startTime: +new Date
	}

	ready() {
		this.setState({
			ready: true
		})
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.ready === true) {
			let max = process.env.NODE_ENV === 'development' ? 200 : 1500
			let dis = +new Date - this.state.startTime
			if (dis < max) {
				dis = max - dis
				setTimeout(() => {
					this.ready()
				}, dis)
			} else {
				this.ready()
			}
		}
	}

	whichTransitionEnd() {
		const transitions = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition'    : 'transitionend',
			'OTransition'      : 'oTransitionEnd otransitionend',
			'transition'       : 'transitionend'
		}
		const div = document.createElement('div')
		for(let t in transitions){
			if(div.style[t] !== undefined){
				return transitions[t]
			}
		}
	}

	componentDidMount() {
		const transitionend = this.whichTransitionEnd()

		ReactDOM.findDOMNode(this.refs.loading).addEventListener(transitionend, () => {
			this.setState({
				hidden: true
			})
		})
	}



	render() {
		return (
			<div hidden={this.state.hidden} ref="loading" className={[styles.loading, this.state.ready === true ? styles.zoomOut : ''].join(' ')}>
				<div className={styles.bg}></div>
			</div>
			
		)
	}

}