import React, { PropTypes } from 'react'

import Modal from 'antd/lib/modal'
import Button from 'antd/lib/button'
import Upload from 'antd/lib/upload'
import Popover from 'antd/lib/popover'
import Icon from 'antd/lib/icon'
import Input from 'antd/lib/input'
import { InputNumber } from 'antd'
import Message from 'antd/lib/message'
import styles from './addModal.scss'


export default class mainModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: false,
			isChosedImg: [],
			jumpPage: 0
		}
	}

	static propTypes = {
		visible: PropTypes.bool.isRequired,
		uploadFile: PropTypes.func.isRequired,
		handleCancel: PropTypes.func.isRequired,
		fetchCardVoucherPhotos: PropTypes.func.isRequired,
		allstoreAddPics: PropTypes.object.isRequired,
		storeListParams: PropTypes.object.isRequired,
		handleSure: PropTypes.func.isRequired,
		assetsUrl: PropTypes.string.isRequired,
		chosedPic: PropTypes.array.isRequired,
		handleChosePic: PropTypes.func.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	choseStoreImg = id => {
		this.props.handleChosePic(id)
	}

	handlePrepage = () => {
		const curPage = this.props.storeListParams.page
		if(curPage > 1) {
			this.props.fetchCardVoucherPhotos({ page:curPage - 1, psize:8 })
		}
	}

	handleNextpage = () => {
		const totalPage = Math.ceil(this.props.storeListParams.count / 8)
		const curPage = this.props.storeListParams.page
		if(curPage < totalPage){
			this.props.fetchCardVoucherPhotos({ page:curPage + 1, psize:8 })
		}
	}

	hanlePageChange = value => {
		this.setState({
			jumpPage:value
		})
	}

	handleJumppage = () => {
		const totalPage = Math.ceil(this.props.storeListParams.count / 8)
		if(this.state.jumpPage <= totalPage){
			this.props.fetchCardVoucherPhotos({ page:this.state.jumpPage, psize:8 })
		}else{
			Message.error('请输入正确的页数')
		}
	}

	handleSure = () => {
		this.props.handleSure(this.state.isChosedImg)
	}

	handleCancel = () => {
		this.props.handleCancel()
	}

	render() {
		const PopcoverProps = {
			content:(
				<div>
					<p>不添加水印</p>
					<p>已关闭水印，所有上传图片都不会带有水印。若需修改，请前往<a href="#">功能设置</a>设置图片水印</p>
				</div>
			)
		}

		return(
			<Modal ref="modal"
				title="添加门店图片"
				style={{ top:100 }}
				width={850}
				visible={this.props.visible}
				onCancel={this.handleCancel}
				footer={[
					<Button key="back" type="ghost" onClick={ this.handleCancel }>返回</Button>,
					<Button key="submit" type="primary" loading={this.state.loading} onClick={ this.handleSure } disabled={this.props.chosedPic.length > 0 ?false:true}>确定</Button>
				]}
			>
			 	<div className={styles.addStorePic}>
			 		<div className={styles.addStoreLeft}>
			 			<div className={styles.addStoreGroup}>未分组<span className={styles.picCount}>({this.props.allstoreAddPics.count})</span></div>
			 		</div>
			 		<div className={styles.addStoreRight}>
			 			<div className={styles.addStoreRightHeader}>
			 				<div className={styles.headTips}>
			 			    	建议尺寸：640像素*340像素，已关闭图片水印
			 					<Popover {...PopcoverProps}>
			 						<div className={styles.headTipsImg}></div>
			 					</Popover>
			 				</div>			 				
			 				<Upload>
			 					<Button type="primary" style={{ marginLeft:8 }}>本地上传</Button>
			 				</Upload>
			 			</div>
			 			<div className={styles.addStoreRightCont}>
			 			{
			 				this.props.allstoreAddPics.list.map(item => {
			 					return (
			 						<div className={styles.addStoreContX} key={'storeX'+item.id} id={item.id} onClick={() => this.choseStoreImg(item.id)}>
			 							<div className={styles.ContX} >
			 								<img className={styles.addStoreContXPic} src={this.props.assetsUrl + item.img_url}/>
			 								<div className={styles.addStoreContXName}>{item.name}</div>
			 								{
			 									// this.state.isChosedImg.some(x => x == item.id)?
			 									this.props.chosedPic.some(picItem => picItem.id == item.id)?
			 									<div className={styles.addStoreChosed}></div>:''
			 								}			 								
			 							</div>			 							
			 						</div>
			 					)
			 				})
			 			}			 				
			 			</div>
			 			<div className={styles.addStoreRightFooter}>
			 				<div className={styles.addStoreCount}>已选{ this.props.chosedPic.length }个,可选{this.props.allstoreAddPics.count}个</div>
			 				<Button type="ghost" onClick={this.handlePrepage}><Icon type="left"/></Button>
			 				<div className={styles.footNums}>{this.props.storeListParams.page}/{Math.ceil(this.props.storeListParams.count / 8)}</div>
			 				<Button type="ghost" style={{ marginLeft:8 }} onClick={this.handleNextpage}><Icon type="right"/></Button>
			 				<InputNumber style={{ width:50,marginLeft:8 }} min={1} onChange={this.hanlePageChange}/>
			 				<Button type="ghost" onClick={this.handleJumppage} style={{ marginLeft:8 }}>跳转</Button>
			 			</div>
			 		</div>
			  	</div>
			</Modal>
		)
	}
 
}