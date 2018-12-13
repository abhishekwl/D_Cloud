import React from 'react';
import { StyleSheet, Text, View, Alert, TouchableWithoutFeedback, FlatList, WebView } from 'react-native';
import { Container, Content, Item, Input, Icon, Button, Spinner, Thumbnail, Card, CardItem, ListItem } from 'native-base';
import firebase from 'firebase';
import Carousel from 'react-native-snap-carousel';
//LOCAL
import config from '../../../../config';
import Logo from '../../../components/Logo';

export default class Cloud extends React.Component {
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
        firebase.database().ref('dcloud').child('private').child(firebase.auth().currentUser.uid).on('value', hashSnapshot=>{
            const tempData = [];
            hashSnapshot.forEach(contentSnap=>{
                const snapVal = contentSnap.val();
                tempData.push(snapVal);
            });
            this.setState({ data: tempData });
        });
    }

    renderListItem(post) {
        const {
            itemImageStyle
        } = styles;
        return (
            <ListItem style={ {marginTop: 16} }>
                {
                    post.type==='image'?
                            <Thumbnail large source={ {uri: config.BASE_SERVER_URL+'/get?uid='+post.uid+'&hash='+post.hash} } />:
                            <WebView
                                source={ {uri: config.BASE_SERVER_URL+'?hash='+post.hash} }
                                style={ {height: 164} }
                            />
                }
            </ListItem>
            
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
                        <Logo size={40} text='Cloud' />
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
    itemImageStyle: {
        flex: 1,
        flexDirection: 'row',
        height: 256
    }
});