import * as React from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import Card from './Card';
import Colors from '../constants/Colors';
import { Share, PermissionsAndroid } from 'react-native';

import MultiColorView from './MultiColorView';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CromaContext } from '../store/store';
import { logEvent, notifyMessage } from '../libs/Helpers';
import ViewShot from 'react-native-view-shot';
const RNFS = require('react-native-fs');
import { t } from 'i18next';
import RNFetchBlob from 'rn-fetch-blob';
import PropTypes from 'prop-types';

export const PaletteCard = (props) => {
  console.log({ props });
  const [shared] = React.useState(false);
  const [animationType, setAnimationType] = React.useState('fadeInLeftBig');
  const viewShotRef = React.useRef();
  const { deletePaletteByName, setCurrentPalette } = React.useContext(CromaContext);
  const onDownload = async () => {
    logEvent('home_screen_palette_card_download', props.colors.length + '');
    try {
      const uri = await viewShotRef.current.capture();
      let granted = Platform.OS == 'ios';
      if (Platform.OS == 'android') {
        granted =
          (await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          )) === PermissionsAndroid.RESULTS.GRANTED;
      }
      const downloadPath =
        Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath;
      if (granted) {
        let path = downloadPath + '/' + props.name + '.png';
        const isFileExists = await RNFS.exists(path);
        if (isFileExists) {
          path = downloadPath + '/' + props.name + Math.floor(Math.random() * 100000) + '.png';
        }
        // write a new file
        await RNFS.copyFile(uri, path);
        if (Platform.OS == 'android') {
          RNFetchBlob.android.addCompleteDownload({
            title: props.name,
            description: t('Download complete'),
            mime: 'image/png',
            path: path,
            showNotification: true
          });
        }
        if (Platform.OS == 'ios') {
          await RNFetchBlob.ios.previewDocument(path);
        }
      } else {
        notifyMessage('Please give storage permission to download png.');
      }
    } catch (error) {
      notifyMessage('Error: ' + error.toString());
    }
  };

  const onShare = async () => {
    try {
      logEvent('home_screen_palette_card_share', props.colors.length + '');
      const result = await Share.share({
        message: `Croma - Palette Manager\nColors:\n${props.colors
          .map((colorObj) => colorObj.color)
          .join('\n')}

          https://web.croma.app/Main/SavePalette?name=${encodeURIComponent(
            props.name
          )}&colors=${encodeURIComponent(JSON.stringify(props.colors))}`
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <Card
      {...props}
      onPress={() => {
        setCurrentPalette({ name: props.name });
        props.navigation.navigate('Palette');
      }}
      animationType={animationType}>
      <ViewShot
        ref={viewShotRef}
        options={{ fileName: props.name + '.png', format: 'png', quality: 0.9 }}>
        <MultiColorView {...props}></MultiColorView>
      </ViewShot>
      <View style={styles.bottom}>
        <Text style={styles.label}>{props.name}</Text>
        <View style={styles.actionButtonsView}>
          {shared && (
            <Text
              style={{
                position: 'absolute',
                backgroundColor: 'rgb(64, 64, 58)',
                top: '-35px',
                right: '-10px',
                width: '148px',
                color: '#fff',
                padding: '5px ',
                textAlign: 'center',
                borderRadius: '6px'
              }}>
              Copied to Clipboard!
            </Text>
          )}
          <TouchableOpacity onPress={onDownload} style={styles.actionButton}>
            <FontAwesome size={20} name="download" />
          </TouchableOpacity>

          {Platform.OS === 'web' ? (
            <TouchableOpacity onClick={onShareWeb} style={styles.actionButton}>
              <FontAwesome size={20} name="share" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onShare} style={styles.actionButton}>
              <FontAwesome size={20} name="share" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            {...{
              [Platform.OS === 'web' ? 'onClick' : 'onPress']: (event) => {
                event.preventDefault();
                event.stopPropagation();
                setAnimationType('fadeOutRightBig');
                setTimeout(() => {
                  deletePaletteByName(props.name);
                }, 500);
              }
            }}
            style={styles.actionButton}>
            <FontAwesome size={20} name="trash" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

PaletteCard.propTypes = {
  name: PropTypes.string,
  colors: PropTypes.array,
  navigation: PropTypes.any,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func
};

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    height: 54
  },
  actionButtonsView: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  actionButton: {
    padding: 8
  },
  label: {
    flex: 1,
    marginHorizontal: 16,
    color: Colors.darkGrey
  }
});
