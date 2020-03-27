import React, { Component } from 'react'
import { StyleSheet, View, KeyboardAvoidingView, ScrollView, Alert } from 'react-native'
import { ThemeProvider, Input, Button, Text, Icon } from 'react-native-elements'
import axios from 'axios'

import styles from './../assets/styles'

export default class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visibility: true,
            name: undefined,
            email: undefined,
            password: undefined
        }
    }

    handleVisibility = () => {
        this.setState({visibility: !this.state.visibility})
    }

    handleRegistration = () => {
        axios({
            url: 'http://192.168.100.15:80/myapi/public/graphql',
            method: 'post',
            data: {
                query: `
                    mutation($name: String!, $email: String!, $password: String!) {
                        createUser(
                            input: {
                                name: $name
                                email: $email
                                password: $password
                            }
                        ) {
                            name
                            email
                        }
                    }                
                `,
                variables: {
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password
                }
            }
        }).then(res => {
            if(res.data.data) {
                Alert.alert("Registrasi Berhasil", "Silahkan Login dengan Akun Anda.")
                this.props.navigation.goBack()
            }
            else {
                console.log(res.data.errors[0].extensions.validation)
                if(res.data.errors[0].extensions.validation) {
                    if(res.data.errors[0].extensions.validation['input.email']) {
                        res.data.errors[0].extensions.validation['input.email'].map(err => {
                            if(err.includes("already")) {
                                throw {message: "Email Anda sudah terdaftar."}
                            }
                            else if(err.includes("valid")) {
                                throw {message: "Pastikan Anda menulis Email yang valid."}
                            }
                        })
                    }
                    if(res.data.errors[0].extensions.validation['input.password']) {
                        throw {message: "Password minimal 6 huruf."}
                    }
                }
                else {
                    throw {message: "Pastikan semua form terisi semua."}
                }
            }
        }).catch(err => {
            Alert.alert("Registrasi Gagal", err.message)
        })
    }

    render() {
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text h3>Selamat Datang</Text>
                    <Text style={styles.textMarginTop}>Lengkapi form berikut untuk registrasi</Text>
                </View>
                <View style={styles.form}>
                    <Input
                        placeholder="Aplikasi Sosial Putra" 
                        label="Name"
                        autoCapitalize="words"
                        onChangeText={(text) => this.setState({name: text})}
                    />
                    <Input
                        placeholder="sosial@example.com" 
                        label="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={(text) => this.setState({email: text})}
                    />
                    <Input
                        placeholder="Minimal 6 huruf" 
                        label="Password"
                        rightIcon={
                            <Icon 
                                name={this.state.visibility==true ? "visibility-off" : "visibility"}
                                onPress={this.handleVisibility}
                                color="grey"
                            />
                        }
                        rightIconContainerStyle={{marginRight: 16}}
                        secureTextEntry={this.state.visibility}
                        autoCapitalize="none"
                        onChangeText={(text) => this.setState({password: text})}
                    />
                    <Button
                        title="Daftar"
                        raised
                        containerStyle={styles.buttonContainer}
                        onPress={this.handleRegistration}
                    />
                    <Text style={styles.textRegister}>
                        Bila Anda sudah terdaftar, silahkan login <Text style={styles.textRegisterLink} onPress={() => this.props.navigation.navigate("Login")}>di sini</Text>
                    </Text>
                </View>
            </ScrollView>
        )
    }
}
