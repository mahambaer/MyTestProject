import React, { Component } from 'react'
import { Text, View, ScrollView, Alert } from 'react-native'
import { Icon, Input } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

import styles from './../assets/styles'
import Loader from './../components/Loader'

export default class PostEdit extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            loading: false,
            content: undefined,
        }
    }

    getData = async () => {
        this.setState({loading: true})
        const token = await AsyncStorage.getItem("@mytest:token")
        axios({
            url: 'http://192.168.100.15:80/myapi/public/graphql',
            method: 'post',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                query: `
                    query($id: ID!) {
                        post(id: $id) {
                            content
                        }
                    }
                `,
                variables: {
                    id: this.props.route.params.id
                }
            }
        }).then(res => {
            if(res.data.data){
                this.setState({loading: false, content: res.data.data.post.content})
            }
            else{
                throw {message: "Sedang ada masalah. Coba sesaat lagi."}
            }
        }).catch(err => {
            this.setState({loading: false})
            Alert.alert("Koneksi Gagal", err.message)
        })
    }

    handleUpdate = async () => {
        this.setState({loading: true})
        const token = await AsyncStorage.getItem('@mytest:token')
        axios({
            url: 'http://192.168.100.15:80/myapi/public/graphql',
            method: 'post',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                query: `
                    mutation($id: ID!, $content: String!) {
                        updatePost(
                            input: {
                                id: $id
                                content: $content
                            }
                        ) {
                            content
                        }
                    }
                `,
                variables: {
                    id: this.props.route.params.id,
                    content: this.state.content
                }
            }
        }).then(res => {
            if(res.data.data){
                this.setState({loading: false})
                Alert.alert(
                    "Berhasil Edit Post",
                    "Post Anda berhasil diedit.",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                this.props.navigation.goBack()
                            }
                        }
                    ]
                )
            }
            else {
                throw {message: "Pastikan isi Post tidak kosong."}
            }
        }).catch(err => {
            this.setState({loading: false})
            Alert.alert("Gagal Edit Post", err.message)
        })
    }

    componentDidMount() {
        this.getData()
    }

    render() {
        this.props.navigation.setOptions({
            headerTitle: "Edit Post",
            headerRight: () => <Icon name="check" onPress={this.handleUpdate} />,
            headerRightContainerStyle: styles.headerRightContainer
        })
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <Loader loading={this.state.loading} />
                <View style={styles.form}>
                    <Input 
                        placeholder="Tulis isi post Anda di sini..."
                        multiline
                        autoCapitalize="sentences"
                        onChangeText={(text) => this.setState({content: text})}
                        inputContainerStyle={{borderBottomWidth: 0}}
                        value={this.state.content}
                    />
                </View>
            </ScrollView>
        )
    }
}
