import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import HelpEditComp from 'system/components/help/edit'
// import { fetchCustomMenuRuleList } from 'system/actions'

export default class HelpEditCompRoute extends React.Component{
	render() {
		return (
			<HelpEditComp></HelpEditComp>
		)
	}
}