import React, { PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import styles from './card.scss'

import { DragSource, DropTarget } from 'react-dnd'

import Card from 'antd/lib/card'
import Col from 'antd/lib/col'


const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index
		}
	},

	endDrag(props) {
		props.endDrag()
	}
}

const cardTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
		  return
		}


		props.moveCard(dragIndex, hoverIndex)
		monitor.getItem().index = hoverIndex
	}
}


@DropTarget('card', cardTarget, connect => ({
	connectDropTarget: connect.dropTarget()
}))
@DragSource('card', cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
}))
export default class CardItem extends React.Component {
	static propTypes = {
		assetsUrl: PropTypes.string.isRequired,
		headimgurl: PropTypes.string.isRequired,
		onShownEditModal: PropTypes.func.isRequired,
		onDeleteGuest: PropTypes.func.isRequired
	}

	shownEditModal(e) {
		this.props.onShownEditModal(this.props.id)
	}

	deleteGuest(e) {
		this.props.onDeleteGuest(this.props.id)
		e.stopPropagation()
	}

	render() {
		const { connectDragSource, connectDropTarget } = this.props
		return connectDragSource(connectDropTarget(
			<div className={styles.cardWrap} onClick={::this.shownEditModal}>
				<div className={styles.img}>
					<img src={this.props.assetsUrl + this.props.headimgurl} />
				</div>
				<div className={styles.name}>
					<p>{this.props.name}</p>
				</div>
				<div className={styles.delete} onClick={::this.deleteGuest}>×</div>
			</div>
			
		))
			
		
	}
}