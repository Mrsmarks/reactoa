import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import { Link } from 'react-router'
import Form from 'antd/lib/form'
import styles from './index.scss'
import Input from 'antd/lib/input'
import Upload from 'antd/lib/upload'
import Modal from 'antd/lib/modal'
import Popconfirm from 'antd/lib/popconfirm'
import Popover from 'antd/lib/popover'
import message from 'antd/lib/message'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
import IconFont from 'Application/components/iconFont'
import Row from 'antd/lib/row'

const FormItem = Form.Item


@Key(['content'])
@Form.create()
export default class ManagementComp extends React.Component{

	constructor(props, context) {
		super(props, context)
		this.state ={
			visible: false,
			popover: false,
			del_list:[],
			selectedRowKeys:[]
		}
	}

	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired
	}

	toggleModal(info, visible, cb) {
		if(info) {
			if(cb) {
				cb(info)
			}
			this.setState({
				[visible]: !this.state[visible],
				info: info
			})
		}else{
			this.setState({
				[visible]: !this.state[visible],
			})
		}	
	}


	handleConfirm(id) {
		const params = this.props.params.toJS()
		this.props.actions.delWordList(id).then(reslove => {
			if(!reslove.errorcode) {
				message.success(reslove.errormsg)
			}
		})
	}

	handlePopover() {
		this.setState({
			popover: !this.state.popover
		})
	}


	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
	      	if (!!errors) {
		        return
	      	}
	      	const text = values.text
	      	const page = 1
	      	const id = this.context.location.query.id
	      	this.context.router.push({
				pathname: '/wall-details/screen-ctrl-word/index',
				query: {
					page,
					text,
					id, 
				}
			})
			this.props.actions.getWordList({page, text, id})
    	})
	}

	uploadFile(file) {
		const id = this.context.location.query.id
		this.props.actions.uploadExcelFile(file, '/wechatWall/wechat-wall-sensitive/batch?sid='+id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	handelSubmit(e) {
		const id = this.context.location.query.id
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
    		if(!!errors) {
    			return
    		}
    		const text = values.texts.replace(/，/g, ",")
    		this.props.actions.addWordList(text, id).then(resolve => {
    			message.success(resolve.errormsg)
    			this.setState({
    				popover: !this.state.popover
    			})
    		})
    	})
	}

	removeWords() {
		const sid = this.context.location.query.id
		this.props.actions.delWordsList(sid, this.state.del_list.join(',')).then(resolve => {
			message.success(resolve.errormsg)
			this.props.actions.getWordList(this.context.location.query)
		})
	}


	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall-details/screen-ctrl-word/index',
			query: query
		})
		this.props.actions.getWordList(query)
	}

	onChangeCheck(selectedRowKeys, selectedRows) {
	  	const ids = selectedRows.map(item => item.id)
	    this.setState({
	    	del_list: ids,
	    	selectedRowKeys: selectedRowKeys
	    })
	  }

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const dataExportProps = {
			beforeUpload: this.uploadFile.bind(this),
		}
		const content = (
			<div>
		 		<Form horizontal style={{width: 300, height: 180, marginTop:5}}>
		        	<FormItem>
			          <Input  {...getFieldProps('texts', { rules: [{
                        required: true, message: '请输入敏感词'
                      }] })} type="textarea" rows="6"/>
			        </FormItem>
			        <Button style={{float: "right"}} type="primary" size="default" onClick={::this.handelSubmit}>提交</Button>
				</Form>
			</div>
		)
		const title = (
			<div>
		 		<div onClick={::this.handlePopover} className={styles['icon-close']}><IconFont type="icon-close"/></div>
				添加多个敏感词以逗号隔开
				<Upload {...dataExportProps}>
					<a style={{marginLeft: 5}}>批量导入包(*.txt格式)</a>
				</Upload>

			</div>
		)
		return (
			<div style={{marginBottom: 12}}>
				<Row>
					<Form inline >
						<Popover 
							content={content} 
							title={title}
							placement="bottomLeft"
							trigger="click"
							visible={this.state.popover}
							>
							<Button  type="primary" onClick={::this.handlePopover}>
								<Icon  type="plus" />
								添加敏感词
							</Button>
						</Popover>
						<span style={{marginLeft: 5}}></span>	
						<FormItem label="敏感词：">
							<Input {...getFieldProps('text')}/>
						</FormItem>
						<Button onClick={::this.handleSearch} type="ghost" >
							<Icon  type="search" />
							 查询
						</Button>
					</Form>	
				</Row>
				<Row style={{marginTop: 6}}>
					<Button onClick={::this.removeWords} type="ghost" >
						<Icon  type="setting" />
						 批量删除敏感词
					</Button>
				</Row>		
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const toggleModal = (obj, visible) => _ => {
			this.toggleModal(obj, visible)
		}
		const handleConfirm = id => _ =>{
			return this.handleConfirm(id)
		}
		const columns = [{
			title: '敏感词',
			dataIndex: 'text',
			key: 'text',
		},{
			title: '操作',
			key: 'operation',
			render(status, obj) {
				return (
					<div>
						<Popconfirm title="确定要删除吗？" onConfirm={handleConfirm(obj.id)}>
							<a>删除</a>
						</Popconfirm>
					</div>
				)
			}
		}]

		const params = this.props.params.toJS()
		const pagination = {
			total: +params.count,
			current: +params.page,
			onChange: ::this.handlePageChange,
			showSizeChanger: true,
			pageSize: +params.psize,
			onShowSizeChange: ::this.handlePageChange,
			showTotal: function() {
				return `共${params.count}条`
			}.bind(this)
		}
		const selectedRowKeys = this.state.selectedRowKeys
		const rowSelection = {
			selectedRowKeys,
		    onChange: this.onChangeCheck.bind(this)
		}


		return (
			<Table 
				dataSource={dataSource}
				columns={columns}
				pagination={pagination}
				loading={this.props.loading}
				rowSelection={rowSelection}
			/>
		)
	}

	render() {
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
			</div>
		)
	}
}