import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableWithoutFeedback, FlatList, WebView } from 'react-native';
import { Container, Content, Item, Input, Icon, Button, Spinner, Thumbnail, Card, ListItem } from 'native-base';
import firebase from 'firebase';
import Carousel from 'react-native-snap-carousel';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';
//LOCAL
import config from '../../../../config';
import Logo from '../../../components/Logo';

export default class Videos extends React.Component {
    state = {
        user: null,
        data: []
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
            this.setState({ user: firebase.auth().currentUser });
        }
        firebase.database().ref('dcloud').child('public').child('forum').on('value', forumSnapshot=>{
            const dataToRender = [];
            forumSnapshot.forEach(pushSnap=>{
                const pushObj = pushSnap.val();
                dataToRender.push(pushObj);
            });
            this.setState({ data: dataToRender });
        });
    }

    renderListItem(item) {
        const { videoStyle } = styles;

        if(item.type==='video') {
            return (
                <WebView
                    source={ {uri: config.BASE_SERVER_URL+'?hash='+item.hash} }
                    style={ {marginTop: 16, height: 164} }
                />
            );
        }
    }

    render() {
        const {
            containerStyle,
            contentStyle,
            logoLayoutStyle,
            thumbnailStyle
        } = styles;

        return (
            <Container style={ containerStyle }>
                <Content padder style={ contentStyle }>
                    <View style={ logoLayoutStyle }>
                        <Logo size={40} text='Videos' />
                        <Thumbnail
                            style={ thumbnailStyle }
                            source={ {uri: this.state.user?this.state.user.photoURL:'http://profilepicturesdp.com/wp-content/uploads/2018/07/png-profile-picture-6.png'} }
                            small
                        />
                    </View>
                    <FlatList
                        data={ this.state.data }
                        renderItem={ ({ item }) => this.renderListItem(item) }
                        keyExtractor={ item => item.hash }
                        />
                </Content>
            </Container>
        );
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
    logoLayoutStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    thumbnailStyle: {
        borderWidth: 2,
        borderColor: config.COLOR_TEXT_DARK
    },
    videoItemStyle: {
        flexDirection: 'row',
        flex: 1,
        height: 256
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
});