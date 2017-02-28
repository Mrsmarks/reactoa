import createReducer from 'Application/utils/create-reducer'
import { 
	UPDATE_WALL_SIGN_SETTING,
	FETCH_WALL_SIGN_SETTING,
	FETCH_WALL_WHITE_LIST,
	ADD_WALL_WHITE_NAME,
	DELETE_WALL_WHITE_NAME,
	UPDATE_WALL_WHITE_NAME
} from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	type: 1,
	template: '',
	whiteListStatus: 0,
	whiteList: [],
	screenTemplate: [],
	screenTemplateId: 0,

    mobileTemplate: [],
    mobileTemplateId: 0,

	params: {
		count: 0,
		page: 1,
		psize: 10
	}
})

const actionHandlers = {
	[FETCH_WALL_SIGN_SETTING]: (state, { response: { result } }) => {
        result.screenTemplate.map(item => {
            item.key = item.id
            return item
        })
        result.phoneTemplate.map(item => {
            item.key = item.id
            return item
        })
		return state.set('type', result.type)
					.set('template', result.template)
					.set('whiteListStatus', result.white_list_status)
					.set('screenTemplateId', result.sign_screen_tid)
                    .set('screenTemplate', Immutable.fromJS(result.screenTemplate))
                    .set('mobileTemplate', Immutable.fromJS(result.phoneTemplate))
                    .set('mobileTemplateId', result.sign_phone_tid)
	},

	[UPDATE_WALL_SIGN_SETTING]: (state, { response: { result } }) => {
		return state.set('type', result.type)
					.set('template', result.template)
					.set('whiteListStatus', result.white_list_status)
	},

	[ADD_WALL_WHITE_NAME]: (state, { response }) => {
		response.result.key = response.result.id
		return state.update('whiteList', x => x.unshift(Immutable.fromJS(response.result)))
					.setIn(['params', 'count'], state.getIn(['params', 'count']) + 1)
	},

	[UPDATE_WALL_WHITE_NAME]: (state, { response, id }) => {
		return state.update('whiteList', x => x.map(item => {
			if (item.get('id') == id) {
				response.result.key = response.result.id
				return Immutable.fromJS(response.result)
			}
			return item
		}))
	},

	[FETCH_WALL_WHITE_LIST]: (state, { psize, response: { result: { count, list, page } } }) => {
		list.map(item => {
			item.key = item.id
			return item
		})
		const params = {
			count,
			page,
			psize
		}
		return state.set('whiteList', Immutable.fromJS(list))
					.set('params', Immutable.fromJS(params))
	},

	[DELETE_WALL_WHITE_NAME]: (state, { id }) => {
		return state.update('whiteList', x => x.filter(item => item.get('id') != id))
					.setIn(['params', 'count'], state.getIn(['params', 'count']) - 1)
	},

	['xxx']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)
