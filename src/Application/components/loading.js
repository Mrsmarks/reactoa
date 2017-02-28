import {is} from 'immutable'
import React, {propTypes} from 'react'

import Spin from 'antd/lib/spin'

export default class Loading extends React.Component {
	constructor(props) {
		super(props)
	}

	//当props update重新渲染组件
	shouldComponentUpdate (nextProps = {}) {
	  const thisProps = this.props || {}

	  if (Object.keys(thisProps).length !== Object.keys(nextProps).length) {
	    return true;
	  }

	  for (const key in nextProps) {
	    if (thisProps[key] !== nextProps[key] || !is(thisProps[key], nextProps[key])) {
	      return true;
	    }
	  }
	  return false;
	}

	render() {
		return (
			<Spin spinning={this.props.loading}>
				{this.props.children}
			</Spin>
		)
	}

}