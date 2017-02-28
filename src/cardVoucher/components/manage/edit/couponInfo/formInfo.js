import React, { PropTypes } from 'react'
import Immutable from 'immutable'
export default class ManageFormInfoComp extends React.Component {

    render() {
        return(
            <div style={{ width: 320, broder: '1px solid red' }}>
                {this.props.value}
            </div>
        )
    }
}