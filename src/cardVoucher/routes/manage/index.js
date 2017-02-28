import list from './list'
import edit from './edit'

export default {
    path: '/card-voucher/manage/index',
    name: '卡券管理',
    component: list,
    childRoutes: [{
        path: '/card-voucher/manage/edit',
        getName: 'routeName',
        component: edit
    }]
}
