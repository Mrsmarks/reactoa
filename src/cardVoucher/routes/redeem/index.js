import list from './list'
import add from './add'
import edit from './edit'
import check from './check'

export default {
    path: '/card-voucher/redeem/index',
    name: '卡卷兑换码',
    component: list,
    childRoutes: [{
        path: '/card-voucher/redeem/add',
        name: '添加',
        component: add
    },{
        path: '/card-voucher/redeem/edit',
        name: '编辑',
        component: edit
    },{
        path: '/card-voucher/redeem/check',
        name: '查看',
        component: check
    }]
}