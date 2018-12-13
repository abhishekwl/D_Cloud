import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
//LOCAL
import config from '../../../config';

export default class Logo extends React.PureComponent {
    render() {
        const {
            containerStyle,
            logoTextStyle
        } = styles;

        return (
            <View style={ containerStyle }>
                <LottieView
                    source={ require('../../../assets/lottie/cloud_loader.json') }
                    style={ {height: this.props.size*1.5, width: this.props.size*1.5} }
                    autoPlay
                    loop
                />
                <Text style={ [logoTextStyle, { fontSize: this.props.size }] }>{ this.props.text?this.props.text:config.APP_NAME }</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    logoTextStyle: {
        color: config.COLOR_TEXT_DARK,
        fontFamily: 'righteous',
        marginLeft: 16
    }
});