import WallRoutes from './wall'
import WallDetailsRoutes from './wall-details'

const config = {
    root: {
        path: '/',
        name: '微信墙',
        childRoutes: [
            WallRoutes,
            WallDetailsRoutes
        ]
    },
    redirect: [{
        path: '/index',
        ignore: true,
        onEnter: (_, replaceState) => {
            replaceState('/wall/activity-all/index')
        }
    }]
}

export default config
