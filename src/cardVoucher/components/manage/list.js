import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Form from 'antd/lib/form'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Popconfirm from 'antd/lib/popconfirm'
import Table from 'antd/lib/table'
import message from 'antd/lib/message'
import Modal from 'antd/lib/modal'

import Key from 'Application/decorators/key'

// @Key(['content'])
@Form.create()
export default class ManageComp extends React.Component {

    state = {
        cardTypesVisible: false
    }

    shownCardTypes() {
        this.setState({
            cardTypesVisible: true
        })
    }

    hideCardTypes() {
        this.setState({
            cardTypesVisible: false
        })
    }

    renderToolbar() {
        return (
            <div className="toolbar">
                <Button type="primary" onClick={::this.shownCardTypes}>
                    <Icon type="plus"/>
                    添加
                </Button>   
            </div>  
        )
    }

    renderCardTypesModal() {
        return (
            <Modal 
                title="创建优惠券"
                visible={this.state.cardTypesVisible}
                onCancel={::this.hideCardTypes}
                // onOk={::this.handleSubmit}
            >
                123
            </Modal>
        )
    }
    
    render() {
        return(
            <div>
                { this.renderToolbar() }
                { this.renderCardTypesModal() }
            </div>
        )
    }
}