import Add from './add'
import Auth from './auth'
import Edit from './edit'
import List from './list'
export default {
    path: '/card/example/list',
    name: '贺卡实例',
    component: List,
    childRoutes: [{
        path: '/card/example/edit',
        name: '编辑',
        component: Edit,
    },{
        path: '/card/example/add',
        name: '添加',
        component: Add,
    },{
        path: '/card/example/auth',
        name: '权限配置',
        component: Auth,
    }]
}