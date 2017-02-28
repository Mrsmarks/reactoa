import React, { PropTypes } from 'react'
import styles from './edit.scss'
import Immutable from 'immutable'

import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'

import Spin from 'antd/lib/spin'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Col from 'antd/lib/col'
import Row from 'antd/lib/row'

import Popconfirm from 'antd/lib/popconfirm'
import Checkbox from 'antd/lib/checkbox'
import Upload from 'antd/lib/upload'
import message from 'antd/lib/message'

import Auth from 'Application/components/auth'

import Editor from './editor'

const FormItem = Form.Item

const defaultPic = require('Application/resources/picture.png')

@Form.create()
export default class PictureEditComp extends React.Component {
	static propTypes = {
		globalLoading: PropTypes.bool.isRequired,
		saveLoading: PropTypes.bool.isRequired,

		content: PropTypes.instanceOf(Immutable.Map).isRequired,

		assetsUrl: PropTypes.string.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {
		checked: false,
		expandedRowKeys: [],
		lastEditData: {
			title: '',
			author: '', 
			artFrom: '', 
			summary: ''
		},
		editData: [/*{
			src: defaultPic,
			title: '11111111111',
			author: 'lidm',
			content: 'test1',
			fromChecked: false,
			fromURL: '',
			displaySrc: false,
			summary: '',
			displaySrcChecked: false,

			sort: 1,
			key: 1
		}*/]
	}

	addRow() {
		const editData = this.state.editData
		const data = {
			coverImg: defaultPic,
			title: '',
			author: '',
			content: '',
			fromChecked: false,
			artFrom: '',
			// displaySrc: false,
			summary: '',
			displayCover: false,
			key: editData.length + 1
		}
		let sort
		if (!editData.length) {
			sort = 1
		} else {
			editData.sort((a, b) => a.sort - b.sort)
			sort = editData[editData.length-1].sort + 1
		}
		data.sort = sort
		editData.push(data)
		this.setState({
			editData
		})
	}

	saveMaterial() {
		this.props.form.validateFields((errors, values) => {
			if (errors) {
				return
			}

			if (this.state.expandedRowKeys.length) {
				this.saveEditData(this.state.expandedRowKeys[0])
			}

			const ret = this.state.editData.some(item => {
				if (item.coverImg.indexOf('base64') > -1 || !item.title || !item.author || !item.content) {
					message.error('标题,封面图,作者,图文内容不可以为空')
					return true
				}
			})
			if (ret) {
				return ret
			}
			
			const postData = {
				name: values.name,
				content: JSON.stringify(this.state.editData)
			}

			let [act, id] = ['add', 0]
			if (this.props.content.size) {
				act = 'update'
				id = this.props.content.get('id')
			}


			this.props.actions.saveMaterial({ postData, act, id }).then(x => {
				message.success(x.errormsg)
				this.context.router.replace('/wechat/picture-material/list')
			})
		})
	}

	onMove(type, key) {
		const data = this.state.editData

		data.some((item, index) => {
			if (item.key === key) {
				const ds = index + {up: -1, down: 1}[type]
				const next = data[ds]
				const sort = item.sort
				const nextSort = next.sort
				next.sort = sort
				item.sort = nextSort
				data.sort((a, b) => a.sort - b.sort)
				this.setState({
					editData: data
				})
				return true
			}
		})
	}

	onRemove(key) {
		this.setState({
			editData: this.state.editData.filter(item => item.key !== key)
		})
	}

	setCheckbox(name, record, e) {
		this.saveEditData()

		let editData = this.state.editData
		editData = editData.map(item => {
			if (item.key === record.key) {
				item[name] = e.target.checked
			}
			return item
		})
		this.setState({
			editData
		})
	}

	saveEditData(key = this.state.expandedRowKeys[0]) {
		const editData = this.state.editData.map(item => {
			if (item.key === key) {
				const values = { ...item, ...this.state.lastEditData }
				item.title = values.title
				item.author = values.author
				item.summary = values.summary
				item.artFrom = item.fromChecked ? values.artFrom : ''

				item.content = Editor.getContent()
			}
			return item
		})
		this.setState({
			editData
		})
	}

	uploadCover(record, file) {
		this.props.actions.uploadFile(file).then(x => {
			const editData = this.state.editData
			editData.map(item => {
				if (item.key === record.key) {
					item.coverImg = this.props.assetsUrl + x.result.file_url
				}
				return item
			})
			this.setState({
				editData
			})
			message.success(x.errormsg)
		})
	}

	handleChange(name, e) {
		const obj = this.state.lastEditData
		this.setState({
			lastEditData: {
				...obj,
				[name]: e.target.value
			}
		})
	}

	uploadImg(record, e) {
		this.props.actions.uploadFile(e.target.files[0]).then(x => {
			message.success(x.errormsg)
			const url = this.props.assetsUrl + x.result.file_url
			let editData = this.state.editData

			editData = editData.map(item => {
				if (item.key === record.key) {
					item.content = Editor.getContent() + `<img src="${url}" style="max-width: 100%;"/>`
				}

				return item
			})

			this.setState({
				editData
			})
		})
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.expandedRowKeys.length) {
			const key = this.state.expandedRowKeys[0]
			const editData = this.state.editData.map(item => {
				if (item.key === key) {
					item.content = Editor.getContent()
				}
				return item
			})
			
			this.setState({
				editData
			})
		}

		// 将编辑数据保存到state
		if (nextProps.content !== this.props.content) {
			try {
				this.setState({
					editData: JSON.parse(nextProps.content.get('content'))
				})
			} catch (e) {
				console.error('JSON解析失败', e)
			}
		}
	}

