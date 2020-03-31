import React, { Component } from 'react'
import { Text, StyleSheet, View, Alert } from 'react-native'
import { Icon, Avatar } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

import styles from './../assets/styles'
import PostCard from './../components/PostCard'
import { ScrollView } from 'react-native-gesture-handler'
import Loader from './../components/Loader'
import Moment from 'moment'

export default class Home extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            loading: false,
            posts: undefined
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
                        await this.setState({loading: true})
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
                                await this.setState({loadig: false})
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

    getData = async () => {
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
                        posts(
                            input: {
                                orderBy: {
                                    field: "created_at"
                                    order: DESC
                                }
                            }
                        ) {
                            id
                            content
                            createdBy {
                                name
                            }
                            createdAt
                        }
                    }
                `
            }
        }).then(res => {
            if(res.data.data){
                this.setState({loading: false, posts: res.data.data.posts})
            }
            else {
                throw {message: "Sedang ada masalah. Coba sesaat lagi."}
            }
        }).catch(err => {
            this.setState({loading: false})
            Alert.alert("Koneksi Gagal", err.message)
        })
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getData()
        })
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.state.posts ? 
                    this.state.posts.map(data => {
                        return <PostCard 
                            key={data.id}
                            userName={data.createdBy.name}
                            date={`${Moment(data.createdAt).format('DD MMM YYYY')} on ${Moment.utc(`${data.createdAt}-07:00`).format('HH:mm')}`}
                            content={data.content}
                            commentNumber={data.comments ? data.comments.length() : null}
                            onPress={() => this.props.navigation.navigate("PostDetail")}                      
                        />
                    })
                    :
                    null}
                </ScrollView>
                <Icon raised name="add" reverse color="tomato" containerStyle={styles.fabContainer} onPress={() => this.props.navigation.navigate("PostCreate")} />
            </View>
        )
    }
}
