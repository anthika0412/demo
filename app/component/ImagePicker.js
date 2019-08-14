import React, { Component } from 'react'
import {
    TouchableOpacity,
    View,
    GetPhotosParamType,
    GetPhotosReturnType,
    FlatList,
    ActivityIndicator,
    Image,
    Text,
    Modal,
    Dimensions
} from 'react-native'
import ImageResizer from 'react-native-image-resizer';
import CameraRoll from '@react-native-community/cameraroll'

const Layout = Dimensions.get("window")

const DEFAULT_OPTIONS: GetPhotosParamType = {
    first: 100,
    assetType: "Photos",
    mimeTypes: ["image/jpeg", "image/png", "image/jpg"]
}

export default class ImagePickerScreen extends Component {

    constructor (props) {
        super(props)
        this.state = {
            photos: [],
            hasNext: false,
            refresh: false
        }
        // this.getPhotos()
    }
    
    componentDidMount() {
        this.getPhotos()
    }

    getPhotos = () => {
        // const { options } = this.props //.navigation.getParam('options', {})
        this.setState({ refresh: true }, () => {
            CameraRoll.getPhotos({ ...DEFAULT_OPTIONS }).then((response) => {
                this.setState({ refresh: false }, () => {
                    console.log("getPhotos response:", response)
                    this.setState({
                        photos: response.edges,
                        hasNext: response.page_info.has_next_page
                    })
                })
            }).catch((error) => {
                this.setState({ refresh: false })
            })
        })
    }

    getMorePhotos = async () => {
        if (this.state.hasNext) {
            await CameraRoll.getPhotos({ ...DEFAULT_OPTIONS }).then((response) => {
                console.log("getMorePhotos response:", response)
                this.setState({
                    photos: [ ...this.state.photos, ...response.edges ],
                    hasNext: response.page_info.has_next_page
                })
            })
        }
    }

    onSelectedPhoto = async (photo) => {
        // const onSelectedPhoto = this.props.navigation.getParam('onSelectedPhoto', () => null)
        // const { image } = photo.node
        // const resizer = await ImageResizer.createResizedImage(image.uri, image.width, image.height, "JPEG", 60)
        // onSelectedPhoto(resizer, photo.node.type)
        // this.props.navigation.goBack()
    }

    render () {
        console.log("render image picker")
        return <Modal animated
            animationType={"fade"}
            visible={this.props.visible}>
                <FlatList
                    numColumns={3}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.photos}
                    extraData={this.state}
                    renderItem={({item, index}) => {
                        return <TouchableOpacity onPress={() => this.onSelectedPhoto(item)}>
                            <Image local key={item.node.image.uri}
                                source={{ uri: item.node.image.uri}}
                                style={{
                                    width: Layout.width / 3,
                                    height: Layout.width / 3
                                }} />
                            </TouchableOpacity>
                    }}
                    onEndReached={this.getMorePhotos}
                    onRefresh={this.getPhotos}
                    refreshing={this.state.refresh}
                    ListFooterComponent={this.state.hasNext ? <ActivityIndicator style={{ alignSelf: "center" }} /> : null} />
            </Modal>
    }
}
