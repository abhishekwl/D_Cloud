import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableWithoutFeedback } from 'react-native';
import { Container, Content, Item, Input, Icon, Button, Spinner, Thumbnail } from 'native-base';
import firebase from 'firebase';
import RNFetchBlob from 'rn-fetch-blob';
//LOCAL
import config from '../../../config';
import Logo from '../../components/Logo';

const ImagePicker = require('react-native-image-picker');
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export default class SignUp extends React.Component {
    state = {
        nam: '',
        image: 'http://profilepicturesdp.com/wp-content/uploads/2018/07/png-profile-picture-6.png',
        email: '',
        password: '',
        confirmPassword: '',
        imageResponse: null,
        phone: '',
        progress: false,
        otp: ''
    };

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
            contentStyle,
            titleTextStyle,
            subtitleTextStyle,
            thumbnailStyle,
            inputStyle,
            buttonStyle,
            buttonTextStyle
        } = styles;

        return (
            <Container style={ containerStyle }>
                <Content padder contentContainerStyle={ contentStyle }>
                    <Logo size={50} />

                    <Text style={ titleTextStyle }>{ "Sign Up." }</Text>
                    <Text style={ subtitleTextStyle }>{ "Join the community" }</Text>

                    <TouchableWithoutFeedback onPress={ this.onImageSelectPress.bind(this) }>
                        <Thumbnail
                            source={ {uri: this.state.image} }
                            style={ thumbnailStyle }
                            large
                            loadingIndicatorSource={ <Spinner color={ config.COLOR_TEXT_DARK } /> }
                            />
                    </TouchableWithoutFeedback>

                    <Item style={ {marginTop: 40} }>
                        <Icon name='md-person' />
                        <Input
                            onChangeText={ text => this.setState({ name: text }) }
                            value={ this.state.name }
                            placeholder='YOUR NAME'
                            placeholderTextColor={ config.COLOR_TEXT_DARK }
                            keyboardType='default'
                            returnKeyType='next'
                            style={ inputStyle }
                            selectionColor={ config.COLOR_TEXT_DARK }
                        />
                    </Item>
                    <Item style={ {marginTop: 16} }>
                        <Icon name='ios-mail-outline' />
                        <Input
                            onChangeText={ text => this.setState({ email: text }) }
                            value={ this.state.email }
                            placeholder='EMAIL ADDRESS'
                            placeholderTextColor={ config.COLOR_TEXT_DARK }
                            keyboardType='email-address'
                            returnKeyType='next'
                            style={ inputStyle }
                            selectionColor={ config.COLOR_TEXT_DARK }
                        />
                    </Item>
                    <Item style={ {marginTop: 16} }>
                        <Icon name='ios-call-outline' />
                        <Input
                            onChangeText={ text => this.setState({ phone: text }) }
                            value={ this.state.phone }
                            placeholder='PHONE NUMBER'
                            placeholderTextColor={ config.COLOR_TEXT_DARK }
                            keyboardType='phone-pad'
                            returnKeyType='next'
                            style={ inputStyle }
                            selectionColor={ config.COLOR_TEXT_DARK }
                        />
                    </Item>
                    <Item style={ {marginTop: 16} }>
                        <Icon name='ios-key-outline' />
                        <Input
                            onChangeText={ text => this.setState({ password: text }) }
                            value={ this.state.password }
                            placeholder='PASSWORD'
                            placeholderTextColor={ config.COLOR_TEXT_DARK }
                            secureTextEntry
                            keyboardType='default'
                            returnKeyType='next'
                            style={ inputStyle }
                            selectionColor={ config.COLOR_TEXT_DARK }
                        />
                    </Item>
                    <Item style={ {marginTop: 16} }>
                        <Icon name='ios-key' />
                        <Input
                            onChangeText={ text => this.setState({ confirmPassword: text }) }
                            value={ this.state.confirmPassword }
                            placeholder='CONFIRM PASSWORD'
                            placeholderTextColor={ config.COLOR_TEXT_DARK }
                            secureTextEntry
                            keyboardType='default'
                            returnKeyType='done'
                            style={ inputStyle }
                            selectionColor={ config.COLOR_TEXT_DARK }
                        />
                    </Item>
                    {
                        this.state.progress?
                        <Item style={ {marginTop: 16} }>
                            <Icon name='ios-key-outline' />
                            <Input
                                onChangeText={ text => this.setState({ otp: text }) }
                                value={ this.state.otp }
                                placeholder='OTP'
                                placeholderTextColor={ config.COLOR_TEXT_DARK }
                                secureTextEntry
                                keyboardType='default'
                                returnKeyType='next'
                                style={ inputStyle }
                                selectionColor={ config.COLOR_TEXT_DARK }
                            />
                        </Item>:null
                    }

                    <Button disabled={ this.state.progress } rounded block dark style={ buttonStyle } onPress={ this.onSignUpButtonPress.bind(this) }>
                        {
                            this.state.progress? <Spinner color='white' /> : <Text style={ buttonTextStyle }>{ "Sign In" }</Text>
                        }
                    </Button>
                </Content>
            </Container>
        );
    }

    onImageSelectPress() {
        const options = {
            title: 'Select Avatar',
            storageOptions: { skipBackup: true }
        };
        ImagePicker.showImagePicker(options, response=>{
            if(response.didCancel) this.notify('Cancelled by user');
            else if(response.error) this.notify('ERROR: '+response.error);
            else {
                let sourceUri = response.uri;
                this.setState({ image: sourceUri, imageResponse: response });
            }
        });
    }

    async onSignUpButtonPress() {
        try {
            this.setState({ progress: true });
            await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
            await firebase.auth().currentUser.updateProfile({
                displayName: this.state.name,
                photoURL: this.state.image
            });
            this.props.navigation.navigate('Home');
        } catch (error) {
            this.notify(error.message);
        } finally {
            this.setState({ progress: false });
        }
    }

    notify(message) {
        if(this.state.progress) this.setState({ progress: false });
        Alert.alert(config.APP_NAME, message);
    }
};

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: config.COLOR_BACKGROUND
    },
    contentStyle: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 32
    },
    titleTextStyle: {
        fontSize: 50,
        color: config.COLOR_TEXT_DARK,
        fontFamily: 'roboto_light',
        marginTop: 32
    },
    subtitleTextStyle: {
        fontSize: 20,
        color: config.COLOR_TEXT_DARK,
        fontFamily: 'roboto_thin'
    },
    thumbnailStyle: {
        marginTop: 64,
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: config.COLOR_TEXT_DARK
    },
    inputStyle: {
        fontSize: 16,
        fontFamily: 'roboto_light',
        color: 'black'
    },
    buttonStyle: {
        padding: 20,
        marginTop: 40
    },
    buttonTextStyle: {
        fontFamily: 'righteous',
        fontSize: 24,
        color: 'white'
    }
});