/* eslint-disable react/prop-types */
import * as React from 'react';
import { useState } from 'react';
import Share from 'react-native-share';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import Card from './Card';
import Colors from '../constants/Styles';
import {  PermissionsAndroid } from 'react-native';
import MultiColorView from './MultiColorView';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { logEvent, notifyMessage, sendClientError } from '../libs/Helpers';
import ViewShot from 'react-native-view-shot';
import { UndoDialog } from '../components/CommonDialogs';

import RNFS from 'react-native-fs';

import PropTypes from 'prop-types';
import { Menu, MenuItem } from 'react-native-material-menu';
import useApplicationStore from '../hooks/useApplicationStore';

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
    <Feather style={styles.actionButton} size={20} name="more-horizontal" />
  </TouchableOpacity>
);

export const PaletteCard = (props) => {
  const { colors, name, navigation, paletteId } = props;
  const [animationType, setAnimationType] = React.useState('fadeInUpBig');
  const viewShotRef = React.useRef();
  const { deletePalette } = useApplicationStore();
  const [isDeleteActive, setIsDeleteActive] = React.useState(false);
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);
  let timer = React.useRef(null);

  const deletePaletteLocal = React.useCallback(() => {
    setIsDeleteActive(true);
    timer.current = setTimeout(() => {
      deletePalette(paletteId);
    }, 2000);
  }, [deletePalette, paletteId]);

  const undoDeletion = React.useCallback(() => {
    setIsDeleteActive(false);
    setAnimationType('fadeInRightBig');
    clearTimeout(timer.current);
  }, []);

  const onDownload = async () => {
    logEvent('home_screen_palette_card_download', colors.length + '');
    
    try {
      const uri = await viewShotRef.current.capture();
      let granted = Platform.OS == 'ios';
      
      if (Platform.OS === 'android') {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to export color palette to png image.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
      }
  
      const downloadPath =
        Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath;
  
      let path = downloadPath + '/' + name + '.png';
      const isFileExists = await RNFS.exists(path);
      
      if (isFileExists) {
        path = downloadPath + '/' + name + Math.floor(Math.random() * 100000) + '.png';
      }
      
      // Save the captured image to the device
      await RNFS.copyFile(uri, path);
  
      const shareOptions = {
        title: 'Share Palette Image',
        url: `file://${path}`, // The file path to be shared
        type: 'image/png',
        failOnCancel: false,
      };
  
      // Share the file using react-native-share
      Share.open(shareOptions)
        .then((res) => {
          console.log('Share response: ', res);
          notifyMessage('Palette shared successfully.');
        })
        .catch((err) => {
          console.log('Error while sharing: ', err);
          if (err && err.message) {
            notifyMessage('Error: ' + err.message);
          }
          sendClientError('home_screen_palette_card_download', err.toString());
        });
      
      if (!granted) {
        sendClientError('home_screen_palette_card_download', 'Permission denied for storage');
      }
    } catch (error) {
      console.error('Error during download: ', error);
      notifyMessage('Error: ' + error.toString());
      sendClientError('home_screen_palette_card_download', error.toString());
    }
  };

  const onShare = async () => {
    try {
      logEvent('home_screen_palette_card_share', colors.length + '');
  
      const paletteUrl = `https://huehive.co/color_palettes/${colors
        .map((colorObj) => colorObj.color.replace('#', '').toLowerCase())
        .join('-')}?name=${encodeURIComponent(name)}`;
  
      const shareMessage = `HueHive - Palette Manager\nColors:\n${colors
        .map((colorObj) => colorObj.color)
        .join('\n')}\n`;
  
      const shareOptions = {
        title: 'Share Palette',
        message: shareMessage,
        url: paletteUrl,
        failOnCancel: false,
      };
  
      // Use react-native-share to open the share dialog
      const result = await Share.open(shareOptions);
  
      if (result) {
        console.log('Shared successfully:', result);
        // Handle result based on platform-specific response, if necessary
      } else {
        console.log('Share dismissed or failed');
      }
      hideMenu();
    } catch (error) {
      console.error('Error while sharing: ', error);
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
            navigation.navigate('Palette', {
              paletteId
            });
          }}
          animationType={animationType}>
          <ViewShot
            ref={viewShotRef}
            options={{ fileName: name + '.png', format: 'png', quality: 0.9 }}>
            <MultiColorView {...props}></MultiColorView>
          </ViewShot>
          <View style={styles.info}>
            <Text style={styles.label}>
              {name.substring(0, 50) + (name.length > 50 ? '...' : '')}
            </Text>
            <View style={styles.actionButtonsView}>
              <Menu
                key="palette-menu"
                visible={visible}
                anchor={<MenuAnchor onPress={showMenu} />}
                onRequestClose={hideMenu}>
                <MenuItemWrapper onPress={ () => {
                  //hideMenu();
                  onShare();

                }} icon="share" label="Share" />
                {Platform.OS == 'android' && <MenuItemWrapper onPress={ () => { // It is not working in iOS. Need to debug and enable it.
                  hideMenu();
                  onDownload();
                }} icon="download" label="Export" />
                }
                <MenuItemWrapper
                  onPress={() => {
                    hideMenu();
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
                    hideMenu();
                    logEvent('home_screen_open_in_generator');
                    navigation.navigate('ColorList', { colors: colors });
                  }}
                  icon="code-fork"
                  label="Fork"
                />
                <MenuItemWrapper
                  onPress={() => {
                    hideMenu();
                    navigation.navigate('PaletteEdit', { paletteId });
                  }}
                  icon="edit"
                  label="Edit"
                />
              </Menu>
            </View>
          </View>
        </Card>
      ) : (
        <UndoDialog key={name} name={name} undoDeletion={undoDeletion} />
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
  info: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionButtonsView: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  actionButton: {
    padding: 4
  },
  label: {
    flex: 1,
    marginHorizontal: 8,
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
