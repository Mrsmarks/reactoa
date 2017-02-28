import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WALL_MSTCHING_INFO,
} from 'wechatWall/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
	isOpen: false, 
	groupType: 2, // 1=男士女士 2=自定义名称
	leftName: '名称1',
	rightName: '名称2',
	crowd: 2, // 抽取人群 1=从所有上墙的人中抽取（在微信中填写过性别的才能参与） 2=报名的人 (点击对对碰图标进行报名)
	displayAvatar: 'heart' // heart=心形 circle=圆形 vs=对抗赛 
})

const actionHandlers = {
	[FETCH_WALL_MSTCHING_INFO]: (state, { response }) => {
		return state.set('isOpen', response.result.mstching_status)
					.set('groupType', response.result.custom_name_status)
					.set('leftName', response.result.first_custom_name)
					.set('rightName', response.result.second_custom_name)
					.set('crowd', response.result.extract_type)
					.set('displayAvatar', response.result.head_sculpture_type)
	},

	['xxx']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)