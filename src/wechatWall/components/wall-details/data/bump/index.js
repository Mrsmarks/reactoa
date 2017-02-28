import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import Pagination from 'antd/lib/pagination'
import img from 'Application/resources/404.png'
import love from 'Application/resources/bump.png'
import styles from './index.scss'
/**
 * 微信墙－活动统计-对对碰
 */
export default class ScreenComp extends React.Component {

	constructor(props, context) {
		super(props, context)
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
			pathname: '/wall-details/function-mstching/index',
			query: query
		})
		this.props.actions.fetchBumpList(query)
	}

	renderBump() {
		const list = this.props.content.toJS()
		return(
			<div className={styles['container']}>
				{
					list.map((item, index) => {
						return(
							<div key={item.id} className={styles['item']}>
								<div>
									<i className={styles['sort']}>{index+1}</i>
									<img className={styles['circle-img']} src={item.first_img} />
									<div>{item.first_name}</div>
								</div>
								<img style={{width: 20,height: 20, marginTop: -15}} src={love}/>
								<div>
									<img className={styles['circle-img']} src={item.second_img} />
									<div>{item.second_name}</div>
								</div>
							</div>
						)
					})
				}
			</div>
		)
	}

	renderPagination() {
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

		return(
			<div className="pagination">
				<Pagination {...pagination}/>
			</div>
		)
	}

	render() {
		const list = this.props.content.toJS()
		return (
			<div hidden={this.props.pending}>
				{
					!list.length? 
					<div  className={styles['no-data']}>没有对对碰数据</div>:
					<div >
						{this.renderBump()}
						{this.renderPagination()}
					</div>
				}
				
				
			</div>
			
		)
	}
}