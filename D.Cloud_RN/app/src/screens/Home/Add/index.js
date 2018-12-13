import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableWithoutFeedback, Dimensions, Image, YellowBox } from 'react-native';
import { Container, Content, Item, Input, Icon, Button, Spinner, Thumbnail, Card, CardItem, Left, Right, Radio, ListItem } from 'native-base';
import firebase from 'firebase';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';
//LOCAL
import config from '../../../../config';
import Logo from '../../../components/Logo';

const ImagePicker = require('react-native-image-picker');
console.disableYellowBox = true;

export default class Add extends React.Component {
    state = {
        user: null,
        imageUri: '',
        videoUri: '',
        private: true,
        postText: '',
        response: null,
        mainProgress: false,
        fileHash: null
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
        firebase.auth().onAuthStateChanged(user=>{
            if(user) this.setState({ user: user });
        });
    }

    render() {
        const {
            containerStyle,
            contentStyle,
            videoStyle,
            buttonStyle,
            buttonTextStyle,
            imageStyle,
            radioButtonTextStyle
        } = styles;

        return (
            <Container style={ containerStyle }>
                <Content padder contentContainerStyle={ contentStyle }>
                    <Logo size={40} text='Upload' />

                    <Button rounded dark style={ buttonStyle }
                        onPress={ this.onUploadImageButtonPress.bind(this) }>
                        <Text style={ buttonTextStyle }>{ 'Upload Image' }</Text>
                    </Button>

                    <Button rounded outlined style={ [buttonStyle, {marginBottom: 32}] }
                        onPress={ this.onUploadVideoButtonPress.bind(this) }>
                        <Text style={ buttonTextStyle }>{ 'Upload Video' }</Text>
                    </Button>
                    {
                        this.state.imageUri?<Thumbnail large style={ imageStyle } source={ {uri: this.state.imageUri} } /> : null
                    }
                    {
                        this.state.videoUri?
                        <View style={videoStyle}>
                            <Video style={ {width: 128, height: 128} } source={ {uri: this.state.videoUri} } />
                        </View>:null
                    }

                    <ListItem onPress={ ()=>this.setState({ private: true }) }>
                        <Left>
                            <Text style={ radioButtonTextStyle }>Private</Text>
                        </Left>
                        <Right>
                            <Radio selected={ this.state.private } />
                        </Right>
                    </ListItem>
                    <ListItem onPress={ ()=>this.setState({ private: false }) }>
                        <Left>
                            <Text style={ radioButtonTextStyle }>Public</Text>
                        </Left>
                        <Right>
                            <Radio selected={ !this.state.private } />
                        </Right>
                    </ListItem>
                    
                    {
                        this.state.private?null:
                        <Item regular style={ {marginTop: 32} }>
                            <Input
                                onChangeText={ text => this.setState({ postText: text }) }
                                value={ this.state.postText }
                                placeholder='Forum post content'
                                placeholderTextColor={ config.COLOR_TEXT_DARK }
                                selectionColor={ config.COLOR_TEXT_DARK }
                            />
                        </Item>
                    }

                    <Button full dark style={ {marginTop: 40} } onPress={ this.onUploadButtonPress.bind(this) }>
                    {
                        this.state.mainProgress?<Spinner color='white' />:<Text style={ buttonTextStyle }>{ 'Upload' }</Text>
                    }
                    </Button>
                </Content>
            </Container>
        );
    }

