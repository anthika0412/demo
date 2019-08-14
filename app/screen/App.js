import React, { Component } from 'react'
import {
    View, SafeAreaView,
    TouchableOpacity, Text
} from 'react-native'
import ImagePickerScreen from '../component/ImagePicker';

export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            openCameraRoll: false
        }
    }

    onOpenCameraRoll = () => this.setState({ openCameraRoll: true })

    onClosePicker = () => this.setState({ openCameraRoll: false })

    render () {
        return <SafeAreaView>
            <Text>{"My Demo"}</Text>
            <TouchableOpacity onPress={this.onOpenCameraRoll}>
                <Text>{"Open CameraRoll"}</Text>
            </TouchableOpacity>
            <ImagePickerScreen visible={this.state.openCameraRoll}
                onClosePicker={this.onClosePicker} />
        </SafeAreaView>
    }
}