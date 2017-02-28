import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import autoBinding from '../autoBinding'
import Input from 'antd/lib/input'
export default class ManagePreviewComp extends React.Component {

    static propTypes = {
        onInputChange: PropTypes.func.isRequired
    }

    @autoBinding.bind(this, 'onInputChange')
    handleChange({ target: { value } }) {
        return value
    }

    render() {
        return(
            <div style={{ width: 320, broder: '1px solid red' }}>
                <Input onChange={::this.handleChange}/>
            </div>
        )
    }
}