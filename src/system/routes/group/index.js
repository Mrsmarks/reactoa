import Add from './add'
import Edit from './edit'
import List from './list'
export default {
    path: '/system/group/list',
    name: '群组管理',
    component: List,
    childRoutes: [{
        path: '/system/group/add',
        name: '添加',
        component: Add,
    },{
        path: '/system/group/edit',
        name: '编辑',
        component: Edit,
    }]
}