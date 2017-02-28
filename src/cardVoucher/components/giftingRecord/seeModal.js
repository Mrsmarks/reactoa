import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import Form from 'antd/lib/form'
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import Col from 'antd/lib/col'
import Button from 'antd/lib/button'

const FormItem = Form.Item

@Form.create()
export default class MainModal extends React.Component{
    constructor(props, context) {
        super(props, context)
    }

    static propTypes = {
        info: PropTypes.object.isRequired,
    }

    handleCancel() {
        this.props.toggle(undefined, 'visible')
    }
    renderForm() {
         
        const { getFieldProps } = this.props.form
        const checkInfo = Immutable.fromJS(this.props.info)
        const formItemProps = {
            labelCol: { span: 8 },
            wrapperCol: { span:8 }
        }
        const cardidProps = getFieldProps('card_id', {
            initialValue: checkInfo.get('card_id')
        })
        const nameProps = getFieldProps('uid_name', {
            initialValue: checkInfo.get('uid_name')
        })              

        const user_card_codeProps = getFieldProps('user_card_code', {
            initialValue: checkInfo.get('user_card_code')
        })
        const friend_user_nameProps = getFieldProps('friend_user_name', {
            initialValue: checkInfo.get('friend_user_name')
        })
        const is_return_backProps = getFieldProps('is_return_back', {
            initialValue: checkInfo.get('is_return_back') === 1 ? '是' : '否'
        })
        const is_chat_roomProps = getFieldProps('is_recommend_by_friend', {
            initialValue: checkInfo.get('is_recommend_by_friend') === 1 ? '是' : '否'
        })

        return (
            <div>
                <Form horizontal style={{marginTop: 40 }}>
                    <FormItem
                        {...formItemProps}
                        label="卡券："
                    >
                        <Input  {...cardidProps} readOnly/>
                    </FormItem>
                    <FormItem
                        {...formItemProps}
                        label="用户名称："
                    >
                        <Input  {...nameProps} readOnly/>
                    </FormItem>
                    <FormItem
                        {...formItemProps}
                        label="code序列号："
                    >
                        <Input  {...user_card_codeProps} readOnly/>
                    </FormItem>
                    <FormItem
                        {...formItemProps}
                        label="接收卡券用户的openid："
                    >
                        <Input  {...friend_user_nameProps} readOnly/>
                    </FormItem>
                    <FormItem
                        {...formItemProps}
                        label="是否转赠退回："
                    >
                        <Input  {...is_return_backProps} readOnly/>
                    </FormItem>
                    <FormItem
                        {...formItemProps}
                        label="是否是群转赠："
                    >
                        <Input  {...is_chat_roomProps} readOnly/>
                    </FormItem>
                </Form>
            </div>
        )

    }

    render() {
        return(
            <Modal 
                title="查看"
                visible={this.props.visible}
                cancelText='返回'
                onCancel={::this.handleCancel}
                onOk={::this.handleCancel}
            >
            {this.renderForm()}
            </Modal>
        )
    }
}