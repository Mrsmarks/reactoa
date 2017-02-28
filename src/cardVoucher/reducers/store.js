import createReducer from 'Application/utils/create-reducer'
import {
	FETCH_STORE_LISTS,
	GET_STATUS_SELECT_LIST,
	ADD_STORE,
	GET_STORES_EDIT_SELECT,
	GET_TOP_DISTRICTS,
	GET_TOP_DISTRICTS_CHILD,
	FETCH_CARD_VOUCHER_PHOTOS,
	SEARCH_MAP_BY_KEYWORD,
	GET_DETAIL_LOCATION,
	CHECK_STORE,
	EDIT_STORE,
	SYNC_STORE_LIST,
	DELETE_STORE
} from 'cardVoucher/constants'
import Immutable,{ fromJS } from 'immutable'

const initialState = Immutable.fromJS({
	content:[],
	params: {
		page:0,
		psize:0,
		count:0
	},
	selectData: {
		availableStatus: [],
		updateStatus: [],
		offsetType:[],
		photoList:[],
		categoryList:[],
		categoryChild:[]
	},
	pending: true,
	acname:'',
	// categoryListFirst:'',
	// categoryChildFirst:'',
	topDistricts:[],
	topDistrictsSecChild:[],
	topDistrictsThirdChild:[],
	storeListPics:{
		count:0,
		list:[]
	},
	storeListParams:{
		page:0,
		psize:0,
		count:0
	},
	searchMapResult: [],
	detailLocation: {},
	checkInfos: {
		photo_list:[],
		categories:{
			id:'',
			name:''
		},
		longitude:'',
		latitude:'',
		business_name:'',
		branch_name:'',
		province:'',
		city:'',
		district:'',
		address:'',
		telephone:'',
		special:'',
		open_time:'',
		avg_price:'',
		introduction:'',
		recommend:'',
		available_state_name:'',
		offset_type_name:''
	}
})

const actionHandlers = {
	[FETCH_STORE_LISTS]: (state,{ response, params }) => {
		return state.update('content', x => fromJS(response.result.list))
					.update('params', x => fromJS(params))
					.update('acname', x => fromJS(response.result.acname))
					.update('pending', x => false)
	},

	[GET_STATUS_SELECT_LIST]: (state, { response }) => {
		return state.setIn(['selectData','availableStatus'], fromJS(response.result.availableStatus))
					.setIn(['selectData','updateStatus'], fromJS(response.result.updateStatus))
	},

	[ADD_STORE]: (state, { response }) => {
		return state.update('content', x => x.unshift(fromJS(response.result)))
					.updateIn(['params','count'], x => x + 1)
	},

	[GET_STORES_EDIT_SELECT]: (state, { response }) => {
		return state.setIn(['selectData','offsetType'], fromJS(response.result.offsetType))
					.setIn(['selectData','photoList'], fromJS(response.result.photoList))
					.setIn(['selectData','categoryList'], fromJS(response.result.categoryList))
					.setIn(['selectData','categoryChild'], fromJS(response.result.categoryChild))
					// .set('categoryListFirst', fromJS(response.result.categoryList[0].id))
					// .set('categoryChildFirst', fromJS(response.result.categoryChild[0].id))
	},

	[GET_TOP_DISTRICTS]: (state, { data }) => {
		return state.set('topDistricts', fromJS(data.result[0]))
	},

	[GET_TOP_DISTRICTS_CHILD]:(state, { data }) => {
		return state.set('topDistrictsSecChild', fromJS(data.result[0]))
					.set('topDistrictsThirdChild', fromJS(data.result[0]))
	},

	[FETCH_CARD_VOUCHER_PHOTOS]:(state, { response, params }) => {
		return state.update('storeListPics', x => fromJS(response.result))
					.update('storeListParams', x => fromJS(params))
	},

	[SEARCH_MAP_BY_KEYWORD]:(state, { data }) => {
		return state.set('searchMapResult', fromJS(data))
	},

	[GET_DETAIL_LOCATION]:( state, { data }) => {
		return state.set('detailLocation', fromJS(data)) 
	},

	[CHECK_STORE]: (state, { response }) => {
		// response.result.key = response.result.id
		return state.set('checkInfos', fromJS(response.result))
	},

	[EDIT_STORE]: (state, { response, id }) => {
		return state.update('content', x => {
			const index = x.findIndex(item => item.get('id') == response.result.id)
			if(index > -1) {
				return x.update(index, x=> fromJS(response.result))
			}
		})
	},

	[DELETE_STORE]: (state, { response, id }) => {
		return state.update('content', x => x.filter(item => item.id != id))
					.updateIn(['params','count'], x => x - 1)
	},

    ['storeLists']: (state, { error }) => {
    	return state.set('pending', false)
    				.set('error',error)
    }
}

export default createReducer(initialState, actionHandlers)
