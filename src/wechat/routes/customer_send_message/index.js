import list from './list'
import edit from './edit'

export default {
    path: '/wechat/customer-send-message/list',
    name: '客服发送消息',
    component: list,
    childRoutes: [{
        path: '/wechat/customer-send-message/edit',
        name: '编辑',
        component: edit
    }]
}
