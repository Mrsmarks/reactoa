import Entry from './entry'
import allRoutes from './all'
import endRoutes from './end'
import startRoutes from './start'
import waitRoutes from './wait'
import settingRoutes from './setting'

export default {
    path: '/wall',
    component: Entry,
    childRoutes: [
        allRoutes,
        endRoutes,
        startRoutes,
        waitRoutes,
        settingRoutes
    ]
}
