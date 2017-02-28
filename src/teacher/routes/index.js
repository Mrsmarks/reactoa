import messageRoutes from './message'
import userRoutes from './user'
import Entry from './entry'

const config = {
    root: {
        path: '/',
        name: '尊师卡',
        component: Entry,
        childRoutes: [
            messageRoutes,
            userRoutes
        ]
    },
    redirect: [{
        path: '/index',
        ignore: true,
        onEnter: (_, replaceState) => {
            replaceState('/teacher/user/list')
        }
    }]
}

export default config
