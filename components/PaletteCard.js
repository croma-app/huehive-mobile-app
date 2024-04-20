import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import Card from './Card';
import Colors from '../constants/Colors';
import { Share, PermissionsAndroid } from 'react-native';

import MultiColorView from './MultiColorView';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CromaContext } from '../store/store';
import { logEvent, notifyMessage, sendClientError } from '../libs/Helpers';
import ViewShot from 'react-native-view-shot';
import { UndoDialog } from '../components/CommonDialogs';

import RNFS from 'react-native-fs';
import { t } from 'i18next';
import RNFetchBlob from 'rn-fetch-blob';

import PropTypes from 'prop-types';
import { Menu, MenuItem } from 'react-native-material-menu';

const MenuItemWrapper = ({ onPress, icon, label }) => (
  <MenuItem onPress={onPress}>
    <View style={styles.menuItemContainer}>
      <View style={styles.menuItemIconContainer}>
        <FontAwesome size={20} name={icon} />
      </View>
      <Text style={styles.menuItemText}>{label}</Text>
    </View>
  </MenuItem>
);

const MenuAnchor = ({ onPress }) => (
  <TouchableOpacity style={styles.menuAnchorContainer} onPress={onPress}>
    <FontAwesome style={styles.actionButton} size={20} name="ellipsis-v" />
    <View style={styles.menuAnchor} />
  </TouchableOpacity>
);

export const PaletteCard = (props) => {
  const [animationType, setAnimationType] = React.useState('fadeInLeftBig');
  const viewShotRef = React.useRef();
  const { deletePalette, setCurrentPalette } = React.useContext(CromaContext);
  const [isDeleteActive, setIsDeleteActive] = React.useState(false);
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);
  let timer = React.useRef(null);

  const deletePaletteLocal = React.useCallback(() => {
    hideMenu();
    setIsDeleteActive(true);
    timer.current = setTimeout(() => {
      deletePalette(props.paletteId);
    }, 2000);
  }, [deletePalette, props.paletteId]);

  const undoDeletion = React.useCallback(() => {
    setIsDeleteActive(false);
    setAnimationType('fadeInRightBig');
    clearTimeout(timer.current);
  }, []);

  const onDownload = async () => {
    logEvent('home_screen_palette_card_download', props.colors.length + '');
    try {
      const uri = await viewShotRef.current.capture();
      let granted = Platform.OS == 'ios';
      if (Platform.OS == 'android') {
        // Download works without this permission also in some devices. Need to explore this more. For now keeping it for the safer side. Will monitor events and errors.
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to export color palette to png image.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        });
      }
      const downloadPath =
        Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath;

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
        notifyMessage('Palette exported. Check download status in notifications.');
      }
      if (Platform.OS == 'ios') {
        await RNFetchBlob.ios.previewDocument(path);
      }

      if (!granted) {
        sendClientError('home_screen_palette_card_download', 'Permission denied for storage');
      }
    } catch (error) {
      notifyMessage('Error: ' + error.toString());
      sendClientError('home_screen_palette_card_download', error.toString());
    }
  };

  const onShare = async () => {
    try {
      logEvent('home_screen_palette_card_share', props.colors.length + '');
      // https://huehive.co/color_palettes/f8a6a1-dcdcdc-f2b3ad-e0e0e0-aec6cf-c4c4c4
      const result = await Share.share({
        message: `HueHive - Palette Manager\nColors:\n${props.colors
          .map((colorObj) => colorObj.color)
          .join('\n')}

          https://huehive.co/color_palettes/${props.colors
            .map((colorObj) => colorObj.color.replace('#', '').toLowerCase())
            .join('-')}?name=${encodeURIComponent(props.name)}`
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
      notifyMessage('Error while sharing: ' + error.message);
      sendClientError('home_screen_palette_card_share', error.toString());
    }
  };
  return (
    <>
      {!isDeleteActive ? (
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
            <Text style={styles.label}>
              {props.name.substring(0, 50) + (props.name.length > 50 ? '...' : '')}
            </Text>
            <View style={styles.actionButtonsView}>
              <Menu
                key="palette-menu"
                visible={visible}
                anchor={<MenuAnchor onPress={showMenu} />}
                onRequestClose={hideMenu}>
                <MenuItemWrapper onPress={onShare} icon="share" label="Share" />
                <MenuItemWrapper onPress={onDownload} icon="download" label="Export" />
                <MenuItemWrapper
                  onPress={() => {
                    logEvent('home_screen_palette_card_delete');
                    setAnimationType('fadeOutRightBig');
                    setTimeout(() => {
                      deletePaletteLocal();
                    }, 500);
                  }}
                  icon="trash"
                  label="Delete"
                />
                <MenuItemWrapper
                  onPress={() => {
                    logEvent('home_screen_open_in_generator');
                    props.navigation.navigate('ColorList', { colors: props.colors });
                  }}
                  icon="code-fork"
                  label="Fork"
                />
                <MenuItemWrapper
                  onPress={() => {
                    logEvent('home_screen_edit');
                    setCurrentPalette({ name: props.name });
                    props.navigation.navigate('Palette');
                  }}
                  icon="edit"
                  label="Edit"
                />
              </Menu>
            </View>
          </View>
        </Card>
      ) : (
        <UndoDialog key={props.name} name={props.name} undoDeletion={undoDeletion} />
      )}
    </>
  );
};

PaletteCard.propTypes = {
  name: PropTypes.string,
  colors: PropTypes.array,
  navigation: PropTypes.any,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  paletteId: PropTypes.string
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
  },
  menuAnchorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingStart: 8,
    paddingEnd: 8
  },
  menuAnchor: {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: 20,
    height: 20
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionButtonText: {
    fontSize: 16,
    marginStart: 8,
    flex: 1,
    textAlign: 'center'
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  menuItemIconContainer: {
    width: 24,
    alignItems: 'flex-start'
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 8
  }
});
