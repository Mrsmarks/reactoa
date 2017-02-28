import createReducer from 'Application/utils/create-reducer'
import { 
	ADD_WALL_PHOTO,
	FETCH_PHOTO_LIST,
	DELETE_WALL_PHOTO
} from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	picType: 'localPic', // 图片类型 localPic＝本地图片 wallPic＝上墙图片
	content: []
})

const actionHandlers = {
	[ADD_WALL_PHOTO]: (state, { response: { result } }) => {
		result.uid = result.id
		result.url = result.imgurl
		result.status = 'done'

		return state.update('content', x => x.push(Immutable.fromJS(result)))
	},

	[DELETE_WALL_PHOTO]: (state, { id }) => {
		return state.update('content', x => x.filter(item => item.get('id') != id))
	},

	[FETCH_PHOTO_LIST]: (state, { response: { result: { list, photo_source } } }) => {
		list.map(item => {
			item.uid = item.id,
			item.url = item.imgurl
			item.status = 'done'
			return item
		})
		return state.set('content', Immutable.fromJS(list))
					.set('picType', photo_source)
	},
	['xxx']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)