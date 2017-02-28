import Entry from './entry'
import pictureRoute from './picture'
import storeRoute from './store'
import routeRoute from './route'
import whitelistRoute from './whitelist'
import qrcodeRoute from './qrcode'
import redeemRoute from './redeem'
import manageRoute from './manage'
const config = {
    root:{
        path: '/',
        name: '卡券系统',
        component: Entry,
        childRoutes: [
            pictureRoute,
            routeRoute,
            storeRoute,
            whitelistRoute,
            redeemRoute,
            qrcodeRoute,
            manageRoute
        ]
    },
    redirect: [{
        path: '/index',
        ignore: true,
        onEnter: (_, replaceState) => {
             replaceState('/card-voucher/picture/index')
        }
    }]
}
export default config
