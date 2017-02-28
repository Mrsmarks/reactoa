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
        const is_give_by_friendProps = getFieldProps('is_give_by_friend', {
            initialValue: checkInfo.get('is_give_by_friend') === 1 ? '是' : '否'
        })
        const receive_outer_idProps = getFieldProps('receive_outer_id', {
            initialValue: checkInfo.get('receive_outer_id')
        })
        const receive_outer_strProps = getFieldProps('receive_outer_str', {
            initialValue: checkInfo.get('receive_outer_str')
        })
        const uis_restore_member_cardProps = getFieldProps('uis_restore_member_card', {
            initialValue: checkInfo.get('uis_restore_member_card') === 1 ? '是' : '否'
        })
        const is_recommend_by_friendProps = getFieldProps('is_recommend_by_friend', {
            initialValue: checkInfo.get('is_recommend_by_friend') === 1 ? '是' : '否'
        })
        const cards_statusProps = getFieldProps('cards_status', {
            initialValue: checkInfo.get('cards_status')
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
                        label="是否为转赠领取："
                    >
                        <Input  {...is_give_by_friendProps} readOnly/>
                    </FormItem>
                    <FormItem
                        {...formItemProps}
                        label="领取场景值："
                    >
                        <Input  {...receive_outer_idProps} readOnly/>
                    </FormItem>
                    <FormItem
                        {...formItemProps}
                        label="领取场景值："
                    >
                        <Input  {...receive_outer_strProps} readOnly/>
                    </FormItem>
                    <FormItem
                        {...formItemProps}
                        label="删除会员卡后可是否重新找回:"
                    >
                        <Input  {...uis_restore_member_cardProps} readOnly/>
                    </FormItem>
                    <FormItem
                        {...formItemProps}
                        label="是否好友推荐："
                    >
                        <Input  {...is_recommend_by_friendProps} readOnly/>
                    </FormItem>
                    <FormItem
                        {...formItemProps}
                        label="事件状态："
                    >
                        <Input  {...cards_statusProps} readOnly/>
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