import React from 'react'
import { View, Text, Modal, ActivityIndicator } from 'react-native'

import styles from './../assets/styles'

const Loader = (props) => {
    return (
        <Modal
            transparent={true}
            animationType="none"
            visible={props.loading}
        >
            <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                    <ActivityIndicator animating={props.loading} />
                </View>
            </View>
        </Modal>
    )
}

export default Loader
