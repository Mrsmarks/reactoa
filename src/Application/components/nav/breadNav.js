import React, { PropTypes } from 'react'
import Breadcrumb from 'antd/lib/breadcrumb'
const Item = Breadcrumb.Item

export default class BreadNav extends React.Component {

	static contextTypes = {
		routes: PropTypes.array.isRequired,
		location: PropTypes.object.isRequired
	}

	render() {
		const routes = this.context.routes
		const size = routes.length

		return (
			<Breadcrumb>
				{
					routes.map((item, key) => {
						let name = item.name
						let noHref = false

						if (typeof item.getName === 'string') {
							name = this.context.location.query[item.getName]
							noHref = true
							if (!name) {
								return <span key={key}></span>
							}
						} else if (!name) {
							return <span key={key}></span>
						}
						// 最后一个面包🍞，不可以点击
						if (key + 1 === size || noHref) {
							return <Item key={key} href="javascript:;">{name}</Item>
						} else {
							const path = item.path.replace(/\(\/:[a-z|A-Z]+\)/g, '')

							// item.search 是从｀/routes/index.js｀的onChange方法传进来的
							return <Item key={key} href={`#${path}${item.search || ''}`}>{name}</Item>
						}
					})
				}
			</Breadcrumb>
		)
	}
}