import Edit from './edit'
import List from './list'
export default {
    path: '/system/auth/list',
    name: '权限包管理',
    component: List,
    childRoutes: [{
        path: '/system/auth/edit',
        name: '添加',
        component: Edit,
    }]
}