    onUploadVideoButtonPress() {
        const options = {
            title: 'Select Media',
            mediaType: 'video',
            storageOptions: { skipBackup: true }
        };
        ImagePicker.showImagePicker(options, response=>{
            if(response.didCancel) this.notify('Cancelled by user');
            else if(response.error) this.notify('ERROR: '+response.error);
            else {
                this.setState({ response: response, videoUri: response.uri, imageUri: null, mainProgress: true });
                RNFetchBlob.fetch('POST', config.BASE_SERVER_URL+'/upload_file?uid='+firebase.auth().currentUser.uid, {
                    'Content-Type': 'multipart/form-data'   
                },[
                    { name: 'foo', filename: 'foo', type: response.type, data: RNFetchBlob.wrap(response.path) }
                ]).then(resp=>{
                    const responseJson = JSON.parse(resp.data);
                    this.setState({ fileHash: responseJson.hash, mainProgress: false });
                }).catch(err=>{
                    this.notify(JSON.stringify(err));
                });
            }
        });
    }

    onUploadImageButtonPress() {
        const options = {
            title: 'Select Media',
            storageOptions: { skipBackup: true }
        };
        ImagePicker.showImagePicker(options, response=>{
            if(response.didCancel) this.notify('Cancelled by user');
            else if(response.error) this.notify('ERROR: '+response.error);
            else {
                this.setState({ response: response, imageUri: response.uri, videoUri: null, mainProgress: true });
                RNFetchBlob.fetch('POST', config.BASE_SERVER_URL+'/upload_file?uid='+firebase.auth().currentUser.uid, {
                    'Content-Type': 'multipart/form-data'   
                },[
                    { name: 'foo', filename: 'foo', type: response.type, data: RNFetchBlob.wrap(response.path) }
                ]).then(resp=>{
                    const responseJson = JSON.parse(resp.data);
                    this.setState({ fileHash: responseJson.hash, mainProgress: false });
                }).catch(err=>{
                    this.notify(JSON.stringify(err));
                });
            }
        });
    }

    onUploadButtonPress() {
        try {
            this.setState({ mainProgress: true });
            
            const fileHash = this.state.fileHash;
            const postContent = this.state.postText;
            const uid = this.state.user.uid;
            const currentDate = new Date();
            const response = this.state.response;
            const userName = this.state.user.displayName;
            const userImage = this.state.user.photoURL;
            const filename = response.path.replace(/^.*[\\\/]/, '');
            const dataToPush = {
                uid: uid,
                hash: fileHash,
                content: postContent,
                timestamp: currentDate,
                name: filename,
                userName: userName,
                userImage: userImage,
                type: this.state.videoUri?'video':'image'
            };
            if(this.state.private) {
                firebase.database().ref('dcloud').child('private').child(uid).child(fileHash).set(dataToPush).then(()=>{
                    this.setState({ response: null, fileHash: null, imageUri: '', videoUri: '' });
                    this.setState({ mainProgress: false });
                }).catch(err=>this.notify(err.toString()));
            } else {
                firebase.database().ref('dcloud').child('public').child('forum').push().set(dataToPush).then(()=>{
                    this.setState({ response: null, fileHash: null, imageUri: '', videoUri: '' });
                    this.setState({ mainProgress: false });
                }).catch(err=>this.notify(err.toString()));
            }
        } catch (error) {
            this.notify(error.toString());
        }
    }

    notify(message) {
        if(this.state.mainProgress) this.setState({ mainProgress: false });
        Alert.alert(config.APP_NAME, message);
    }
};

const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: config.COLOR_BACKGROUND
    },
    contentStyle: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16
    },
    buttonStyle: {
        marginTop: 32,
        flex: 1
    },
    buttonTextStyle: {
        fontFamily: 'righteous',
        fontSize: 18,
        color: 'white'
    },
    imageStyle: {
        borderWidth: 2,
        borderColor: config.COLOR_TEXT_DARK,
        alignSelf: 'center',
        marginTop: 32
    },
    videoStyle: {
        height: 128,
        width: 128,
        borderRadius: 64,
        borderWidth: 2,
        borderColor: config.COLOR_TEXT_DARK,
        overflow: 'hidden',
        alignSelf: 'center'
    },
    radioButtonTextStyle: {
        fontFamily: 'roboto_light',
        color: 'black',
        fontSize: 18
    }
});