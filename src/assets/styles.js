import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        marginHorizontal: 16,
        marginVertical: 16
    },
    header: {
        marginVertical: 16,
        alignItems: "center"
    },
    content: {
        marginTop: 16,
        alignItems: "center"
    },
    textMarginTop: {
        marginTop: 24
    },
    form: {
        marginVertical: 16
    },
    buttonContainer: {
        marginVertical: 16, 
        marginHorizontal: 16
    },
    textRegister: {
        marginHorizontal: 12
    },
    textRegisterLink: {
        color: "blue", 
        textDecorationLine: "underline"
    },
    postCardHeader: {
        alignItems: "flex-start"
    },
    postCardUser: {
        alignItems: "center",
        flexDirection: "row"
    },
    postCardUserName: {
        marginLeft: 16,
        fontSize: 16,
        fontWeight: "bold"
    },
    postCardDate: {
        marginLeft: 16,
        fontSize:8,
        color: "grey"
    },
    contentViewMoreText: {
        color: "blue"
    },
    postCardFooter: { 
        flexDirection: "row",
        justifyContent: "space-around" 
    },
    postCardBadge: { 
        position: "absolute", 
        top: -8, 
        right: -8, 
        opacity: 0.7 
    },
    postCardDivider: { 
        marginVertical: 16, 
        backgroundColor: "grey" 
    },
    fabContainer: { 
        position: "absolute", 
        right: 8, 
        bottom: 8, 
        opacity: 0.8 
    },
    headerRightContainer: {
        marginRight: 16
    },
    headerLeftContainer: {
        marginLeft: 16
    },
    modalBackground: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#00000040"
    },
    activityIndicatorWrapper: {
        backgroundColor: "white",
        height: 100,
        width: 100,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "space-around"
    }
})

export default styles
