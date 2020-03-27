import React, { Component } from 'react'
import { StyleSheet, View, KeyboardAvoidingView, ScrollView } from 'react-native'
import { ThemeProvider, Input, Button, Text, Icon } from 'react-native-elements'

import styles from './../assets/styles'

export default class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visibility: true,
        }
    }

    handleVisibility = () => {
        this.setState({visibility: !this.state.visibility})
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <Text h3>Selamat Datang</Text>
                    <Text style={styles.textMarginTop}>Lengkapi form berikut untuk registrasi</Text>
                </View>
                <View style={styles.form}>
                    <Input
                        placeholder="Aplikasi Sosial Putra" 
                        label="Name"
                    />
                    <Input
                        placeholder="sosial@example.com" 
                        label="Email"
                        keyboardType="email-address"
                    />
                    <Input
                        placeholder="Password Anda" 
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
                    />
                    <Button
                        title="Daftar"
                        raised
                        containerStyle={styles.buttonContainer}
                        onPress={() => this.props.navigation.navigate("Home")}
                    />
                    <Text style={styles.textRegister}>
                        Bila Anda sudah terdaftar, silahkan login <Text style={styles.textRegisterLink} onPress={() => this.props.navigation.navigate("Login")}>di sini</Text>
                    </Text>
                </View>
            </ScrollView>
        )
    }
}
