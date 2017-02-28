import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import './index.scss'
import classnames from 'classnames'
import styles from 'wechatWall/components/wall-details/wrap.scss'
import PreviewButton from 'wechatWall/components/wall-details/previewButton'

import Form from 'antd/lib/form'
const FormItem = Form.Item
import Radio from 'antd/lib/radio'
const RadioGroup = Radio.Group
import Button from 'antd/lib/button'
import Upload from 'antd/lib/upload'
import Icon from 'antd/lib/icon'
import Modal from 'antd/lib/modal'
import Spin from 'antd/lib/spin'

import message from 'antd/lib/message'

/**
 * 微信墙－图片墙
 */
@Form.create()
export default class PhotoWallComp extends React.Component {
	static propTypes = {
		picType: PropTypes.string.isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		assetsUrl: PropTypes.string.isRequired
	}

	state = {
		img_url: ''
	}

	static contextTypes = {
		getSid: PropTypes.func.isRequired
	}

	uploadFile(file) {
		this.props.actions.uploadFile(file).then(resolve => {
			const sid = this.context.getSid()
			const { filename: name, file_url: imgurl } = resolve.result
			this.props.actions.addPhoto({
				name,
				imgurl
			}, sid).then(resolve => message.success(resolve.errormsg))
		})
	}

	handleSave() {
		const type = this.props.form.getFieldValue('picType')
		const sid = this.context.getSid()
		this.props.actions.savePhotoOrigin(type, sid).then(response => message.success(response.errormsg))
	}

	render() {
		const formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 20
			}
		}

		const assetsUrl = this.props.assetsUrl
		const fileList = this.props.content.toJS().map(item => {
			item.url = assetsUrl + item.imgurl
			return item
		})
		const fileProps = {
			accept: 'image/*',
			listType: 'picture',
			beforeUpload: this.uploadFile.bind(this),
			fileList,
			onPreview: file => {
				window.open(file.url)
				// Modal.info({
				// 	title: file.name,
				// 	content: <img src={file.url} />
				// })
			},
			onRemove: file => {
				const sid = this.context.getSid()
				this.props.actions.deletePhoto(sid, file.id).then(response => message.success(response.errormsg))
				return false
			}
		}

		const typeProps = this.props.form.getFieldProps('picType', {
			initialValue: this.props.picType
		})

		return (
			<Spin spinning={this.props.loading}>
				<PreviewButton action="picture"/>
				<div className="toolbar">
					<Button type="primary" onClick={::this.handleSave} loading={this.props.btnLoading}>保存</Button>
				</div>
				<div className="pure-form">
					<Form horizontal >
						<FormItem
							label="图片来源："
							{...formItemLayout}
						>
							<RadioGroup {...typeProps}>
								<Radio key="b" value="localPic">本地图片</Radio>
								<Radio key="a" value="wallPic">上墙图片</Radio>
							</RadioGroup>
						</FormItem>
						{{
							localPic: (
								<FormItem
									{...formItemLayout}
								>
                                    <span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</span>
									<Upload {...fileProps} className="wall-photo-list">
										<Button type="ghost">
											<Icon type="upload" /> 点击上传
										</Button>
									</Upload>
								</FormItem>
							) 
						}[this.props.form.getFieldValue('picType')]}
						
					</Form>
				</div>
			</Spin>
			
		)
	}
}