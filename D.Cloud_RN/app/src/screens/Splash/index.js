import React from 'react';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import firebase from 'firebase';
//LOCAL
import config from '../../../config';

export default class Splash extends React.PureComponent {
    componentDidMount() {
        if(firebase.apps.length===0) {
            firebase.initializeApp({
                apiKey: "AIzaSyBcNqrPKB9T9-2VKRFsLUtsytj4O09xqWA",
                authDomain: "musicx-46c2d.firebaseapp.com",
                databaseURL: "https://musicx-46c2d.firebaseio.com",
                projectId: "musicx-46c2d",
                storageBucket: "musicx-46c2d.appspot.com",
                messagingSenderId: "629755735207"
            });
        }
    }

    render() {
        const {
            containerStyle,
            lottieAnimationStyle,
            logoTextStyle
        } = styles;

        return (
            <View style={ containerStyle }>
                <StatusBar backgroundColor={config.COLOR_BACKGROUND} barStyle='dark-content' />
                <LottieView
                    source={ require('../../../assets/lottie/cloud.json') }
                    autoPlay
                    loop={ false }
                    style={ lottieAnimationStyle }
                />
                <Animatable.Text animation='bounceInUp' delay={2000} onAnimationEnd={ this.onAnimationEnd.bind(this) }>
                    <Text style={ logoTextStyle }>{ config.APP_NAME }</Text>
                </Animatable.Text>
            </View>
        );
    }

    onAnimationEnd() {
        const { navigate } = this.props.navigation;
        if(firebase.auth().currentUser===null) navigate('SignIn');
        else navigate('Home');
    }
};

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: config.COLOR_BACKGROUND,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lottieAnimationStyle: {
        height: 256,
        width: 256
    },
    logoTextStyle: {
        fontFamily: 'righteous',
        fontSize: 50,
        color: config.COLOR_TEXT_DARK
    }
});