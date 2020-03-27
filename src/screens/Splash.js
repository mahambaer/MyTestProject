import React, { Component } from 'react'
import Loader from './../components/Loader'
import AsyncStorage from '@react-native-community/async-storage'


export default class Splash extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLogin: null,
            loading: false
        }
    }

    handleIndex = async () => {
        this.setState({isLogin: await AsyncStorage.getItem('@mytest:token')})
    }

    async componentDidMount() {
        this.setState({loading: true})
        await this.handleIndex()
        if (this.state.isLogin) {
            this.setState({ loading: false })
            this.props.navigation.reset({
                index: 0,
                routes: [
                    {
                        name: "Home"
                    }
                ]
            })
        }
        else{
            this.setState({ loading: false })
            this.props.navigation.reset({
                index: 0,
                routes: [
                    {
                        name: "Login"
                    }
                ]
            })
        }
    }

    render() {
        return (
            <Loader loading={this.state.loading} />
        )
    }
}
