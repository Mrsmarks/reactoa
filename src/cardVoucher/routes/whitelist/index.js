import list from './list'
import add from './add'
import edit from './edit'
import check from './check'

export default {
    path: '/card-voucher/whitelist/index',
    name: '白名单',
    component: list,
    childRoutes: [{
        path: '/card-voucher/whitelist/add',
        name: '添加',
        component: add
    },{
        path: '/card-voucher/whitelist/edit',
        name: '编辑',
        component: edit
    },{
        path: '/card-voucher/whitelist/check',
        name: '查看',
        component: check
    }]
}