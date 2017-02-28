import Entry from './entry'
import logRoutes from './log'
import userRoutes from './user'
const config = {
    root: {
        path: '/',
        name: '积分',
        component: Entry,
        childRoutes: [
            logRoutes,
            userRoutes
        ]
    },
    redirect: [{
        path: '/index',
        ignore: true,
        onEnter: (_, replaceState) => {
            replaceState('/integral/user/list')
        }
    }]
}
export default config