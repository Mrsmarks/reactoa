import list from './list'
import add from './add'
import edit from './edit'

export default {
    path: '/activity/prize/list',
    name: '活动奖品',
    component: list,
    childRoutes: [{
        path: '/activity/prize/add',
        name: '新增',
        component: add
    },{
        path: '/activity/prize/edit',
        name: '编辑',
        component: edit
    }]
}