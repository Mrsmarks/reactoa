import styles from './sideNav.scss'
import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import { Link } from 'react-router'
import { Menu, Icon } from 'antd'
import IconFont from '../iconFont'
const SubMenu = Menu.SubMenu
const Item = Menu.Item
export default class SideNav extends React.Component {
	static propTypes = {
		route: PropTypes.object.isRequired
	}

	static contextTypes = {
		router: PropTypes.object.isRequired,
		routes: PropTypes.array.isRequired,
		location: PropTypes.object.isRequired,

		logo: PropTypes.string.isRequired,

		sideNav: PropTypes.object.isRequired
	}

	state = {}

	constructor(props, context) {
		super(props, context)
	}


	walkByKey(routes, key) {
		let ret
		routes.some(item => {
			if (ret) {
				return true
			}
			if (item.key == key) {
				ret = item
			} else if (item.children) {
				ret = this.walkByKey(item.children, key)
			}
		})
		return ret
	} 

	findRouteByKey(key) {
		const route = this.props.route
		return this.walkByKey(route.children, key)
	}


	handleClick(e) {
		this.context.sideNav.updateSelectedKey(e.key, () => {
			const item = this.findRouteByKey(e.key)
			this.context.router.push({
				pathname: item.path,
				query: item.query
			})
		})
	}

	handleOpen({ openKeys }) {
		this.context.sideNav.updateOpenKeys(openKeys)
	}

	componentWillMount() {
		this.context.sideNav.updateState(this.props.route, true)
	}

    getIcon(name) {
        if (/iconfont@/g.test(name)) {
            name = name.split('@')[1]
            return <IconFont type={name} style={{ marginRight: 8 }}/>
        }
        return <Icon type={name} />
    }
	
	render() {

		const children = this.props.route.children
		let openKeys = []
		let selectedKeys = []
		if (this.context.sideNav.key === this.props.route.key) {
			openKeys = this.context.sideNav.openKeys
			selectedKeys = this.context.sideNav.selectedKeys
		}
		return (
			<aside id="aside" className={styles.sider}>
				<div className={styles.logo} style={{backgroundImage: `url(${this.context.logo})`}}></div>
				<div className={styles.scroll}>
					<Menu 
					id="asideMenu"
					onClick={::this.handleClick}
					onOpen={::this.handleOpen}
					onClose={::this.handleOpen}
					mode="inline" 
					theme="dark"
					openKeys={openKeys}
					selectedKeys={selectedKeys}
				>

					{
						children.map(item1 => {
							// 有三级路由
							if (item1.children) {
								return (
									<SubMenu key={item1.key} title={<span>{this.getIcon(item1.icon)}{item1.name}</span>}>
										{
											item1.children.map(item2 => {
												return (
													<Item key={item2.key}>{this.getIcon(item2.icon)}{item2.name}</Item>
												)
											})
										}
									</SubMenu>
								)
							// 没有三级路由
							} else {
								return (
									<Item key={item1.key}>{this.getIcon(item1.icon)}{item1.name}</Item>
								)
							}
							
						})
					}
					
				</Menu>
				</div>
			</aside>
		)
		
	}
}