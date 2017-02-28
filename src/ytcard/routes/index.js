import logRoutes from './log'
import orderRoutes from './order'
import Entry from './entry'
const config = {
    root: {
        path: '/',
        name: '粤通卡',
        component: Entry,
        childRoutes: [
            logRoutes,
            orderRoutes
        ]
    },
    redirect: [{
        path: '/index',
        ignore: true,
        onEnter: (_, replaceState) => {
            replaceState('/ytcard/log/list')
        }
    }]
}

export default config
