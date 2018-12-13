import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableWithoutFeedback, FlatList, Image, ListView, Linking, WebView } from 'react-native';
import { Container, Content, Item, Input, Icon, Button, Spinner, Thumbnail, Card, CardItem, Body, List, ListItem } from 'native-base';
import firebase from 'firebase';
import Carousel from 'react-native-snap-carousel';
import Video from 'react-native-video';
//LOCAL
import config from '../../../../config';
import Logo from '../../../components/Logo';
import RNFetchBlob from 'rn-fetch-blob';

export default class Forum extends React.Component {
    state = {
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

    renderListItem(post) {
        const {
            itemImageStyle
        } = styles;
        return (
            <Card>
                <CardItem style={ {flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'} }>
                    <Text style={ {fontSize: 16, color: 'black', fontFamily: 'righteous'} }>{ post.uid }</Text>
                    <Text style={ {marginTop: 16, marginBottom: 32, color: config.COLOR_TEXT_DARK, fontFamily: 'roboto_light'} }>{ post.content }</Text>
                    {
                        post.type==='image'?
                        <Thumbnail large source={ {uri: config.BASE_SERVER_URL+'/get?uid='+post.uid+'&hash='+post.hash} } />: null
                    }
                </CardItem>

                <CardItem>
                    {
                        post.type==='video'?
                        <WebView
                        source={ {uri: config.BASE_SERVER_URL+'?hash='+post.hash} }
                        style={ {height: 164} }
                        />:null
                    }
                </CardItem>
            </Card>
        );
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
                        <Logo size={40} text='Forum' />
                        <Thumbnail
                            style={ thumbnailStyle }
                            source={ {uri: this.state.user?this.state.user.photoURL:'http://profilepicturesdp.com/wp-content/uploads/2018/07/png-profile-picture-6.png'} }
                            small
                        />
                    </View>
                    <FlatList
                        data={ this.state.data }
                        style={ {flex: 1} }
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
    itemImageStyle: {
        flex: 1,
        flexDirection: 'row',
        height: 256
    }
});