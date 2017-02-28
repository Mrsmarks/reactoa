import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { login } from '../actions'

import LoginComp from '../components/login'
import autoLoading from '../decorators/autoLoading'

/**
 * 登录－路由
 */


@connect(
    ({ application }) => ({ routes: application.get('routes') }),
    dispatch => ({
        actions: bindActionCreators({ login }, dispatch)
    })
)
export default class LoginCompRoute extends React.Component {
    state = {
        loading: false
    }

    constructor(props) {
        super(props)

    }

    @autoLoading
    login() {
        return this.props.actions.login(...arguments)
    }


    render() {
        return(
            <LoginComp 
                {...this.props}
                loading={this.state.loading}
                actions={{
                    login: ::this.login
                }}
            />
        )
    }
}