import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AsyncStorage from '@react-native-community/async-storage'

import Login from './../screens/Login'
import Register from './../screens/Register'
import Home from './../screens/Home'
import Splash from './../screens/Splash'

const Stack = createStackNavigator()

const RouteNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Splash" 
                    component={Splash} 
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen 
                    name="Login" 
                    component={Login} 
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen 
                    name="Register" 
                    component={Register}
                    options={{
                        headerTitle: "Aplikasi Sosial"
                    }}
                />
                <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RouteNavigation
