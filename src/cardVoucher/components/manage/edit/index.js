import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import styles from './index.scss'
import Steps from 'antd/lib/steps'
import Button from 'antd/lib/button'
const Step = Steps.Step
import CouponInfo from './couponInfo'
import CouponSetting from './couponSetting'

export default class ManageComp extends React.Component {

    state = {
        scene: 'info',
        current: 0
    }

    render() {
        return(
            <div>
                <div className={styles.steps}>
                    <Steps current={this.state.current}>
                        <Step title="填写优惠券信息" />
                        <Step title="功能设置" />
                    </Steps>
                </div>
                {{
                    info: (
                        <span>
                            <CouponInfo />
                            <Button onClick={() => this.setState({ scene: 'setting', current: 1 })}>下一步</Button>
                        </span>
                    ),
                    setting: (
                        <span>
                            <CouponSetting />
                            <Button onClick={() => this.setState({ scene: 'info', current: 0 })}>上一步</Button>
                        </span>
                    )
                }[this.state.scene]}
            </div>
        )
    }
}