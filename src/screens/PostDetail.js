import React, { Component } from 'react'
import { Text, View, Alert } from 'react-native'
import { Icon, Input, Button } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

import styles from './../assets/styles'
import PostCard from './../components/PostCard'
import { ScrollView } from 'react-native-gesture-handler'
import Loader from './../components/Loader'
import Moment from 'moment'

export default class PostDetail extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            loading: false,
            content: undefined,
            post: undefined,
            isAuth: false
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
                            createdBy {
                                id
                                name
                            }
                            createdAt
                        }
                        me {
                            id
                        }
                    }
                `,
                variables: {
                    id: this.props.route.params.id
                }
            }
        }).then(res => {
            if(res.data.data){
                this.setState({loading: false, post: res.data.data.post})
                if(res.data.data.me.id === res.data.data.post.createdBy.id){
                    this.setState({isAuth: true})
                }
            }
            else{
                throw {message: "Sedang ada masalah. Coba sesaat lagi."}
            }
        }).catch(err => {
            this.setState({loading: false})
            Alert.alert("Koneksi Gagal", err.message)
        })
    }
    
    handleDelete = () => {
        Alert.alert(
            "Konfirmasi Hapus Post",
            "Apakah Anda ingin menghapus Post ini?",
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
                                    mutation($id: ID!) {
                                        deletePost(
                                            id: $id
                                        ) {
                                            content
                                        }
                                    }
                                `,
                                variables: {
                                    id: this.props.route.params.id
                                }
                            }
                        }).then(async (res) => {
                            if(res.data.data){
                                this.setState({loadig: false})
                                this.props.navigation.goBack()
                            }
                            else {
                                throw {message: "Sedang ada masalah. Coba sesaat lagi."}
                            }
                        }).catch(err => {
                            this.setState({loadig: false})
                            Alert.alert("Gagal Hapus Post", err.message)
                        })
                    }
                }
            ]
        )
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.getData()
        })
    }
    
    render() {
        this.props.navigation.setOptions({
            headerTitle: null,
            headerRight: () => {
                return this.state.isAuth ?
                    <View style={styles.iconContainer}>
                        <Icon name="edit" onPress={() => this.props.navigation.navigate("PostEdit", {id: this.props.route.params.id})} />
                        <Icon name="delete" onPress={this.handleDelete} />
                    </View>                
                :
                null
            },
            headerRightContainerStyle: styles.headerRightContainer
        })
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.state.post ? 
                    <PostCard 
                        key={this.state.post.id}
                        userName={this.state.post.createdBy.name}
                        date={`${Moment(this.state.post.createdAt).format('DD MMM YYYY')} on ${Moment(this.state.post.createdAt).format('HH:mm')}`}
                        content={this.state.post.content}
                        commentNumber={this.state.post.comments ? this.state.post.comments.length() : null}                     
                    />
                    :
                    null}
                </ScrollView>
                <Input 
                    placeholder="Tulis komentar Anda di sini..."
                    multiline
                    autoCapitalize="sentences"
                    onChangeText={(text) => this.setState({content: text})}
                    rightIcon={
                        <Icon
                            name="send"
                            color="blue"
                        />
                    }
                    rightIconContainerStyle={{ marginRight: 16 }}
                />
            </View>
        )
    }
}
