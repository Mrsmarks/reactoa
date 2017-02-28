import React, { PropTypes } from 'react'

import ReactDOM from 'react-dom'
import Simditor from 'simditor/lib/simditor'

import Slider from 'antd/lib/slider'
import Modal from 'antd/lib/modal'
let content = ''
export default class Editor extends React.Component {
	static propTypes = {
		record: PropTypes.any,
	}

	static getContent() {
		return content || this.editor.getValue()
	}

	update(content) {
		this.state.editor.setValue(content || '')
	}

	componentDidUpdate (prevProps) {
	    if (prevProps.info !== this.props.info) {
	      this.editor.setValue(this.props.info.detail);
	    }
  	}

	componentDidMount() {

		const textarea = ReactDOM.findDOMNode(this.refs.textarea)

		this.editor = new Simditor({
			textarea: textarea,
			toolbar: ['title', 'bold', 'italic', 'underline', 'strikethrough', 
				'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|',
				'link', /*'image',*/ 'hr', '|', 'indent', 'outdent', 'alignment'],
		})
	
		this.editor.on('valuechanged', function(e) {
			content = e.currentTarget.body[0].innerHTML
		})
		if(this.props.info){
			this.editor.setValue(this.props.info.detail)
		}
	}

	render() {
		return (
			<textarea ref='textarea' rows="20"/>
		)
	}
}