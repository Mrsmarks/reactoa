import List from './list'
import Auth from './auth'
export default {
    path: '/card/type/list',
    name: '贺卡类型',
    component: List,
    childRoutes: [{
        path: '/card/type/auth',
        name: '权限',
        component: Auth,
    }]
}