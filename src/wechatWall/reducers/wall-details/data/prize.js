import createReducer from 'Application/utils/create-reducer'
import { 
	FETCH_DRAW_DATA_BYID,
	 } from 'wechatWall/constants'
import Immutable from 'immutable'

	
const initialState = Immutable.fromJS({
	content:[],
	params: {
		page: 0,
		psize: 0,
		count: 0
	},
	select:{
		drawList: [],
		drawType: []
	},
	pending: true
})

const actionHandlers = {
	[FETCH_DRAW_DATA_BYID]: (state, { response, params, select }) => {
		
		return state.update('content', x => Immutable.fromJS(response.result.list))
			.update('select', x => Immutable.fromJS(select.result))
			.update('params', x => Immutable.fromJS(params))
			.update('pending', x => false)
	},

	['wallDetailPrize']:  (state, { error }) => {
		return state.set('pending', false)
					.set('error', error)
	}
}


export default createReducer(initialState, actionHandlers)