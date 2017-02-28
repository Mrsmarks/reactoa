import screenCtrl from './screenCtrl'
import messageAduit from './messageAduit'
import live from './live'
import virtualRole from './virtualRole'
import word from './word'

export default {
    path: '/wall-details/screen-ctrl',
    getName: 'wallName',
    childRoutes: [{
        path: '/wall-details/screen-ctrl-big/index',
        name: '大屏幕控制',
        component: screenCtrl
    }, {
        path: '/wall-details/screen-ctrl-message/index(/:key)',
        name: '消息审核',
        component: messageAduit
    }, {
        path: '/wall-details/screen-ctrl-live/index',
        name: '直播台',
        component: live
    }, {
        path: '/wall-details/screen-ctrl-virtual/index',
        name: '虚拟角色',
        component: virtualRole
    }, {
        path: '/wall-details/screen-ctrl-word/index',
        name: '敏感词设置',
        component: word
    }]
}
