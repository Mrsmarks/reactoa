import messageRoutes from './message'
import orderRoutes from './order'
import requestRoutes from './request'
import ticketRoutes from './ticket'
import Entry from './entry'

const config = {
    root: {
        path: '/',
        name: '宜停车',
        component: Entry,
        childRoutes: [
            messageRoutes,
            orderRoutes,
            requestRoutes,
            ticketRoutes
        ]
    },
    redirect: [{
        path: '/index',
        ignore: true,
        onEnter: (_, replaceState) => {
            replaceState('/park/message/list')
        }
    }]
}

export default config
