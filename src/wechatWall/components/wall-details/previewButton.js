
import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Button from 'antd/lib/button'
import Tooltip from 'antd/lib/tooltip'
import IconFont from 'Application/components/iconFont'
import { bigScreenUrl } from 'wechatWall/constants'
import { connect } from 'react-redux'
@connect(({ application }) => ({
    frontedDomain: application.getIn(['user', 'fronted_domain'])
}))
export default class PreviewButton extends React.Component {
    static propTypes = {
        action: PropTypes.string.isRequired
    }

    static contextTypes = {
        location: PropTypes.object.isRequired
    }

	render() {
		return (
			<a
                href={`${this.props.frontedDomain}${bigScreenUrl}?action=${this.props.action}&uniqueid=${this.context.location.query.uniqueId}`}
                style={{ position: 'absolute', right: 16, top: 16 }}
            >
				<Tooltip placement="left" title="进入大屏幕">
					<span>
						<IconFont type="icon-screen" cursor />
					</span>
				</Tooltip>
			</a>
		)
	}
}