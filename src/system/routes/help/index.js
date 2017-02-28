import Edit from './edit'
import List from './list'
export default {
    path: '/system/help/list',
    name: '帮助',
    component: List,
    childRoutes: [{
        path: '/system/help/edit',
        name: '添加帮助',
        component: Edit,
    }]
}