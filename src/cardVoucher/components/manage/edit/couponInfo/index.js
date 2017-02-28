import React, { PropTypes } from 'react'
import Immutable from 'immutable'
import styles from './index.scss'
import PreviewComp from './preview'
import FormInfoComp from './formInfo'
export default class ManagePreviewComp extends React.Component {

    state = {
        value: ''
    }

    onInputChange(value) {
        this.setState({
            value
        })
    }

    render() {
        return(
            <div className={styles.container}>
                <div className={styles.previewContainer}>
                    <PreviewComp
                        onInputChange={::this.onInputChange}
                    />
                </div>
                <div className={styles.formInfoContainer}>
                    <FormInfoComp
                        value={this.state.value}
                    />
                </div>
                info
            </div>
        )
    }
}