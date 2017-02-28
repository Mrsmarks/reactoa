import statistics from './statistics'
import prize from './prize'
import vote from './vote'
import shakePrize from './shakePrize'
import shake from './shake'
import money from './money'
import bump from './bump'

export default {
    path: '/wall-details/data',
    getName: 'wallName',
    childRoutes: [{
        path: '/wall-details/data-activity/index',
        name: '活动统计',
        component: statistics
    }, {
        path: '/wall-details/data-prize/index',
        name: '获奖情况',
        component: prize
    }, {
        path: '/wall-details/data-vote/index',
        name: '直播台',
        component: vote
    }, {
        path: '/wall-details/data-shake-prize/index',
        name: '虚拟角色',
        component: shakePrize
    }, {
        path: '/wall-details/data-shake/index',
        name: '敏感词设置',
        component: shake
    }, {
        path: '/wall-details/data-money/index',
        name: '数钱',
        component: money
    }, {
        path: '/wall-details/data-bump/index',
        name: '对对碰',
        component: bump
    }]
}
