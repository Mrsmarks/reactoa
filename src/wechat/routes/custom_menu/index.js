import list from './list'
import menu_pkg_list from './menu_pkg_list'

export default {
    path: '/wechat/custom-menu/list',
    name: '个性化菜单',
    component: list,
    childRoutes: [{
        path: '/wechat/add-menu-package/list',
        name: '编辑菜单包',
        component: menu_pkg_list
    }]
}
