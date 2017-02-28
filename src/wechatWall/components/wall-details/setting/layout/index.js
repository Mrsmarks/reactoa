import React, { PropTypes } from 'react'
import Immutable from 'immutable'


import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'


import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

import Popconfirm from 'antd/lib/popconfirm'
import message from 'antd/lib/message'

import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'
import AddModal from './addModal'
import EditModal from './editModal'
import SeeModal from './seeModal'
import image404 from 'Application/resources/404.png'
const FormItem = Form.Item

@Key(['content'])
@Form.create()
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			info:{},
			visible_1: false,
			visible_2: false,
			visible_3: false
		}
	}

	static propTypes= {
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		content: PropTypes.instanceOf(Immutable.List).isRequired,
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

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/wall/activity-layout/index',
			query: query
		})
		this.props.actions.settingLayoutList(query)
	}

	handleAdd(info) {
		this.props.actions.addLayoutList(info).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_1: false })
		})	
	}

	handleUpdate(info, id) {
		this.props.actions.updateLayoutList(info, id).then(resolve => {
			message.success(resolve.errormsg)
			this.setState({ visible_2: false, info: resolve.result })
		})	
	}

	handleRemove(id) {
		this.props.actions.delLayoutList(id).then(resolve => {
			message.success(resolve.errormsg)
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		return (
			<div className="toolbar">
				<Form inline >
					<Button onClick={() => {this.toggleModal(undefined,'visible_1')}} type="primary">
						<Icon type="plus" />
						添加样式布局
					</Button>
				</Form>				
			</div>
		)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const assetsUrl = this.props.assetsUrl
		const handleRemove = id => _ => {
			return this.handleRemove(id)
		}

		const toggleModal = (obj, visible, cb) => _ => {
			return this.toggleModal(obj, visible, cb)
		}

		const columns = [{
			title: '布局名称',
			dataIndex: 'name',
			key: 'name'
		}, {
			title: '缩略图',
			dataIndex: 'thumb',
			key: 'thumb',
			render(url, obj) {
				return(
					<img className='head-img'src={url? assetsUrl + url: image404}/>
				)
			}
		},{
			title: '操作',
			key: 'operation',
			render(_, obj) {
				return (
					<div>
						<a onClick={toggleModal(obj, 'visible_3')} style={{paddingRight:5}}>查看</a>
						<a onClick={toggleModal(obj, 'visible_2')} style={{paddingRight:5}}>编辑</a>
						<Popconfirm title="确定要删除吗？" onConfirm={handleRemove(obj.id)}>
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

		return (
			<Table 
				dataSource={dataSource}
				columns={columns}
				pagination={ pagination }
				loading={this.props.loading}
			/>
		)
	}

	render() {
        
		return (
			<div>
				{this.renderToolbar()}
				{this.renderTable()}
				<AddModal
					toggle={::this.toggleModal}
					visible={this.state.visible_1}
					addLoading={this.props.addLoading}
					handleAdd={::this.handleAdd}
					uploadFile={this.props.actions.uploadFile}
					fileLoading={this.props.fileLoading}
					assetsUrl={this.props.assetsUrl}
				/>
				<EditModal
					toggle={::this.toggleModal}
					visible={this.state.visible_2}
					updateLoading={this.props.updateLoading}
					handleUpdate={::this.handleUpdate}
					uploadFile={this.props.actions.uploadFile}
					fileLoading={this.props.fileLoading}
					assetsUrl={this.props.assetsUrl}
					info={this.state.info}				
				/>
				<SeeModal
					toggle={::this.toggleModal}
					visible={this.state.visible_3}
					info={this.state.info}
					assetsUrl={this.props.assetsUrl}					
				/>
			</div>
		)
	}
}