import React, { PropTypes } from 'react'
import update from 'react/lib/update'
import styles from './index.scss'
import Immutable from 'immutable'
import PreviewButton from 'wechatWall/components/wall-details/previewButton'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import CardItem from './card'

import Form from 'antd/lib/form'
const FormItem = Form.Item
import Input from 'antd/lib/input'
import Button from 'antd/lib/button'
import Modal from 'antd/lib/modal'
import Row from 'antd/lib/row'
import Upload from 'antd/lib/upload'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'
import Spin from 'antd/lib/spin'

/**
 * 微信墙－嘉宾
 */
@Form.create()
@DragDropContext(HTML5Backend)
export default class GuestComp extends React.Component {
	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		actions: PropTypes.object.isRequired,
		assetsUrl: PropTypes.string.isRequired,
		listLoading: PropTypes.bool.isRequired
	}

	static contextTypes = {
		getSid: PropTypes.func.isRequired
	}

	state = {
		img_url: '',
		modalVisible: false,
		editData: {}
	}

	constructor(props) {
		super(props)
		this.moveCard = this.moveCard.bind(this)

	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.content !== this.props.content) {
			this.setState({
				cards: nextProps.content.toJS()
			})
		}
	}

	shownAddGuestModal(id) {
		if (id) {
			const data = this.state.cards.find(item => item.id == id)
			this.setState({
				editData: data,
				img_url: data.headimgurl
			})
		}

		this.setState({
			modalVisible: true
		})
	}

	hideAddGuestModal() {
		this.setState({
			modalVisible: false
		})
	}

	moveCard(dragIndex, hoverIndex) {
		const { cards } = this.state
		const dragCard = cards[dragIndex]

		this.setState(update(this.state, {
			cards: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragCard]
				]
			}
		}))
	}

	endDrag() {
		const postData = JSON.stringify(this.state.cards.map((item, index) => {
			return {
				id: item.id,
				sort: index + 1
			}
		}))

		const id = this.context.getSid()
		this.props.actions.sortGuest(postData, id).then(response => message.success(response.errormsg))
	}

	uploadFile(file) {
		this.props.actions.uploadFile(file).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({
				img_url: resolve.result.file_url
			})
		})
	}

	confirmDeleteGuest(id) {
		Modal.confirm({
			title: '确认删除该嘉宾吗？',
			onOk: () => {
				const sid = this.context.getSid()
				
				this.props.actions.deleteGuest({}, 'delete', sid, id).then(response => message.success(response.errormsg))
			}
		})
	}

	saveGuest() {
		this.props.form.validateFields((errors, values) => {
			if (errors) {
				return
			}

			if (!this.state.img_url) {
				return message.error('请选择嘉宾图片')
			}

			const postData = {
				name: values.name,
				rank: values.rank,
				headimgurl: this.state.img_url,
				intro: values.intro
			}

			const sid = this.context.getSid()
			const act = Object.keys(this.state.editData).length ? 'update' : 'add'
			const id = this.state.editData.id

			this.props.actions.editGuest(postData, act, sid, id).then(response => {
				message.success(response.errormsg)
				this.props.form.resetFields()
				this.hideAddGuestModal()
			})
		})
	}

	renderModal() {
		const formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 20
			}
		}
		const fileProps = {
			accept: 'image/*',
			listType: 'picture-card',
			beforeUpload: this.uploadFile.bind(this),
			fileList: this.state.img_url ? [{
				uid: -1,
				status: 'done',
				url: this.props.assetsUrl + this.state.img_url
			}] : []
		}

		const { getFieldProps } = this.props.form
		const { editData } = this.state
		const nameProps = getFieldProps('name', {
			rules: [
				{ required: true, message: '请选择嘉宾名称' }
			],
			initialValue: editData.name
		})

		const rankProps = getFieldProps('rank', {
			rules: [
				{ required: true, message: '请选择嘉宾名称' }
			],
			initialValue: editData.rank
		})

		const introProps = getFieldProps('intro', {
			rules: [
				{ required: true, message: '请选择嘉宾介绍' }
			],
			initialValue: editData.intro
		})

		return (
			<Modal
				title={Object.keys(editData).length ? '修改' : '添加'}
				visible={this.state.modalVisible}
				onCancel={::this.hideAddGuestModal}
				confirmLoading={this.props.editLoading}
				onOk={::this.saveGuest}
			>
				<Form horizontal >
					<FormItem
						label="嘉宾名称："
						{...formItemLayout}
					>
						<Input {...nameProps}/>
					</FormItem>
					<FormItem
						label="嘉宾图片："
						required
						{...formItemLayout}
					>
						<Upload {...fileProps}>
							<Icon type="plus" />
          					<div className="ant-upload-text">上传照片</div>
						</Upload>
					</FormItem>
					<FormItem
						label="嘉宾头衔："
						{...formItemLayout}
					>
						<Input {...rankProps}/>
					</FormItem>
					<FormItem
						label="嘉宾介绍："
						{...formItemLayout}
					>
						<Input {...introProps}/>
					</FormItem>
				</Form>
			</Modal>
		)
	}

	render() {
		return (
			<Spin spinning={this.props.listLoading}>
				<PreviewButton action="guest" />
				{this.renderModal()}
				<Button type="primary" onClick={this.shownAddGuestModal.bind(this, null)}>添加嘉宾</Button>
				<div className={styles.container}>
					{
						this.state.cards ? this.state.cards.map((item, index) => {
							return (
								<CardItem {...item} 
									assetsUrl={this.props.assetsUrl}
									key={index}
									index={index} 
									moveCard={this.moveCard}
									endDrag={::this.endDrag}
									onShownEditModal={::this.shownAddGuestModal}
									onDeleteGuest={::this.confirmDeleteGuest}/>
							)
							
						}) : null
					}
				</div>
				
			</Spin>
			
		)
	}
}