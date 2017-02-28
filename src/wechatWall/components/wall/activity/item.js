import React, { PropTypes } from 'react'
import style from './item.scss'
import Immutable from 'immutable'

import classnames from 'classnames'
import { Link } from 'react-router'
import Menu from 'antd/lib/menu'
const MenuItem = Menu.Item
import Dropdown from 'antd/lib/dropdown'
import Pagination from 'antd/lib/pagination'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Form from 'antd/lib/form'
const FormItem = Form.Item
import Input from 'antd/lib/input'
import Modal from 'antd/lib/modal'
import DatePicker from 'antd/lib/date-picker'
const RangePicker = DatePicker.RangePicker
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'
import Popover from 'antd/lib/popover'
import Spin from 'antd/lib/spin'

import QRCode from 'qrcode.react'

import IconFont from 'Application/components/iconFont'

import formatDate from 'Application/utils/formatDate'
const formatType = 'yyyy-MM-dd hh:mm:ss'
import Key from 'Application/decorators/key'
import { bigScreenUrl } from 'Application/constants/config'


// import moment from 'moment'
// window.moment = moment

// setInterval(function() {
// 	window.result = moment.duration(moment('2018-06-24 10:00:00').diff(moment(+new Date)))
// }, 1000)

@Form.create()
@Key(['content'])
export default class ActivityItemComp extends  React.Component {
	static propTypes = {
		content: PropTypes.instanceOf(Immutable.List).isRequired,
		params: PropTypes.instanceOf(Immutable.Map).isRequired,
		actions: PropTypes.object.isRequired,
		editLoading: PropTypes.bool.isRequired,
		loading: PropTypes.bool.isRequired,
        frontedDomain: PropTypes.string.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	state = {
		dataCompleted: false,
		addModalVisible: false,
        copyModalVisible: false,
		page: 1,
		psize: 10
	}

	constructor() {
		super()
		this.scrollEvent = this.scrollEvent.bind(this)
	}

	removeScrollEvent() {
		document.body.querySelector('.container').removeEventListener('scroll', this.scrollEvent)
	}

	scrollEvent(e) {
		const timelineTarget = document.getElementById('timeline-wrap')
		if (this.props.loading || this.props.content.size >= this.props.params.get('count')) {
			return
		}

		if (e.target.scrollTop + e.target.offsetHeight + 200 > timelineTarget.offsetHeight) {
			this.setState({
				page: this.state.page + 1
			})
			this.props.actions.fetchActivityList({
				type: this.props.type,
				page: this.state.page
			}).then(response => {
				if (this.props.content.size >= response.result.count) {
					this.removeScrollEvent()
					this.setState({
						dataCompleted: true
					})
				}
			})
		}
	}

	shownAddModal() {
		this.setState({
			addModalVisible: true
		})
	}

	hideAddModal() {
		this.setState({
			addModalVisible: false
		})
	}

    shownCopyModal(id) {
        this.setState({
            copyId: id,
            copyModalVisible: true
        })
    }

    hideCopyModal() {
        this.setState({
            copyModalVisible: false
        })
    }

	componentDidMount() {
		document.body.querySelector('.container').addEventListener('scroll', this.scrollEvent)
	}

	componentWillUnmount() {
		this.removeScrollEvent()
	}

    saveCopyActivity() {
        this.props.form.validateFields(['copyDate'], (err, values) => {
            if (err) {
                return
            }
            const postData = {
                start_time: formatDate(values.copyDate[0], formatType),
                end_time: formatDate(values.copyDate[1], formatType),
                id: this.state.copyId
            }
            
            this.props.actions.copyActivity(postData).then(response => {
                message.success(response.errormsg)
                this.hideCopyModal()
                this.props.form.resetFields()
            })
        })
    }

	saveActivity() {
		this.props.form.validateFields(['activity_name', 'date'], (err, values) => {
			if (err) {
				return
			}

			const postData = {
				activity_name: values.activity_name,
				start_time: formatDate(values.date[0], formatType),
				end_time: formatDate(values.date[1], formatType)
			}
			
			this.props.actions.editActivity(postData).then(response => {
				message.success(response.errormsg)
				this.hideAddModal()
				this.props.form.resetFields()
			})
		})
	}

	handleRemove(id) {
		Modal.confirm({
			title: '您是否确认删除该活动',
			onOk: () => {
				this.props.actions.deleteActivity({
					id
				}, 'delete')
			}
		})
	}

    handleCopy(id) {

    }

	handleSearch() {
		const name = this.props.form.getFieldValue('searchName')

		const query = {
			type: this.props.type,
			page: 1,
			name
		}
		this.context.router.push({
			pathname: this.props.pathname,
			query
		})

		this.props.actions.fetchActivityList(query)
	}

	renderModal() {
		const formItemLayout = {
			labelCol: {
				span: 6
			},
			wrapperCol: {
				span: 18
			}
		}

		const { getFieldProps } = this.props.form
		const nameProps = getFieldProps('activity_name', {
			rules: [
				{ required: true, message: '请输入活动名称' }
			]
		})

		const dateProps = getFieldProps('date', {
			rules: [
				{ type: 'array', required: true, message: '请选择生效时间' }
			]
		})

		return (
			<Modal
				title="添加活动"
				visible={this.state.addModalVisible}
				onCancel={::this.hideAddModal}
				onOk={::this.saveActivity}
				confirmLoading={this.props.editLoading}
			>
				<Form horizontal >
					<FormItem 
						label="活动名称："
						{...formItemLayout}
					>
	    	        	<Input style={{ width: 300 }} {...nameProps}/>
		        	</FormItem>
					<FormItem 
						label="大屏幕生效时间："
						{...formItemLayout}
					>
	    	        	<RangePicker showTime style={{ width: 300 }} format="yyyy/MM/dd HH:mm:ss" {...dateProps}/>
		        	</FormItem>
					
				</Form>
			</Modal>
		)
	}

    renderCopyModal() {
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            }
        }

