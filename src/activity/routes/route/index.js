import list from './list'
import add from './add'
import edit from './edit'

export default {
    path: '/activity/route/list',
    name: '活动路由',
    component: list,
        childRoutes: [{
        path: '/activity/route/add',
        name: '新增',
        component: add
    },{
        path: '/activity/route/edit',
        name: '编辑',
        component: edit
    }]

}