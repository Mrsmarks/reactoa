import manage from './manage'

export default {
    path: '/wall-details/sign',
    getName: 'wallName',
    childRoutes: [{
        path: '/wall-details/sign/manage',
        name: '签到管理',
        component: manage
    }]
}
