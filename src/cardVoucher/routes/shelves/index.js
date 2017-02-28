import list from './list'
import edit from './edit'
import add from './add'
import check from './check'

export default {
    path: '/card-voucher/shelves/index',
    name: '卡券二维码',
    component: list,
    childRoutes: [{
        path: '/card-voucher/shelves/edit',
        name: '编辑',
        component: edit
    },{
        path: '/card-voucher/shelves/add',
        name: '添加',
        component: add
    },{
        path: '/card-voucher/shelves/check',
        name: '查看',
        component: check
    }]
}