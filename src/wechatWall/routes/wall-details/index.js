import Entry from './entry'
import functionRoutes from './function'
import signRoutes from './sign'
import screenCtrlRoutes from './screen-ctrl'
import dataRoutes from './data'

export default {
    path: '/wall-details',
    // name: '微信墙',
    component: Entry,
    childRoutes: [
        functionRoutes,
        signRoutes,
        screenCtrlRoutes,
        dataRoutes
    ]
}
