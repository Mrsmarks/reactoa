import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WECHAT_PICTURE_LIST, 
	SAVE_WECHAT_PICTURE,
	FETCH_WECHAT_PICTURE_BYID,
	DELETE_WECHAT_PICTURE_MATERIAL,
	UPDATE_WECHAT_MEDIA_ID
} from 'wechat/constants'
import Immutable from 'immutable'


const initialState = Immutable.fromJS({
	content: [],
	params: {
		count: 0,
		page: 0,
		pszie: 0
	},

	editData: {}
})

const actionHandlers = {
	[FETCH_WECHAT_PICTURE_LIST]: (state, { response: { list }, params }) => {
		
		return state.set('content', Immutable.fromJS(list))
					.set('params', Immutable.fromJS(params))
					.set('pending', false)
	},
	[SAVE_WECHAT_PICTURE]: (state, { response: { result } }) => {
		return state.update('content', x => x = x.unshift(Immutable.fromJS(result)))
	},
	[FETCH_WECHAT_PICTURE_BYID]: (state, { response }) => {
		return state.set('editData', Immutable.fromJS(response) )
	},
	[DELETE_WECHAT_PICTURE_MATERIAL]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
	},
	[UPDATE_WECHAT_MEDIA_ID]: (state, { id, mediaId }) => {
		return state.update('content', x => x.map(item => {
			if (item.get('id') == id) {
				item = item.set('media_id', mediaId)
			}
			return item
		}))
	},
	['wechatPicture']: (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}

export default createReducer(initialState, actionHandlers)