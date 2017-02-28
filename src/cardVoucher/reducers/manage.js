import createReducer from 'Application/utils/create-reducer'
import {
    FETCH_CARD_VOUCHER_PHOTOS,
} from 'cardVoucher/constants'
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
    
})

const actionHandlers = {
    

    ['cardVoucherManage']: (state, { error }) => {
        return state.set('pending',false)
                    .set('error', error)
    }
}

export default createReducer(initialState, actionHandlers)