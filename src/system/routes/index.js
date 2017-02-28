import Entry from './Entry'
import adminRoutes from './admin'
import authRoutes from './auth'
import departmentRoutes from './department'
import groupRoutes from './group'
import helpRoutes from './help'
import keyRoutes from './key'
import managementRoutes from './management'
import menuRoutes from './menu'
import networkRoutes from './network'
import operateLogRoutes from './operate_log'
import organizationRoutes from './organization'
import roleRoutes from './role'
import settingRoutes from './setting'
import statusCodeRoutes from './status_code'

const config = {
    root: {
        path: '/',
        component: Entry,
        childRoutes: [
            adminRoutes,
            authRoutes,
            departmentRoutes,
            groupRoutes,
            helpRoutes,
            keyRoutes,
            managementRoutes,
            menuRoutes,
            networkRoutes,
            operateLogRoutes,
            organizationRoutes,
            roleRoutes,
            settingRoutes,
            statusCodeRoutes
        ]
    },
    redirect: [{
        path: '/index',
        ignore: true,
        onEnter: (_, replaceState) => {
            replaceState('/system/setting/edit')
        }
    }]
}

export default config
