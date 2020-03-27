import React, { Component } from 'react'
import { Text, StyleSheet, View, Alert } from 'react-native'
import { Icon, Avatar } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

import styles from './../assets/styles'
import PostCard from './../components/PostCard'
import { ScrollView } from 'react-native-gesture-handler'
import Loader from './../components/Loader'

export default class Home extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            loading: false
        }
    }

    handleLogout = () => {
        Alert.alert(
            "Konfirmasi Logout",
            "Apakah Anda ingin Logout?",
            [
                {
                    text: "Tidak",
                    onPress: () => {},
                    style: "cancel"
                },
                {
                    text: "Ya",
                    onPress: async () => {
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
                                    mutation($api_token: String!) {
                                        logout(
                                            api_token: $api_token
                                        )
                                    }
                                `,
                                variables: {
                                    api_token: token
                                }
                            }
                        }).then(async (res) => {
                            if(res.data.data){
                                await AsyncStorage.removeItem('@mytest:token')
                                this.setState({loadig: false})
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [
                                        {
                                            name: "Login"
                                        }
                                    ]
                                })
                            }
                            else {
                                throw {message: "Anda tidak terotentikasi"}
                            }
                        }).catch(err => {
                            this.setState({loadig: false})
                            Alert.alert("Gagal Logout", err.message)
                        })
                    }
                }
            ]
        )
    }
    
    render() {
        this.props.navigation.setOptions({
            headerTitle: "Aplikasi Sosial",
            headerTitleAlign: "center",
            headerLeft: () => <Avatar rounded icon={{ name: "account-circle" }} />,
            headerLeftContainerStyle: styles.headerLeftContainer,
            headerRight: () => <Icon name="exit-to-app" onPress={this.handleLogout} />,
            headerRightContainerStyle: styles.headerRightContainer
        })
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <ScrollView>
                    <PostCard
                        title="Judul Post Pertama Judul Post Pertama Judul Post Pertama"
                        userName="Mahambara Agung Prabawa"
                        date="23 March 2020 on 14:40"
                        commentNumber="5"
                        content="Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja."
                    />
                    <PostCard
                        title="Judul Post Kedua"
                        userName="Mahambara Agung Prabawa"
                        date="23 March 2020 on 14:40"
                        likeNumber="99"
                        content="Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja. Test aja."
                    />
                </ScrollView>
                <Icon raised name="add" reverse color="tomato" containerStyle={styles.fabContainer} />
            </View>
        )
    }
}
