import integralUser from './list'
import userCredit from './user_credit'
export default {
    path: '/integral/user/list',
    name: '用户积分',
    component: integralUser,
    childRoutes: [{
    	path: '/integral/user/user_credit',
	    name: '单个用户积分记录',
	    component: userCredit,
    }]
}