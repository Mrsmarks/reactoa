import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import StoreComp from 'cardVoucher/components/store/list'

import { fetchStoreLists, getStatusSelectList, syncStoreList, syncStoreOne, deleteStore } from 'cardVoucher/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 卡券系统 --门店系统路由
 */
@connect(
	({ storeLists }) => ({
		content: storeLists.get('content'),
		params: storeLists.get('params'),
		pending: storeLists.get('pending'),
		selectData: storeLists.get('selectData')
	}),
	dispatch => ({
		actions: bindActionCreators({ fetchStoreLists, getStatusSelectList, syncStoreList, syncStoreOne, deleteStore }, dispatch)
	})
)

 export default class StoreCompRoute extends React.Component {

 	state = {
 		loading:false,
 		listLoading:false,
 		syncStoreLoading:false,
 		delStoreLoading:false
 	}

 	static storeName = 'storeLists'
 	static fillStore(redux, props) {
 		return Promise.all([
 			redux.dispatch(fetchStoreLists({...props.location.query})),
 			redux.dispatch(getStatusSelectList())
 		])
 	}

 	@autoLoading.bind(this, 'loading')
 	fetchStoreLists() {
 		return this.props.actions.fetchStoreLists(...arguments)
 	}

 	@autoLoading.bind(this, 'listLoading')
 	getStatusSelectList() {
 		return this.props.actions.getStatusSelectList(...arguments)
 	}

 	@autoLoading.bind(this, 'syncStoreLoading')
 	syncStoreList() {
 		return this.props.actions.syncStoreList(...arguments)
 	}

 	@autoLoading.bind(this, 'syncStoreLoading')
 	syncStoreOne() {
 		return this.props.actions.syncStoreOne(...arguments)
 	}

 	@autoLoading.bind(this, 'delStoreLoading')
 	deleteStore() {
 		return this.props.actions.deleteStore(...arguments)
 	}

 	render() {
 		return (
 			<div>
 				{
 				  	this.props.children? this.props.children: 
	 				<Spin spinning={this.props.pending}>
						<StoreComp
							{...this.props}
							{...this.state}
							action={{
								fetchStoreLists: ::this.fetchStoreLists,
								getStatusSelectList: ::this.getStatusSelectList,
								syncStoreList: ::this.syncStoreList,
								syncStoreOne: ::this.syncStoreOne,
								deleteStore: ::this.deleteStore
							}}
						>
						</StoreComp>
					</Spin>
 				}
			</div>
 		)
 	}

 }