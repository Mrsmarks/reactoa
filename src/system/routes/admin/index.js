import Edit from './edit'
import List from './list'
export default {
    path: '/system/admin/list',
    name: '管理员',
    component: List,
    childRoutes: [{
        path: '/system/admin/edit',
        name: '群组权限',
        component: Edit,
    }]
}