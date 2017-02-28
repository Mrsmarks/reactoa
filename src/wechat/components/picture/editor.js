import React, { PropTypes } from 'react'

import ReactDOM from 'react-dom'
import Simditor from 'simditor/lib/simditor'

import Slider from 'antd/lib/slider'
import Modal from 'antd/lib/modal'

let content = ''
export default class Editor extends React.Component {
	static propTypes = {
		//onChange: PropTypes.func.isRequired,
		record: PropTypes.object.isRequired,

		uploadImg: PropTypes.func
	}

	static getContent() {
		return content
	}

	state = {
		editor: null
	}

	update(content) {
		this.state.editor.setValue(content || '')
	}

	// shouldComponentUpdate(nextProps) {
	// 	return nextProps.content ? true : false
	// }
	
	resizeImg(img, perc) {
		const offsetWidth = img.dataset.offsetWidth
		img.style.width = offsetWidth * perc / 100 + 'px'
	}

	resizeImgCompleted() {
		this.update(this.state.editor.body[0].innerHTML)
	}
	
	componentWillReceiveProps(nextProps) {
		this.update(nextProps.record.content)
	}

	componentDidMount() {

		const textarea = ReactDOM.findDOMNode(this.refs.textarea)

		const editor = new Simditor({
			textarea: textarea,
			toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', 
				'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|',
				'link', /*'image',*/ 'hr', '|', 'indent', 'outdent', 'alignment'],
			allowedStyles: {
				img: ['width', 'height']
			}
		})

		const container = document.querySelector('.simditor-toolbar > ul')
		if (this.props.uploadImg) {
			const btn = this.createButton('图片')
			const uploadImg = ::this.props.uploadImg
			container.appendChild(btn)


			btn.querySelector('input').addEventListener('change', uploadImg)
		}

		content = ''
		editor.on('valuechanged', function(e) {
			content = e.currentTarget.body[0].innerHTML
		})

		editor.body.on('click', e => {
			if (e.target.tagName == 'IMG') {
				const target = e.target
				const width = target.offsetWidth
				target.removeAttribute('style')
				const realOffsetWidth = target.offsetWidth
				target.dataset.offsetWidth = realOffsetWidth
				target.style.width = width + 'px'
				target.style.height = 'auto'
				target.style.maxWidth = '100%'

				const defaultValue = width / realOffsetWidth * 100

				Modal.info({
					title: '修改图片大小',
					content: <Slider defaultValue={defaultValue} onChange={this.resizeImg.bind(this, target)} min={1} tipFormatter={v => v + '%'}/>,
					okText: '修改好了',
					onOk: ::this.resizeImgCompleted
				})
			}
		})


		this.setState({ editor }, () => {
			this.update(this.props.record.content)
		})
	}

	createButton(name) {
		const li = document.createElement('li')
		let style = {
			width: '46px',
			textAlign: 'center',
			fontSize: '12px',
			color: '#666',
			verticalAlign: 'sub',
			cursor: 'pointer',
			position: 'relative'
		}
		for (let i in style) {
			li.style[i] = style[i]
		}

		const form = document.createElement('form')
		const inputId = Math.random().toString(36).substr(2, 7)
		const input = document.createElement('input')
		input.type = 'file'
		input.id = inputId
		style = {
			position: 'fixed',
			clip: 'rect(0 0 0 0)',
			zIndex: 11111,
			width: '100%'
		}
		for (let i in style) {
			input.style[i] = style[i]
		}
		form.appendChild(input)

		const label = document.createElement('label')
		label.setAttribute('for', inputId)
		label.innerHTML = name
		label.style.cursor = 'pointer'

		li.appendChild(form)
		li.appendChild(label)

		return li
	}

	render() {
		// TODO 判断浏览器的高度 然后设置rows
		return (
			<div className="edit-warp">
				<textarea ref='textarea' rows="20"/>
			</div>
		)
	}
}

