import list from './list'
import setting_add from './setting_add'
import setting_edit from './setting_edit'
import setting_list from './setting_list'

export default {
    path: '/activity/management/list',
    name: '活动管理',
    component: list,
    childRoutes: [{
        path: '/activity/setting/list',
        name: '查看配置',
        component: setting_list,
        childRoutes:[{
            path: '/activity/setting/add',
            name: '添加配置',
            component: setting_add
        },{
            path: '/activity/setting/edit',
            name: '编辑配置',
            component: setting_edit
        }]
    }]
}