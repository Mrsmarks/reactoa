import layout from './layout'
import theme from './theme'
import screen from './animation'
import screenAdd from './animation/add'
import screenEdit from './animation/edit'
import template from './template'

export default {
    path: '/wall/activity-setting',
    name: '微信墙配置',
    getName: "wallName",
    childRoutes: [{
        path: '/wall/activity-layout/index',
        name: '微信墙布局',
        component: layout
    }, {
        path: '/wall/activity-theme/index',
        name: '微信墙主题',
        component: theme
    }, {
        path: '/wall/activity-screen/index',
        name: '微信墙大屏幕',
        component: screen,
        childRoutes: [{
            path: '/wall/activity-screen/add',
            name: '添加',
            component: screenAdd
        }, {
            path: '/wall/activity-screen/edit',
            name: '详情',
            component: screenEdit
        }]
    }, {
        path: '/wall/activity-template/index',
        name: '微信墙活动模板',
        component: template
    }]
}