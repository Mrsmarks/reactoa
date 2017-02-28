import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Table from 'antd/lib/table'
import Spin from 'antd/lib/spin'
import Form from 'antd/lib/form'
import Key from 'Application/decorators/key'
import Auth from 'Application/components/auth'

const FormItem = Form.Item

@Key(['content'])
@Form.create()
export default class GroupComp extends  React.Component {
	constructor(props, context) {
		super(props, context)
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

	handlePageChange(nextPage, pageSize) {
		const query = this.context.location.query
		if(pageSize){
			query.psize = pageSize
		}
		query.page = nextPage
		this.context.router.push({
			pathname: '/card/share/list',
			query: query
		})
		this.props.actions.fetchShareList(query)
	}

	renderTable() {
		const dataSource = this.props.content.toJS()
		const columns = [{
			title: '公众号',
			dataIndex: 'account_name',
			key: 'account_name'
		}, {
			title: '用户来源',
			key: 'orgin',
			render(_, obj) {
				var name = ''
				if(obj.wid) name='微信'
				if(obj.mid) name='会员'
				if(obj.pid) name='portal'
				if(!obj.wid && !obj.mid && !obj.pid) name='其他'
				return(
					<span>{name}</span>	
				)
			}
		}, {
			title: '手机号',
			dataIndex: 'mobile',
			key: 'mobile',
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
				{this.renderTable()}
			</div>
		)
	}
}