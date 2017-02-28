import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WALL_MSGREVIEW,
	UPDATE_WALL_MSGREVIEW
} from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	// loop: 1, // 1=弹幕循环 0=不循环
	// style: 'rough', // simple=婉约 rough=粗犷
	// position: ['top', 'middle', 'bottom'], // 屏幕位置
	// fontSize: 48, // 弹幕字体大小 24, 36, 48
	// speed: .4 // 弹幕移动速度 .2 .3 .4
	info: {
		loop: 0,
		style: 'simple',
		position: [],
		font_size: 24,
		speed: .4

	}
})

const actionHandlers = {
	[FETCH_WALL_MSGREVIEW]: (state, { response }) => {
		return state.set('info', Immutable.fromJS(response.result))
	},

	[UPDATE_WALL_MSGREVIEW]: (state, { response }) => {
		return state.set('info', Immutable.fromJS(response.result))
	},

	['xxx']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)