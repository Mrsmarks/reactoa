import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import img from 'Application/resources/404.png'
import styles from './index.scss'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Modal from 'antd/lib/modal'
import Key from 'Application/decorators/key'

const FormItem = Form.Item
const Option = Select.Option
/**
 * 微信墙－活动统计-投票结果
 */
@Key(['content'])
@Form.create()
export default class ScreenComp extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			visible: false
		}
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		getSid: PropTypes.func.isRequired
	}

	handleSearch(e) {
		e.preventDefault()
    	this.props.form.validateFields((errors, values) => {
    		const id = this.context.getSid()
	      	if (!!errors) {
		        return
	      	}
	      	this.context.router.push({
				pathname: '/wall-details/data-vote/index',
				query: {
					...values,
					id
				}
			})
			this.props.actions.fetchVoteList({...values, id})
    	})
	}

	fetchPeople(vote_detail_id) {
		const sid = this.context.getSid()
		this.props.actions.fetchVotePeople(sid, vote_detail_id).then(resolve => {
			this.setState({
				visible: !this.state.visible,
			})
		})
	}


	toggleModal() {
		this.setState({
			visible: !this.state.visible,
		})
	}

	renderToolbar() {
		const { getFieldProps } = this.props.form
		const select = this.props.select.toJS()
		const { vote_id } = this.context.location.query
		const voteProps = getFieldProps('vote_id', {
			initialValue: vote_id || '1',
		})
		return(
			<div className='toolbar'>
				<Form inline >
					<FormItem>
						<Select {...voteProps} allowClear placeholder="请选择" style={{width: 150}}>
							{
								select.map(item => {
									return (
										<Option key={item.id} value={item.id}>
											{item.name}
										</Option>
									)
								})
							}
						</Select>
					</FormItem>
					<Button size="default" type="primary" onClick={::this.handleSearch}>
						<Icon type="search"/>
						查询
					</Button>
				</Form>
			</div>
		)
	}


	renderList() {
		const list = this.props.content.toJS()
		const content = list.length > 0? <ul className={styles['container']}>
				{
					list.map(item => {
						return(
							<li key={item.key} className={styles['items']}>
								<div className={styles['intro']}>
									<img className="head-img"src={item.option_img? this.props.assetsUrl + item.option_img: img}/>
									<span className={styles['name']}>{item.option_name}</span>
								</div>
								<span style={{width: "30%"}}><i className={styles['b-font']}>{item.num}</i> 票</span>
								<div>
									<a onClick={this.fetchPeople.bind(this, item.vote_detail_id)} style={{marginRight: 100}}>查看投票人</a>
								</div>
							</li>
						)
					})
				}
			</ul>: <div  className={styles['no-data']}>没 有 投 票 数 据</div>
		return(
			<div hidden={this.props.pending}>{content}</div>
		)
	}

	renderVoterList() {
		const people = this.props.people.toJS()
			return(
				<div className={styles['check-vote']}>
					{
						people.map((item, index) => {
							return(
								<div style={{textAlign:'center'}} key={index}>
									<img className="head-img" src={item.imgurl? this.props.assetsUrl + item.imgurl: img}/>
									<div >{item.nick_name}</div>
								</div>
							)
						})
					}
				</div>
			)
	}

	renderModal() {
		return(
			<Modal 
				title={"选项："}
				visible={this.state.visible}
				cancelText='返回'
				width={500}
				onCancel={::this.toggleModal}
				onOk={::this.toggleModal}
			>
				{this.renderVoterList()}
			</Modal>
		)
	}

	render() {

		return (
			<div>
				{this.renderToolbar()}
				{this.renderList()}
				{this.renderModal()}
			</div>
			
		)
	}
}