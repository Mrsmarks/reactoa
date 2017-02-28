import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import classnames from 'classnames'
import styles from './index.scss'
import Form from 'antd/lib/form'
import Row from 'antd/lib/row'
import Col from 'antd/lib/col'
import Icon from 'antd/lib/icon'
import Popover from 'antd/lib/popover'
import IconFont from 'Application/components/iconFont'
import message from 'antd/lib/message'
import Spin from 'antd/lib/spin'
import QRCode from 'qrcode.react'

import BumpItem from './item/bump'
import CustomerItem from './item/customer'
import PictureItem from './item/picture'
import SignItem from './item/sign'
import WallItem from './item/wall'
import ShakeItem from './item/shake'
import PrizeItem from './item/prize'
import VoteItem from './item/vote'
import MoneyItem from './item/money'
import ShakePrize from './item/shakePrize'

import qrcode from 'Application/resources/qrcode.png'
const FormItem = Form.Item

/**
 * 微信墙－屏幕控制-大屏幕控制
 */
@Form.create()
export default class ScreenComp extends React.Component {

    constructor(props, context) {
        super(props, context)
        this.changeStatus = this.changeStatus.bind(this)
    }

    static propTypes = {
        content: PropTypes.instanceOf(Immutable.Map).isRequired,
        actions: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        updateLoading: PropTypes.bool.isRequired,
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        getSid: PropTypes.func.isRequired
    }

    static childContextTypes = {
        pending: PropTypes.bool.isRequired
    }

    getChildContext() {
        return{
            pending: this.props.pending
        }
    }

    changeStatus(data, type, cb) {
        const sid = this.context.getSid()
        this.props.actions.updateWallScreenCtrl(sid, data, type).then(resolve => {
            message.success(resolve.errormsg)
            if(!cb){
                return
            } 
            cb() 
        })
    }


    renderPanel() {
        const dataSource = this.props.content.toJS()
        const content = (
            <div className={styles['qrcode-box']}>
                <QRCode size={250} value={dataSource.qrcode_img} />
            </div>
        )
        return (
            <div>
                <div className={classnames(styles['panel-head'], styles['panel-head-phone'])}>
                    <Row>
                        <Col span={8}>
                            <div className={styles['panel-head-left'], styles['title']}>手机控制台
                                <Popover placement="bottomLeft" title="请用微信扫码打开" content={content}>
                                    <img className={styles['icon']} src={qrcode}/>
                                </Popover>
                            </div>
                        </Col>
                        <Col span={8} offset={8}>
                            <div className={classnames(styles['panel-head-right'], styles['title'])}>请用微信扫码打开，可用手机控制大屏幕</div>
                        </Col>
                    </Row>
                </div>
                <div className={classnames(styles['panel-head'], styles['panel-head-wall'])}>
                    <Row>
                        <div className={styles['panel-head-left'], styles['title']}>微信墙活动</div>
                    </Row>
                </div>
                <div className={styles['panel-content']}>
                    <Spin spinning={this.props.pending||this.props.updateLoading}>
                        <Form inline>
                            <Row gutter={24}>
                            {/*左侧*/}
                              <Col span={12}>

                                <WallItem 
                                    wall={dataSource.wall}
                                    changeStatus={this.changeStatus}
                                />
                       
                                <SignItem 
                                    sign={dataSource.sign}
                                    changeStatus={this.changeStatus}
                                />

                                <PictureItem 
                                    picture={dataSource.picture}
                                    changeStatus={this.changeStatus}
                                />

                                <CustomerItem 
                                    custom={dataSource.custom}
                                    changeStatus={this.changeStatus}
                                />

                                <BumpItem 
                                    bump={dataSource.bump}
                                    changeStatus={this.changeStatus}
                                />

                              </Col>
                            {/*右侧*/}
                              <Col span={12} >
                                <ShakeItem 
                                    shake={dataSource.shake}
                                    changeStatus={this.changeStatus}
                                />

                                <PrizeItem 
                                    prize={dataSource.prize}
                                    changeStatus={this.changeStatus}
                                    freshPeopleNum={this.props.actions.freshPeopleNum}
                                />

                                <VoteItem 
                                    vote={dataSource.vote}
                                    changeStatus={this.changeStatus}
                                />

                                <MoneyItem 
                                    money={dataSource.money}
                                    changeStatus={this.changeStatus}
                                />
                              
                                <ShakePrize 
                                    shakePrize={dataSource.shakePrize}
                                    changeStatus={this.changeStatus}
                                />
                              </Col>
                              </Row>
                        </Form>
                    </Spin>
                </div>
            </div>
            
        )
    }

    render() {
        return(
            <div>
                {this.renderPanel()}
            </div>
        )
    }
}