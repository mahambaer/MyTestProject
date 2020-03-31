import React, { Component } from 'react'
import { Text, View, ScrollView, Alert } from 'react-native'
import { Icon, Input } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

import styles from './../assets/styles'
import Loader from './../components/Loader'

export default class PostCreate extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            loading: false,
            content: undefined,
            userId: undefined
        }
    }

    getMe = async () => {
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
                    query {
                        me {
                            id
                        }
                    }
                `
            }
        }).then(res => {
            if(res.data.data){
                this.setState({loading: false, userId: res.data.data.me.id})
            }
            else {
                throw {message: "Sedang ada masalah. Coba sesaat lagi."}
            }
        }).catch(err => {
            this.setState({loading: false})
            Alert.alert("Koneksi Gagal", err.message)
        })
    }

    handleCreate = async () => {
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
                    mutation($content: String!, $userId: ID!) {
                        createPost(
                            input: {
                                content: $content
                                userId: $userId
                            }
                        ) {
                            content
                        }
                    }
                `,
                variables: {
                    content: this.state.content,
                    userId: this.state.userId
                }
            }
        }).then(res => {
            if(res.data.data){
                this.setState({loading: false})
                Alert.alert(
                    "Berhasil Tambah Post",
                    "Post Anda berhasil ditambah.",
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
            Alert.alert("Gagal Tambah Post", err.message)
        })
    }

    componentDidMount() {
        this.getMe()
    }
    
    render() {
        this.props.navigation.setOptions({
            headerTitle: "Create Post",
            headerRight: () => <Icon name="check" onPress={this.handleCreate} />,
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
                    />
                </View>
            </ScrollView>
        )
    }
}
