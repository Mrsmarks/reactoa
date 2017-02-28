import Edit from './edit'
import List from './list'
import editGroup from './edit_group'
export default {
    path: '/system/department/list',
    name: '部门管理',
    component: List,
    childRoutes: [{
        path: '/system/department/edit',
        name: '编辑',
        component: Edit,
    },{
        path: '/system/department/group-auth',
        name: '群组权限',
        component: editGroup,
    }]
}