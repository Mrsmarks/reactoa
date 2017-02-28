import Add from './add'
import Check from './check'
import List from './list'
import Update from './update'
export default {
    path: '/system/management/list(/:page)(/:name)(/:contact)',
    name: '企业管理',
    component: List,
    childRoutes: [{
        path: '/system/management/add',
        name: '添加',
        component: Add,
    },{
        path: '/system/management/update',
        name: '编辑',
        component: Update,
    },{
        path: '/system/management/check',
        name: '查看',
        component: Check,
    }]
}