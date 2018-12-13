import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
import { Button, Text, Icon, Footer, FooterTab, StyleProvider } from "native-base";
import getTheme from '../../../../native-base-theme/components';
import commonTheme from '../../../../native-base-theme/variables/commonColor';
//LOCAL
import Forum from './Forum';
import Videos from './Videos';
import Images from './Images';
import Cloud from './Cloud';
import Add from './Add';

export default TabNavigator(
    {
        Forum: { screen: Forum },
        Videos: { screen: Videos },
        Images: { screen: Images },
        Cloud: { screen: Cloud },
        Add: { screen: Add }
    },
    {
        initialRouteName: 'Forum',
        tabBarPosition: 'bottom',
        tabBarComponent: props => {
            return (
                <StyleProvider style={ getTheme(commonTheme) }>
                    <Footer style={ {elevation: 24} }>
                        <FooterTab>
                            <Button
                            active={props.navigationState.index === 0}
                            onPress={() => props.navigation.navigate("Forum")}>
                            <Icon name={ props.navigationState.index===0?"ios-text":"ios-text-outline" } />
                            </Button>
                            <Button
                            active={props.navigationState.index === 1}
                            onPress={() => props.navigation.navigate("Videos")}>
                            <Icon name={ props.navigationState.index===1?"ios-videocam":"ios-videocam-outline" } />
                            </Button>
                            <Button
                            active={props.navigationState.index === 2}
                            onPress={() => props.navigation.navigate("Images")}>
                            <Icon name={ props.navigationState.index===2?"ios-camera":"ios-camera-outline" } />
                            </Button>
                            <Button
                            active={props.navigationState.index === 3}
                            onPress={() => props.navigation.navigate("Cloud")}>
                            <Icon name={ props.navigationState.index===3?"ios-cloud":"ios-cloud-outline" } />
                            </Button>
                            <Button
                            active={props.navigationState.index === 4}
                            onPress={() => props.navigation.navigate("Add")}>
                            <Icon name={ props.navigationState.index===4?"md-add":"ios-add-outline" } />
                            </Button>
                        </FooterTab>
                    </Footer>
                </StyleProvider>
            );
        }
    }
);