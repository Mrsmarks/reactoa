import styles from './iconFont.scss'
import React, { PropTypes } from 'react'
import classnames from 'classnames'

export default class IconFont extends React.Component {
    static propTypes = {
        type: PropTypes.string.isRequired,
        title: PropTypes.string,
        onClick: PropTypes.func,
        style: PropTypes.object
    }

    static defaultProps = {
        onClick: function onClick() {},
        style: {
            fontSize: 13
        },
        title: ''
    }

    render() {
        return (
            <i 
                {...this.props}
                className={classnames(styles.iconfont, styles[this.props.type])}
            />
        )
    }
}