	renderEditor(record) {
		let fileList = []
		if (record.coverImg) {
			fileList.push({
				url: record.coverImg,
				status: 'done',
				uid: -1
			})
		}

		const uploadProps = {
			listType: 'picture-card',
			beforeUpload: this.uploadCover.bind(this, record),
			fileList
		}

		return (
			<div>
				<Row className={styles.row}>
					<Col span="24">
						<p>标题：</p>
						<input value={this.state.lastEditData.title || record.title} onChange={this.handleChange.bind(this, 'title')} className={styles.input} type="text"/>
					</Col>
				</Row>
				<Row className={styles.row}>
					<Col span="24">
						<p>作者：</p>
						<input value={this.state.lastEditData.author || record.author} onChange={this.handleChange.bind(this, 'author')} className={styles.input} type="text"/>
					</Col>
				</Row>
				<Row className={styles.row}>
					<Col span="24">
						<p>正文：</p>
						<Editor
							record={record}
							uploadImg={this.uploadImg.bind(this, record)}
						/>
					</Col>
				</Row>
				<Row className={styles.row}>
					<Col span="24">
						<label>
	    	        		<Checkbox checked={record.fromChecked} onChange={this.setCheckbox.bind(this, 'fromChecked', record)}/>
	    	        		原文链接：
	    	        	</label>
						<input value={this.state.lastEditData.artFrom || record.artFrom} onChange={this.handleChange.bind(this, 'artFrom')} className={styles.input} type="text" style={{width: 527}} disabled={!record.fromChecked}/>
					</Col>
				</Row>
				<Row className={styles.row}>
					<Col span="24">
						<p>封面：</p>
						<Upload {...uploadProps}>
							<Icon type="plus" />
							<div className="ant-upload-text">上传封面</div>
						</Upload>
						<div>
							<label>
		    	        		<Checkbox checked={record.displayCover} onChange={this.setCheckbox.bind(this, 'displayCover', record)}/>
		    	        		封面图片显示在正文中
		    	        	</label>
		    	        </div>
					</Col>
				</Row>
				<Row className={styles.row}>
					<Col span="24">
						<p>摘要：</p>
						<input value={this.state.lastEditData.summary || record.summary} onChange={this.handleChange.bind(this, 'summary')} className={styles.input} type="text"/>
					</Col>
				</Row>
			</div>
			
		)

		
		
	}

