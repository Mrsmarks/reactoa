import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_WALL_SCREEN_CTRL,
	UPDATE_WALL_SCREEN_CTRL,
	UPDATE_WALL_SCREEN_PNUM
	 } from 'wechatWall/constants'
import Immutable from 'immutable'


const initialState = Immutable.fromJS({
	content: {
	//消息墙
		wall: {
			option: [],
			templateListOfPhone:[],
			fresh_time: null, 
			status: null,
			phone_tid: null
		},
		//签到墙
		sign: {
			status: null 
		},
		//图片墙
		picture: {
			selected_id: null,
		    status: null
		},
		//嘉宾墙
		custom: {
			status: null 
		},
		//对对碰
		bump: {
			status: null,
			phone_tid: null,
			screen_tid: null,
			templateListOfPhone:[],
			templateListOfScreen:[]
		},
		//投票
		vote: {
			option: {
				join: [],
				unjoin: [],
			},
			selected_id: null,
			phone_tid: null,
			screen_tid: null,
			templateListOfPhone: [],
			templateListOfScreen: [],
			pause: null,
			status: null 
		},
		//数钱
		money: {
			option: { 
				join: [],
				unjoin: []
			},
			templateListOfPhone: [],
			templateListOfScreen: [],
			phone_tid: null,
			screen_tid: null,
			status: null,
			selected_id: null
		},
		//摇大奖
		shakePrize: {
			option: { 
				join: [],
				unjoin: [],
			},
			selected_id: null,
			status: null,
			phone_tid: null,
			screen_tid: null,
			templateListOfPhone: [],
			templateListOfScreen: []  
		},
		//摇一摇
		shake: {
			option: { 
				join: [],
				unjoin: []
			},
			status: null,  
			selected_id: null,
			phone_tid: null,
			screen_tid: null,
			templateListOfPhone: [],
			templateListOfScreen: []
		},
		//抽奖
		prize: {
			option: { 
				join: [],
				unjoin: []
			},
			draw_show_headimg: null,
			selected_id: null,
			people_num: null,
			status: null,
			templateListOfPhone: [],
			templateListOfScreen:[],
			phone_tid: null,
			screen_tid: null
		},
		qrcode_img: ''
	},
	pending: true
})

const actionHandlers = {
	[FETCH_WALL_SCREEN_CTRL]: (state, { response }) => {
		return state.update('content', x => Immutable.fromJS(response.result))
			.update('pending', x => false)
	},

	[UPDATE_WALL_SCREEN_CTRL]: (state, { response, way }) => {
		return state.updateIn(['content', way], x => Immutable.fromJS(response.result[way]))		
	},

	[UPDATE_WALL_SCREEN_PNUM]: (state, { response }) => {
		return state.updateIn(['content', 'prize', 'people_num'], x => Immutable.fromJS(response.result.prize.people_num))
	},

	['wallDetailScreenCtrl']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)