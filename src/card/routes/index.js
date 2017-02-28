import Entry from './entry'
import blessRoutes from './bless'
import exampleRoutes from './example'
import listRoutes from './list'
import settingRoutes from './setting'
import shareRoutes from './share'
import templateRoutes from './template'
import typeRoutes from './type'
const config = {
    root: {
        path: '/',
        component: Entry,
        childRoutes: [
            blessRoutes,
            exampleRoutes,
            listRoutes,
            settingRoutes,
            shareRoutes,
            templateRoutes,
            typeRoutes
        ]
    },
    redirect: [{
        path: '/index',
        ignore: true,
        onEnter: (_, replaceState) => {
            replaceState('/card/setting/list')
        }
    }]
}

export default config