	renderTable() {
		const dataSource = this.state.editData

		const styles = { width: 20, display: 'inline-block', textAlign: 'center' }
		const onMove = (type, key) => _ => {
			this.onMove(type, key)
		}
		const up = <Icon type="arrow-up" />
		const down = <Icon type="arrow-down" />
		const onRemove = key => _ => {
			this.onRemove(key)
		}

		const isEdit = !!this.props.content.size

		const columns = [{
			title: '封面图',
			dataIndex: 'coverImg',
			key: 'coverImg',
			render(coverImg) {
				return <img src={coverImg} width={100} style={{borderRadius: 4}}/>
			}
		}, {
			title: '标题',
			dataIndex: 'title',
			key: 'title'
		},  {
			title: '作者',
			dataIndex: 'author',
			key: 'author',
		}, {
			title: '操作',
			key: 'operation',
			render(_, obj, index) {
				return (
					<div>
						<Popconfirm title="确认删除吗？" onConfirm={onRemove(obj.key)}>
							<a disabled={!!isEdit}>删除</a>
						</Popconfirm>
						{dataSource.length > 1 && (index !== 0 ? <a onClick={onMove('up', obj.key)} style={styles}>{up}</a> : <a onClick={onMove('down', obj.key)} style={styles}>{down}</a>)}
						{dataSource.length > 1 && (index !== 0 && index !== dataSource.length - 1 && <a onClick={onMove('down', obj.key)} style={styles}>{down}</a>)} 
					</div>
				)
			}
		}]

		/**
		 *  case keys.length === 2，then
		 *  keys[0] 即将关闭展开的行
		 *  keys[1] 即将要展开的行
		 *
		 * 	case keys.length === 1，then
		 * 	keys[0] 即将要展开的行
		 */
		function onExpaned(keys) {
			if (keys.length === 2 && keys[0]) {
				this.saveEditData(keys[0])
			} else if (keys.length === 0 && this.state.expandedRowKeys[0]) {
				this.saveEditData(this.state.expandedRowKeys[0])
			}

			this.setState({
				expandedRowKeys: [keys[1] || keys[0]],
				lastEditData: {}
			})
		}

		return (
			<Table 
				dataSource={dataSource}
				expandedRowKeys={this.state.expandedRowKeys}
				expandedRowRender={record => this.renderEditor(record)}
				onExpandedRowsChange={onExpaned.bind(this)}
				columns={columns}
				pagination={false}
			/>
		)
	}


	render() {
		const { getFieldProps } = this.props.form
		const content = this.props.content
		const nameProps = getFieldProps('name', {
			rules: [
		       { required: true, message: '请输入名称' },
			],
			initialValue: content.get('name')
		})

		const btnName = content.size ? '更新' : '保存'


		return (
			<Spin spinning={this.props.globalLoading}>
				<div className="toolbar">
					<Row>
						<Col span="12">
							<Form inline >
								<FormItem label="素材名称：">
				    	        	<Input 
				    	        		{...nameProps}
				    	        		type="text" 
				    	        		style={{width: 200}}
				    	        	/>
					        	</FormItem>
							</Form>	
						</Col>
						<Auth 
							type={["wechat-txt-material-update"]}
							dpid={content.get('dpid')}
							nid={content.get('nid')}
							cpid={content.get('cpid')}
							uid={content.get('create_user')}
						>
							<Col span="12" style={{textAlign: 'right'}}>
								<Button loading={this.props.saveLoading} type="primary" onClick={::this.saveMaterial}>{btnName}</Button>
								{' '}
								<Button disabled={!!content.size || this.state.editData.length === 5} onClick={::this.addRow}>添加一个图文</Button>
							</Col>
						</Auth>
						
					</Row>
					
				</div>

				{this.renderTable()}

				
			</Spin>
		)
	}
}