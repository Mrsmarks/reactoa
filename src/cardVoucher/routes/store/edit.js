import React,{ PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import EditStoreComp from 'cardVoucher/components/store/edit'

import { checkStore, getStoresEditSelect, getTopDistricts, getTopDistrictsChild, fetchCardVoucherPhotos, searchMapBykeyword, getDetailLocation } from 'cardVoucher/actions'
import { uploadFile } from  'Application/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'


/*
 * 卡券系统 --门店系统
 * 修改 
 */

 @connect(
 	({ storeLists,application }) => ({
 		pending:storeLists.get('pending'),
 		assetsUrl: application.getIn(['user', 'assets_domain']),
 		acname: storeLists.get('acname'),
 		selectData: storeLists.get('selectData'),
 		checkInfos: storeLists.get('checkInfos'),
 	    topDistricts: storeLists.get('topDistricts'),
 		topDistrictsSecChild: storeLists.get('topDistrictsSecChild'),
 		topDistrictsThirdChild: storeLists.get('topDistrictsThirdChild'),
 		storeListPics:storeLists.get('storeListPics'),
 		storeListParams:storeLists.get('storeListParams')
 	}),

 	dispatch => ({
 		actions: bindActionCreators({ getStoresEditSelect, getTopDistricts, getTopDistrictsChild, fetchCardVoucherPhotos, searchMapBykeyword, getDetailLocation }, dispatch)
 	})	
 )


export default class editStoreRoute extends React.Component {
	state = {
		loading: false
	}

	static storeName = 'storeLists'
 	static fillStore(redux, props) {
 		return Promise.all([
 			redux.dispatch(checkStore({ ...props.location.query })),
 			redux.dispatch(getStoresEditSelect({...props.location.query})),
 			redux.dispatch(getTopDistricts())
 		])
 	}

 	@autoLoading.bind(this, 'fileLoading')
 	uploadFile() {
 		return this.props.actions.uploadFile(...arguments)
 	}

 	getStoresEditSelect() {
 		return this.props.actions.getStoresEditSelect(...arguments)
 	}

 	getTopDistricts() {
 		return this.props.actions.getTopDistricts(...arguments)
 	}

 	getTopDistrictsChild() {
 		return this.props.actions.getTopDistrictsChild(...arguments)
 	}

 	fetchCardVoucherPhotos() {
 		return this.props.actions.fetchCardVoucherPhotos(...arguments)
 	}

 	searchMapBykeyword() {
 		return this.props.actions.searchMapBykeyword(...arguments)
 	}

 	getDetailLocation() {
 		return this.props.actions.getDetailLocation(...arguments)
 	}

 	 render () {
 		return (
 			<div>
 			{
 				this.props.children? this.props.children:
 				<Spin spinning={this.props.pending}> 
 					<EditStoreComp
 						{...this.props}
 						{...this.state}
 						actions={{
 							uploadFile: ::this.uploadFile,
							getStoresEditSelect: ::this.getStoresEditSelect,
							getTopDistricts: ::this.getTopDistricts,
							getTopDistrictsChild: ::this.getTopDistrictsChild,
							fetchCardVoucherPhotos: ::this.fetchCardVoucherPhotos,
							searchMapBykeyword: ::this.searchMapBykeyword,
							getDetailLocation: ::this.getDetailLocation
 						}}
 					>
 					</EditStoreComp>
 				</Spin>
 			}
 			</div>
 		)
 	}
}