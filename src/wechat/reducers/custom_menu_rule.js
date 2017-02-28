import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WECHAT_CUSTOMMENURULE_LIST,
	ADD_WECHAT_CUSTOMMENURULE_LIST,
	DELETE_WECHAT_CUSTOMMENURULE_LIST,
	UPDATE_WECHAT_CUSTOMMENURULE_LIST,
	FETCH_CITY_LIST
} from 'wechat/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	content: [],
	select: {
		clientType: [],
		languageList: [],
		packageList: [],
		provinceList: [],
		sexList: [],
		weixinGroup: [],
	},
	cityList: [],
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	pending: true
})

const actionHandlers = {
	[FETCH_WECHAT_CUSTOMMENURULE_LIST]: (state, { response, select, params }) => {
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	[FETCH_CITY_LIST]: (state, { response }) => {
		return state.update('cityList', x => Immutable.fromJS(response.result))
	},

	[ADD_WECHAT_CUSTOMMENURULE_LIST]: (state, { response }) => {
		var content = state.get('content').toJS()
		var params = state.get('params').toJS()
		const info = response.result
		params.count = params.count + 1
		content.unshift(info)
		return state.update('content', x => Immutable.fromJS(content))
					.update('params', x => Immutable.fromJS(params))
	},

	[DELETE_WECHAT_CUSTOMMENURULE_LIST]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
					.updateIn(['params', 'count'], x => x - 1)
	},

	[UPDATE_WECHAT_CUSTOMMENURULE_LIST]: (state, { response }) => {
		var content = state.get('content').toJS()
		const info = response.result
		var index = content.findIndex(item => {
			return item.id == info.id
		})
		if(index > -1) {
			content[index] = info
		}
		return state.update('content', x => Immutable.fromJS(content))
	},

	['wechatCustomMenuRule']:(state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)