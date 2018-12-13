import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Container, Content, Item, Input, Icon, Button, Spinner } from 'native-base';
import firebase from 'firebase';
//LOCAL
import config from '../../../config';
import Logo from '../../components/Logo';

export default class SignIn extends React.Component {
    state = {
        progress: false,
        email: '',
        password: ''
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
            inputStyle,
            signUpLayoutStyle,
            buttonStyle,
            buttonTextStyle
        } = styles;

        return (
            <Container style={ containerStyle }>
                <Content padder contentContainerStyle={ contentStyle }>
                    <Logo size={50} />

                    <Text style={ titleTextStyle }>{ "Welcome." }</Text>
                    <Text style={ subtitleTextStyle }>{ "Sign in to continue" }</Text>

                    <Item style={ {marginTop: 50} }>
                        <Icon name='ios-mail-outline' />
                        <Input
                            onChangeText={ text => this.setState({ email: text }) }
                            value={ this.state.email }
                            placeholder='EMAIL ADDRESS'
                            placeholderTextColor={ config.COLOR_TEXT_DARK }
                            keyboardType='email-address'
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
                            style={ inputStyle }
                            selectionColor={ config.COLOR_TEXT_DARK }
                        />
                    </Item>

                    <View style={ signUpLayoutStyle }>
                        <Text style={ [subtitleTextStyle, { marginRight: 8 }] }>{ "Don't have an account?" }</Text>
                        <Text onPress={ this.onSignUpTextPress.bind(this) } style={ [subtitleTextStyle, { fontFamily: 'roboto_light', fontSize: 30 }] }>{ "Sign up" }</Text>
                    </View>

                    <Button rounded block dark style={ buttonStyle } onPress={ this.onSignInButtonPress.bind(this) }>
                        {
                            this.state.progress? <Spinner color='white' /> : <Text style={ buttonTextStyle }>{ "Sign In" }</Text>
                        }
                    </Button>
                </Content>
            </Container>
        );
    }

    onSignUpTextPress() {
        const { navigate } = this.props.navigation;
        navigate('SignUp');
    }

    async onSignInButtonPress() {
        this.setState({ progress: true });
        try {
            await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
            this.props.navigation.navigate('Home');
        } catch (error) {
            Alert.alert(config.APP_NAME, error.message);   
        } finally {
            this.setState({ progress: false });
        }
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
    inputStyle: {
        fontSize: 16,
        fontFamily: 'roboto_light',
        color: 'black'
    },
    signUpLayoutStyle: {
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
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