        const { getFieldProps } = this.props.form

        const dateProps = getFieldProps('copyDate', {
            rules: [
                { type: 'array', required: true, message: '请选择活动时间' }
            ]
        })

        return (
            <Modal
                title="完善活动信息"
                visible={this.state.copyModalVisible}
                onCancel={::this.hideCopyModal}
                onOk={::this.saveCopyActivity}
                confirmLoading={this.props.editLoading}
            >
                <Form horizontal >
                    <FormItem 
                        label="活动时间："
                        {...formItemLayout}
                    >
                        <RangePicker showTime style={{ width: 300 }} format="yyyy/MM/dd HH:mm:ss" {...dateProps}/>
                    </FormItem>
                </Form>
            </Modal>
        )
    }

	renderToolbar() {
		const searchNameProps = this.props.form.getFieldProps('searchName', {
			initialValue: this.props.params.get('name')
		})

		return (
			<div className="toolbar">
				<Form inline >
					<Button type="primary" onClick={::this.shownAddModal}>
						<Icon type="plus" />
						添加
					</Button>
					<span style={{marginLeft: 16}}></span>
					<FormItem label="活动名称：">
	    	        	<Input {...searchNameProps}/>
		        	</FormItem>
					<Button onClick={::this.handleSearch}>
						<Icon type="search" />
						 查询
					</Button>
				</Form>
			</div>
		)
	}

    renderWechatQrcode(config) {
        return (
            <div style={{ width: 300, padding: 16, textAlign: 'center' }}>
                <QRCode size={256} value={config.get('phone_url')} />
                <p style={{margin: '16px 0 8px'}}>上墙地址</p>
                <Input 
                    readOnly
                    size="large"
                    defaultValue={config.get('phone_url')}
                />
            </div>
        )
    }

	renderActivity() {
		// const content = this.props.content.map((item, index) => {
		// 	if (index == 2) {
		// 		return item.set('create_time', item.get('create_time') + 8640000 * 2)
		// 	}
		// 	if (index == 3) {
		// 		return item.set('create_time', item.get('create_time') + 86400000)
		// 	}
		// 	return item
		// })
		
		const comps = []
		let lastYear = null
		let	lastMonth = null
		this.props.content.forEach((item, index) => {
			const isOver = item.get('type') == 3
			const wrapCls = [style['item-wrap']]
			const caret = isOver ? <Icon type="caret-left" /> : <Icon type="caret-right" />
			const createDate = new Date(item.get('create_time') * 1000)
			const [_year, _month] = [createDate.getFullYear(), createDate.getMonth() + 1]
			if (_year !== lastYear || _month !== lastMonth) {
				comps.push(
					<div className={style['date-wrap']} key={item.get('create_time')}>
						<div className={style['date']}>
							<div className={style['year']}>{_year}</div>
							<div className={style['month']}>{_month}</div>
						</div>
					</div>
				)
			}
			lastYear = _year
			lastMonth = _month

			let statusIcon = null
			switch(+item.get('type')) {
				case 1:
					wrapCls.push(...[ style['left'], style['wait'] ] )
					statusIcon = <Icon type="loading" />
					break
				case 2:
					wrapCls.push(...[ style['left'], style['start'] ])
					statusIcon = <Icon type="caret-right" />
					break
				case 3:
					wrapCls.push(style['right'])
					statusIcon = <Icon type="minus-circle-o" />
					break

			}

			comps.push(
				<div className={wrapCls.join(' ')} key={item.get('id')}>
					<div className={style['item']}>
						<div className={style['header']}>
							<p className={style['title']}>{item.get('activity_name')}</p>
							<p>上墙人数：{item.get('wall_num')} 参与人数：{item.get('partake_num')}</p>
						</div>
						<div className={style['content']}>
                            <a href={`/site/screen-design?sid=${item.get('id')}`} target="_blank">
                                <Button type="ghost">
                                    <IconFont type="icon-design"/>
                                    <div className={style['button-text']}>屏幕设计</div>
                                </Button>
                            </a>
                            <a href={`${this.props.frontedDomain}${bigScreenUrl}?action=message&uniqueid=${item.get('unique_id')}`} target="_blank">
                                <Button type="ghost">
                                    <IconFont type="icon-screen"/>
                                    <div className={style['button-text']}>大屏幕</div>
                                </Button>
                            </a>
                            <Popover content={this.renderWechatQrcode(item)} title={<span style={{ fontSize: 14 }}><IconFont type="icon-wechat"/> 请用微信扫码参与微信墙</span>} trigger="click">
    							<Button type="ghost">
    								<IconFont type="icon-tpl"/>
    								<div className={style['button-text']}>上墙地址</div>
    							</Button>
                            </Popover>
							<Link to={{ pathname: '/wall-details/function-info/index', query: { wallName: item.get('activity_name'), id: item.get('id'), uniqueId: item.get('unique_id') } }}>
								<Button type="ghost">
									<IconFont type="icon-gongneng"/>
									<div className={style['button-text']}>活动功能</div>
								</Button>
							</Link>
							<Link to={{ pathname: '/wall-details/screen-ctrl-big/index', query: { wallName: item.get('activity_name'), id: item.get('id'), uniqueId: item.get('unique_id') } }}>
								<Button type="ghost">
									<IconFont type="icon-kongzhishu"/>
									<div className={style['button-text']}>屏幕控制台</div>
								</Button>
							</Link>
							<Link to={{ pathname: '/wall-details/data-activity/index', query: { wallName: item.get('activity_name'), id: item.get('id'), uniqueId: item.get('unique_id') } }}>
								<Button type="ghost">
									<IconFont type="icon-shujuyidong"/>
									<div className={style['button-text']}>活动数据</div>
								</Button>
							</Link>
						</div>
						<div className={style['caret']}>
							{ caret }
						</div>
					</div>
					<div className={style['circle']}></div>
					<div className={style['info']}>
						<p className={style['status']}>
							{ statusIcon }
							{' '}
							{{
								'1': '未开始',
								'2': '正在进行',
								'3': '已结束'
							}[item.get('type')]}
						</p>
						<p className={style['activity-date']}>
							<Icon type="calendar" /> 
							{' '}
							{formatDate(item.get('start_time') * 1000, formatType)} ～ {formatDate(item.get('end_time') * 1000, formatType)}
						</p>
					</div>
					<div className={style['operator-activity']}>
						<a onClick={this.shownCopyModal.bind(this, item.get('id'))}>复制</a>
						{' '}
						<a onClick={this.handleRemove.bind(this, item.get('id'))}>删除</a>
					</div>
				</div>
			)

		})

		return (
			<div>
				<div id="timeline-wrap" className={style['timeline-wrap']}>
					<div className={style['timeline-status']}>
						<div hidden={!this.props.loading}>
							<Spin spinning={true}></Spin>
							<p>加载中...</p>
						</div>
						<div hidden={!this.state.dataCompleted} className={style['timeline-completed']}> 
							<span className={style['completed-icon']}>
								<Icon type="check-circle-o" />
							</span>
							<p>没有更多活动啦！</p>
						</div>
					</div>
					{
						this.props.params.get('count') ?
							<div className={style['timeline-line']}></div> :
							<p className={style['nodata']}>暂无相关活动！</p>
					}
					{comps}
				</div>

			</div>
		)
	}

	render() {

		return (
			<div>
				{this.renderToolbar()}
				{this.renderActivity()}
				{this.renderModal()}
                {this.renderCopyModal()}
			</div>
		)
	}
}