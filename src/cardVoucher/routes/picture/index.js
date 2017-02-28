import list from './list'
import edit from './edit'
import add from './add'
import check from './check'

export default {
    path: '/card-voucher/picture/index',
    name: '图片库',
    component: list,
    childRoutes: [{
        path: '/card-voucher/picture/edit',
        name: '编辑',
        component: edit
    },{
    	path: '/card-voucher/picture/add',
    	name: '添加',
    	component: add
    },{
    	path: '/card-voucher/picture/check',
    	name: '查看',
    	component: check
    }]
}