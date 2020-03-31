import React, { Component } from 'react'
import { StyleSheet, View, KeyboardAvoidingView, ScrollView, Alert } from 'react-native'
import { ThemeProvider, Input, Button, Text, Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'

import styles from './../assets/styles'
import Loader from './../components/Loader'

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visibility: true,
            email: undefined,
            password: undefined,
            loading: false
        }
    }

    handleVisibility = () => {
        this.setState({ visibility: !this.state.visibility })
    }

    handleLogin = () => {
        this.setState({ loading: true })
        axios({
            url: 'http://192.168.100.15:80/myapi/public/graphql',
            method: 'post',
            data: {
                query: `
                    mutation($email: String!, $password: String!) {
                        login(
                            input: {
                                email: $email
                                password: $password
                            }
                        )
                    }
                `,
                variables: {
                    email: this.state.email,
                    password: this.state.password
                }
            }
        }).then(async (res) => {
            if (res.data.data) {
                if(res.data.data.login) {
                    console.log(res.data.data)
                    await AsyncStorage.setItem('@mytest:token', res.data.data.login)
                    this.setState({loading: false})
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: "Home"
                            }
                        ]
                    })
                }
                else {
                    throw { message: "Periksa Email dan Password Anda" } 
                }
            }
            else {
                throw { message: "Periksa Email dan Password Anda" }
            }
        }).catch(err => {
            this.setState({loading: false})
            Alert.alert("Login Gagal", err.message)
        })
    }

    render() {
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Loader loading={this.state.loading} />
                <View style={styles.header}>
                    <Text h1>Aplikasi Sosial</Text>
                </View>
                <View style={styles.content}>
                    <Text h3>Selamat Datang</Text>
                    <Text style={styles.textMarginTop}>Lengkapi form berikut untuk login</Text>
                </View>
                <View style={styles.form}>
                    <Input
                        placeholder="sosial@example.com"
                        label="Email"
                        leftIcon={
                            <Icon
                                name="email"
                                color="grey"
                            />
                        }
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={(text) => this.setState({ email: text })}
                    />
                    <Input
                        placeholder="Password"
                        label="Password"
                        leftIcon={
                            <Icon
                                name="lock"
                                color="grey"
                            />
                        }
                        rightIcon={
                            <Icon
                                name={this.state.visibility == true ? "visibility-off" : "visibility"}
                                onPress={this.handleVisibility}
                                color="grey"
                            />
                        }
                        rightIconContainerStyle={{ marginRight: 16 }}
                        secureTextEntry={this.state.visibility}
                        autoCapitalize="none"
                        onChangeText={(text) => this.setState({ password: text })}
                    />
                    <Button
                        title="Login"
                        raised
                        containerStyle={styles.buttonContainer}
                        onPress={this.handleLogin}
                    />
                    <Text style={styles.textRegister}>
                        Bila Anda belum terdaftar, silahkan daftar <Text style={styles.textRegisterLink} onPress={() => this.props.navigation.navigate("Register")}>di sini</Text>
                    </Text>
                </View>
            </ScrollView>
        )
    }
}
