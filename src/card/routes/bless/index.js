import User from './list'
import Auth from './auth'
export default {
    path: '/card/bless/list',
    name: '贺卡祝福语',
    component: User,
    childRoutes: [{
        path: '/card/bless/auth',
        name: '权限配置',
        component: Auth,
    }]
}