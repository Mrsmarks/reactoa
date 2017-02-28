import list from './list'
import edit from './edit'
import add from './add'
import check from './check'

export default {
    path: '/card-voucher/route/index',
    name: '路由',
    component: list,
    childRoutes: [{
        path: '/card-voucher/route/edit',
        name: '编辑',
        component: edit
    },{
    	path: '/card-voucher/route/add',
    	name: '添加',
    	component: add
    },{
    	path: '/card-voucher/route/check',
    	name: '查看',
    	component: check
    }]
}