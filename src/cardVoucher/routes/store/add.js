import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AddStoreComp from 'cardVoucher/components/store/add'
import { addStore , getStoresEditSelect, getTopDistricts, getTopDistrictsChild, fetchCardVoucherPhotos, searchMapBykeyword, getDetailLocation } from 'cardVoucher/actions'
import { uploadFile } from  'Application/actions'

import Spin from 'antd/lib/spin'
import autoLoading from 'Application/decorators/autoLoading'

/*
 * 门店系统
 * 新建门店路由
 */

 @connect(
 	({ storeLists,application,cardVoucherPic }) => ({
 		pending: storeLists.get('pending'),
 		acname: storeLists.get('acname'),
 		assetsUrl: application.getIn(['user', 'assets_domain']),
 		selectData: storeLists.get('selectData'),
 		// categoryListFirst: storeLists.get('categoryListFirst'),
 		// categoryChildFirst: storeLists.get('categoryChildFirst'),
 		topDistricts: storeLists.get('topDistricts'),
 		topDistrictsSecChild: storeLists.get('topDistrictsSecChild'),
 		topDistrictsThirdChild: storeLists.get('topDistrictsThirdChild'),
 		storeListPics:storeLists.get('storeListPics'),
 		storeListParams:storeLists.get('storeListParams')
 	}),

 	dispatch => ({
 		actions: bindActionCreators({ addStore, uploadFile, getStoresEditSelect, getTopDistricts, getTopDistrictsChild, fetchCardVoucherPhotos, searchMapBykeyword, getDetailLocation }, dispatch)
 	})
 )

 export default class addStoreRoute extends React.Component {
 	state = {
 		loading:false,
 		addLoading: false,
 		fileLoading: false
 	}

 	static storeName = 'storeLists'
 	static fillStore(redux, props) {
 		return Promise.all([
 			redux.dispatch(getStoresEditSelect('')),
 			redux.dispatch(getTopDistricts())
 		])
 	}

 	@autoLoading.bind(this, 'fileLoading')
 	uploadFile() {
 		return this.props.actions.uploadFile(...arguments)
 	}

 	@autoLoading.bind(this, 'addLoading')
 	addStore() {
 		return this.props.actions.addStore(...arguments)
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

 	render() {
 		return(
 			<div>
 			{
 				this.props.children? this.props.children: 
 				<Spin spinning={this.props.pending}>
					<AddStoreComp
						{...this.props}
						{...this.state}
						actions={{
							uploadFile: ::this.uploadFile,
							addStore: ::this.addStore,
							getStoresEditSelect: ::this.getStoresEditSelect,
							getTopDistricts: ::this.getTopDistricts,
							getTopDistrictsChild: ::this.getTopDistrictsChild,
							fetchCardVoucherPhotos: ::this.fetchCardVoucherPhotos,
							searchMapBykeyword: ::this.searchMapBykeyword,
							getDetailLocation: ::this.getDetailLocation
						}}
					>
					</AddStoreComp>
				</Spin>
 			}				
			</div>
 		)
 	}
 }