import Add from './add'
import Edit from './edit'
import List from './list'
export default {
    path: '/card/setting/list',
    name: '贺卡主配置',
    component: List,
    childRoutes: [{
        path: '/card/setting/edit',
        name: '编辑',
        component: Edit,
    },{
        path: '/card/setting/add',
        name: '添加',
        component: Add,
    }]
}