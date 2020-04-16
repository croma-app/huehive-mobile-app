import React, { useState } from "react";
import {
    StyleSheet,
    Platform,
    Linking,
    ToastAndroid
} from "react-native";
import Colors from "../constants/Colors";
import ColorPicker from "../libs/ColorPicker";
import ActionButton from "react-native-action-button";
import { Ionicons, Entypo } from "@expo/vector-icons";

const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        base64: true
    });
    if (result.base64 !== undefined) {
        return await Jimp.read(new Buffer(result.base64, "base64"));
    } else {
        return await Jimp.read(result.uri);
    }
};

const ActionButtonWeb = (props) => {
    const [isActionButtonOn, setIsActionButtonOn] = useState(false);
    const commanStyle = {
        position: 'fixed',
        bottom: 100,
        right: 30,
        width: 55,
        height: 55,
        borderRadius: '100%',
        boxSizing: 'border-box',
        cursor: 'pointer',
    }
    const conditionalCss = {}
    conditionalCss['transitionDuration'] = '0.5s';
    if (isActionButtonOn) {
        conditionalCss['transform'] = 'rotate(45deg)';
    }
    return <div style={{
        position: 'absolute',
        height: '100%',
        width: '100%'
    }}>
        <div style={{
            color: '#fff',
            backgroundColor: 'rgb(240, 208, 76)',
            textAlign: 'center',
            fontSize: 30,
            padding: 7,
            zIndex: 1,
            ...commanStyle,
            ...conditionalCss
        }}
            onClick={() => { setIsActionButtonOn(!isActionButtonOn) }}
        >
            +
        </div>
        {
            isActionButtonOn &&
            <div >
                <div style={{
                    backgroundColor: '#000',
                    width: '100%',
                    height: '100%',
                    opacity: 0.35,
                    position: 'absolute'
                }}></div>
                <div
                    style={{
                        ...commanStyle,
                        bottom: commanStyle.bottom + 400,
                        backgroundColor: '#9b59b6',
                        padding: '16px 18px',
                    }}
                    onClick={
                        () => {
                            props.setPickImgLoading(true);
                            pickImage()
                                .then((image, err) => {
                                    setPickImgLoading(false);
                                    props.navigation.navigate("ColorList", {
                                        colors: ColorPicker.getProminentColors(image)
                                    });
                                })
                                .catch(err => {
                                    if (Platform.OS == 'android') {
                                        ToastAndroid.show("Error while processing image: " + err, ToastAndroid.LONG);
                                    }
                                    props.setPickImgLoading(false);
                                });
                        }
                    }
                >
                    <a title='Get palette from image'>
                        <Ionicons name="md-camera" style={styles.actionButtonIcon} />
                    </a>
                </div>
                <div
                    style={{
                        ...commanStyle,
                        bottom: commanStyle.bottom + 300,
                        backgroundColor: '#3498db',
                        padding: '16px 18px',
                    }}
                    onClick={
                        () => {
                            props.navigation.navigate("ColorPicker", {
                                onDone: color => {
                                    props.navigation.navigate("Palettes", {
                                        color: color.color
                                    });
                                }
                            });
                        }
                    }
                >
                    <a title='Get palette from color'>
                        <Ionicons name="md-color-palette" style={styles.actionButtonIcon} />
                    </a>
                </div>
                <div
                    style={{
                        ...commanStyle,
                        bottom: commanStyle.bottom + 200,
                        backgroundColor: '#1abc9c',
                        padding: '16px 18px'
                    }}
                    onClick={() => props.navigation.navigate("AddPaletteManually")}
                >
                    <a title='Add colors manually'>
                        <Ionicons name="md-color-filter" style={styles.actionButtonIcon} />
                    </a>
                </div>
                <div
                    style={{
                        ...commanStyle,
                        bottom: commanStyle.bottom + 100,
                        backgroundColor: Colors.primary,
                        padding: '16px 18px',
                    }}
                    onClick={() =>
                        Linking.openURL(
                            "https://play.google.com/store/apps/details?id=app.croma"
                        )
                    }
                >
                    <a title='Get croma on playstore'>
                        <Entypo name="google-play" style={styles.actionButtonIcon} />
                    </a>
                </div>
            </div>
        }
    </div >
}


const HomeActionButton = (props) => {
    //Setting box shadow to false because of Issue on the web: https://github.com/mastermoo/react-native-action-button/issues/337 
    return Platform.OS === 'web' ? // The Fab is the main button. Pass any component to the icon prop and choose 
        // either click or hover for the event (default is hover)
        <ActionButtonWeb {...props} /> : <ActionButton
            bgColor="rgba(68, 68, 68, 0.6)"
            hideShadow={Platform.OS === "web" ? true : false}
            buttonColor={Colors.accent}
            offsetY={60}
            key="action-button-home"
        >
            <ActionButton.Item
                buttonColor="#9b59b6"
                title="Get palette from image"
                onPress={() => {
                    props.setPickImgLoading(true);
                    pickImage()
                        .then((image, err) => {
                            setPickImgLoading(false);
                            props.navigation.navigate("ColorList", {
                                colors: ColorPicker.getProminentColors(image)
                            });
                        })
                        .catch(err => {
                            if (Platform.OS == 'android') {
                                ToastAndroid.show("Error while processing image: " + err, ToastAndroid.LONG);
                            }
                            props.setPickImgLoading(false);
                        });
                }}
            >
                <Ionicons name="md-camera" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
                title="Get palette from color"
                buttonColor="#3498db"
                onPress={() => {
                    props.navigation.navigate("ColorPicker", {
                        onDone: color => {
                            props.navigation.navigate("Palettes", {
                                color: color.color
                            });
                        }
                    });
                }}
            >
                <Ionicons name="md-color-palette" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
                buttonColor="#1abc9c"
                title="Add colors manually"
                onPress={() => props.navigation.navigate("AddPaletteManually")}
            >
                <Ionicons name="md-color-filter" style={styles.actionButtonIcon} />
            </ActionButton.Item>

            {!isPro && (
                <ActionButton.Item
                    buttonColor={Colors.primary}
                    title="Unlock pro"
                    onPress={() => {
                        purchase();
                    }}
                >
                    <Ionicons name="md-unlock" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            )}
        </ActionButton>
}

export default HomeActionButton;

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: "white"
    }
});
