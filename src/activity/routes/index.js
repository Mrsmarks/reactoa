import blackRoutes from './black'
import codeRoutes from './code'
import managementRoutes from './management'
import prizeRoutes from './prize'
import prize_ruleRoutes from './prize_rule'
import routeRoutes from './route'
import ruleRoutes from './rule'
import share_logRoutes from './share_log'
import stats_logRoutes from './stats_log'
import stats_numRoutes from './stats_num'
import supportRoutes from './support'
import templateRoutes from './template'
import user_prizeRoutes from './user_prize'
import whiteRoutes from './white'

import Entry from './entry'

const config = {
    root: {
        path: '/',
        name: '活动',
        component: Entry,
        childRoutes: [
            blackRoutes,
            codeRoutes,
            managementRoutes,
            prizeRoutes,
            prize_ruleRoutes,
            routeRoutes,
            ruleRoutes,
            share_logRoutes,
            stats_logRoutes,
            stats_numRoutes,
            supportRoutes,
            templateRoutes,
            user_prizeRoutes,
            whiteRoutes
        ]
    },
    redirect: [{
        path: '/index',
        ignore: true,
        onEnter: (_, replaceState) => {
            replaceState('/activity/management/list')
        }
    }]
}

export default config