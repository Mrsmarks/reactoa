import info from './info'
import msgReview from './msgReview'
import guest from './guest'
import photo from './photo'
import lottery from './lottery'
import vote from './vote'
import shakePrize from './shakePrize'
import shake from './shake'
import money from './money'
import mstching from './mstching'

export default {
    path: '/wall-details/function',
    getName: 'wallName',
    childRoutes: [{
        path: '/wall-details/function-info/index',
        name: '基本信息',
        component: info
    }, {
        path: '/wall-details/function-msgreview/index',
        name: '弹幕',
        component: msgReview
    }, {
        path: '/wall-details/function-guest/index',
        name: '嘉宾墙',
        component: guest
    }, {
        path: '/wall-details/function-photo/index',
        name: '图片墙',
        component: photo
    }, {
        path: '/wall-details/function-lottery/index',
        name: '抽奖',
        component: lottery
    }, {
        path: '/wall-details/function-vote/index',
        name: '投票',
        component: vote
    }, {
        path: '/wall-details/function-shake-prize/index',
        name: '摇大奖',
        component: shakePrize
    }, {
        path: '/wall-details/function-shake/index',
        name: '摇一摇',
        component: shake
    }, {
        path: '/wall-details/function-money/index',
        name: '数钱',
        component: money
    }, {
        path: '/wall-details/function-mstching/index',
        name: '对对碰',
        component: mstching
    }]
}
