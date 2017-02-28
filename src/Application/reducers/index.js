import createReducer from '../utils/create-reducer'
import { 
    FETCH_USERCONFIG_SUCCESS,
    FETCH_USERPUBLIC_LIST,
    APP_READY,
    APP_CRASH,
    LOGOUT,
    LOGIN
} from '../constants'
import Immutable from 'immutable'


let user = {
    cpid: -1,
    uid: -1,
    assets_domain: '',
    backend_domain: '',
    username: ''
}
try {
    const ret = JSON.parse(localStorage.getItem('wxadminUser'))
    if (ret) {
        user = ret
    }
} catch (e) {
    console.error('解析用户失败', e)
}
 
const initialState = Immutable.fromJS({
    routes: [],

    appReady: false,
    appCrash: false,
    crashMsg: '',

    publicList: [],
    user,
    auth: {}
})

const actionHandlers = {
    [FETCH_USERCONFIG_SUCCESS]: (state, { routes, auth }) => {
        let authObj = {}
        auth.split(',').forEach(item => authObj[item] = null)
        return state.set('routes', Immutable.List(routes))
                    .set('auth', authObj)
    },
    [FETCH_USERPUBLIC_LIST]: (state, { response }) => {
        return state.set('publicList', Immutable.fromJS(response))
    },
    [APP_READY]: state => {
        return state.update('appReady', x => true)
                    .update('appCrash', x => false)
    },
    [APP_CRASH]: (state, { errormsg }) => {
        return state.update('appCrash', x => true)
                    .update('appReady', x => false)
                    .set('crashMsg', errormsg)
    },
    [LOGOUT]: state => {
        localStorage.removeItem('wxadminUser')
        return state.set('appCrash', false)
                    .set('appReady', false)
    },
    [LOGIN]: (state, { user }) => {
        localStorage.setItem('wxadminUser', JSON.stringify(user))
        return state.set('user', Immutable.fromJS(user))
    }

}

export const application = createReducer(initialState, actionHandlers)