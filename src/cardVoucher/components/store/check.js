import React, { PropTypes } from 'react'
import Immutable from 'immutable'

import styles from './check.scss'

import Button from 'antd/lib/button'
import Form from 'antd/lib/form'
import Icon from 'antd/lib/icon'
import InputNumber from 'antd/lib/input-number'
import Message from 'antd/lib/message'
const FormItem = Form.Item

@Form.create()
export default class checkStoreComp extends React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			curPage:1,
			startIndex:0,
			jumpPage:0
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}


	componentDidMount() {
		this.initMap()
	}

	initMap() {
		const lat = this.props.checkInfos.get('latitude')
		const lng = this.props.checkInfos.get('longitude')
		const center = new qq.maps.LatLng(lat,lng)
		const options = {
			center:center,
			zoom:17,
			draggable:false,
			panControl:false,
			zoomControl:false,
			scrollwheel:false
		}
		const QQMap = new qq.maps.Map(document.getElementById("map-container"), options)
		const marker = new qq.maps.Marker({
			position:center,
			map:QQMap
		})
	}

	handlePrepage = () => {
		const curPage = this.state.curPage
		if(curPage > 1) {
			this.setState({
				startIndex: this.state.startIndex -8,
				curPage:curPage - 1
			})	
		}
	}

	handleNextpage = () => {
		const curPage = this.state.curPage
		const totalPage = Math.ceil(this.props.checkInfos.get('photo_list').size / 8)
		if(curPage < totalPage){
			this.setState({
				curPage: curPage + 1,
				startIndex: this.state.startIndex + 8
			})
		}
	}

	hanlePageChange = value => {
		this.setState({
			jumpPage:value
		})
	}

	handleJumppage = () => {
		const totalPage = Math.ceil(this.props.checkInfos.get('photo_list').size / 8)
		if(this.state.jumpPage <= totalPage) {
			this.setState({
				curPage: this.state.jumpPage,
				startIndex: (this.state.jumpPage - 1) * 8
			})
		} else {
			Message.error('请输入正确的页数')
		}
	}

	renderToolbar() {
		return(
			<div className={styles.toolbar}>
				<div className={styles.businessName}>
					<p>{ this.props.checkInfos.get('business_name') }</p>
				</div>
				<div className={styles.storeStatus}>
					<p>{ this.props.checkInfos.get('available_state_name') }</p>
				</div>
				{
					this.props.checkInfos.get('edit') == 1?
					<div className={styles.editBtn}>
						<Button type="primary">重新编辑</Button>
					</div>:''
				}				
			</div>
		)
	}

	renderTable() {
		return(
			<div>				
				<div className={styles.basicInfo}>
					<p>基本信息</p>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>门店名</div>
					<div className={styles.cont}>{ this.props.checkInfos.get('business_name')}</div>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>分店名</div>
					<div className={styles.cont}>{ this.props.checkInfos.get('branch_name')}</div>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>门店类型</div>
					<div className={styles.cont}>{ this.props.checkInfos.get('categories').toJS().name}</div>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>门店地址</div>
					<div className={styles.cont}>{this.props.checkInfos.get('province')+this.props.checkInfos.get('city')+this.props.checkInfos.get('district')+this.props.checkInfos.get('address')}</div>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>标注</div>
					<div className={styles.cont}>
						<div id="map-container" className={styles.mapCont}>
						</div>
					</div>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>坐标类型</div>
					<div className={styles.cont}>{ this.props.checkInfos.get('offset_type_name')}</div>
				</div>
				<div className={styles.service}>
					<p>服务信息</p>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>门店图片</div>
					<div className={styles.cont}>
						{
							this.props.checkInfos.get('photo_list')?
							<div className={styles.imgContainer}>
								<div className={styles.imgCont}>
								{									
									this.props.checkInfos.get('photo_list').slice(this.state.startIndex, this.state.curPage + 8).map(item => {
										return(
											<div className={styles.photoX} key={'photoX' + item.get('id')}>
												<img src={this.props.assetsUrl + item.get('img_url')}/>
											</div>
										)
									})								
								}
								</div>
								{
									this.props.checkInfos.get('photo_list').size > 8 ?
									<div className={styles.imgFooter}>
										<Button type="ghost" onClick={this.handlePrepage} disabled={ this.props.curPage == 1 ? true: false }><Icon type="left"/></Button>
			 							<div className={styles.footNums}> { this.state.curPage }/{ Math.ceil(this.props.checkInfos.get('photo_list').size / 8) }</div>
			 							<Button type="ghost" style={{ marginLeft:8 }} onClick={this.handleNextpage} disabled={ this.props.curPage == Math.ceil(this.props.checkInfos.get('photo_list').size / 8) ? true: false }><Icon type="right"/></Button>
			 							<InputNumber style={{ width:50,marginLeft:8 }} min={1} onChange={this.hanlePageChange}/>
			 							<Button type="ghost" onClick={this.handleJumppage} style={{ marginLeft:8 }}>跳转</Button>
									</div>:''
								}							
							</div>:
							<p>无</p>
						}						
					</div>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>门店电话</div>
					<div className={styles.cont}>{this.props.checkInfos.get('telephone')}</div>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>营业时间</div>
					<div className={styles.cont}>{this.props.checkInfos.get('open_time')}</div>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>推荐</div>
					<div className={styles.cont}>{this.props.checkInfos.get('recommend')}</div>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>特色服务</div>
					<div className={styles.cont}>{this.props.checkInfos.get('special')}</div>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>人均价格</div>
					<div className={styles.cont}>{this.props.checkInfos.get('avg_price')}</div>
				</div>
				<div className={styles.infos}>
					<div className={styles.name}>门店简介</div>
					<div className={styles.cont}>{this.props.checkInfos.get('introduction')}</div>
				</div>
			</div>
		)
	}

	render() {
		return(
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
			</div>
		)		
	}

}