import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import MenuEditComp from 'system/components/menu/edit'
// import { fetchCustomMenuRuleList } from 'system/actions'

export default class MenuEditCompRoute extends React.Component{
	render() {
		return (
			<MenuEditComp></MenuEditComp>
		)
	}
}