import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  NativeModules,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity
} from 'react-native';
import Colors from '../constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { logEvent } from '../libs/Helpers';
import { ScrollView } from 'react-native-gesture-handler';
import { launchImageLibrary } from 'react-native-image-picker';
import { CromaContext } from '../store/store';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { retrieveUserSession } from '../libs/EncryptedStoreage';

const HamburgerMenu = (props) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState();

  const pickImageResult = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1
    });
    return result;
  };

  useEffect(() => {
    // check if already logged in
    (async () => {
      const userData = await retrieveUserSession();
      setUserData(userData);
    })();
  }, [props]);

  const { setColorList, clearPalette } = React.useContext(CromaContext);
  const navigate = function (screen) {
    props.toggleSideMenu();
    props.navigation.navigate(screen);
  };
  return (
    <SafeAreaView style={[styles.container]}>
      <TouchableOpacity
        onPress={() => {
          logEvent('hm_home_screen');
          userData ? navigate('Login') : navigate('Home');
        }}>
        <View style={[styles.titleArea, { height: props.navigation.headerHeight }]}>
          <Image
            style={styles.logo}
            source={
              userData
                ? { uri: userData.avatar_url }
                : // eslint-disable-next-line no-undef
                  require('../assets/images/icon.png')
            }
          />
          <Text>{userData ? userData.fullName : t('Croma - Save you colors')}</Text>
        </View>
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.menu}>
          {/* <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              logEvent('hm_create_new_palette');
              clearPalette();
              navigate('AddPaletteManually');
            }}>
            <View style={styles.menuItemView}>
              <View style={[styles.menuIcon, { paddingLeft: 4 }]}>
                <Ionicons name="md-color-filter" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>{t('Create new palette')}</Text>
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={async () => {
              logEvent('hm_palette_library');
              clearPalette();
              navigate('PaletteLibrary');
            }}>
            <View style={styles.menuItemView}>
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="palette-swatch" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>{t('Palette library')}</Text>
            </View>
          </TouchableOpacity>
          {/* {Platform.OS === 'android' && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => {
                const imageResult = await pickImageResult();
                if (!imageResult.didCancel) {
                  const pickedColors = await NativeModules.CromaModule.navigateToImageColorPicker(
                    imageResult.assets[0].uri
                  );
                  logEvent('hm_pick_colors_from_img', {
                    length: pickedColors.length
                  });
                  clearPalette();
                  setColorList(JSON.parse(pickedColors)?.colors);
                  navigate('ColorList');
                }
              }}>
              <View style={styles.menuItemView}>
                <View style={styles.menuIcon}>
                  <MaterialCommunityIcons name="image" style={styles.icon} />
                </View>
                <Text style={styles.textAreaMenuItem}>{t('Pick colors from an image')}</Text>
              </View>
            </TouchableOpacity>
          )} */}
          {/* {Platform.OS == 'android' && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => {
                const pickedColors = await NativeModules.CromaModule.navigateToColorPicker();
                logEvent('hm_pick_text_colors_from_camera', {
                  length: pickedColors.length
                });
                clearPalette();
                setColorList(JSON.parse(pickedColors)?.colors);
                navigate('ColorList');
              }}>
              <View style={styles.menuItemView}>
                <View style={styles.menuIcon}>
                  <MaterialCommunityIcons name="credit-card-scan-outline" style={styles.icon} />
                </View>
                <Text style={styles.textAreaMenuItem}>{t('Scan color codes')}</Text>
              </View>
            </TouchableOpacity>
          )} */}
          {
            <MenuLink
              id={'rate-us'}
              link={
                Platform.OS == 'android'
                  ? 'market://details?id=app.croma'
                  : 'https://apps.apple.com/app/id1596763657?action=write-review'
              }
              icon={<MaterialIcons name="rate-review" style={styles.icon} />}>
              {t('Like the App? Please rate us')}
            </MenuLink>
          }
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              logEvent('hm_pro_benefits');
              navigate('ProVersion');
            }}>
            <View style={styles.menuItemView}>
              <View style={[styles.menuIcon, { paddingLeft: 4 }]}>
                <FontAwesome5 name="unlock" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>{t('Pro benefits')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={async () => {
              logEvent('hm_sync_palettes');
              navigate('SyncPalettes');
            }}>
            <View style={styles.menuItemView}>
              <View style={styles.menuIcon}>
                <FontAwesome5 name="file-import" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>{t('import/export palettes')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={async () => {
              logEvent('hm_about_us');
              navigate('AboutUs');
            }}>
            <View style={styles.menuItemView}>
              <View style={{ ...styles.menuIcon, paddingLeft: 4 }}>
                <MaterialCommunityIcons name="information-outline" style={styles.icon} />
              </View>
              <Text style={[styles.textAreaMenuItem, styles.title]}>{t('About us')}</Text>
            </View>
          </TouchableOpacity>
          {!userData && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => {
                logEvent('hm_login');
                navigate('Login');
              }}>
              <View style={styles.menuItemView}>
                <View style={{ ...styles.menuIcon, paddingLeft: 4 }}>
                  <MaterialCommunityIcons name="login" style={styles.icon} />
                </View>
                <Text style={[styles.title, styles.textAreaMenuItem]}>{t('Login/Signup')}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

HamburgerMenu.propTypes = {
  navigation: PropTypes.any,
  toggleSideMenu: PropTypes.func
};

function MenuLink(props) {
  return (
    <TouchableOpacity
      style={[styles.menuItem]}
      onPress={() => {
        logEvent('hm_link_' + props.id);
        Linking.openURL(props.link);
      }}>
      <View style={styles.menuItemView}>
        <View style={styles.menuIcon}>{props.icon}</View>
        <Text style={styles.textAreaMenuItem}>{props.children}</Text>
      </View>
    </TouchableOpacity>
  );
}

MenuLink.propTypes = {
  id: PropTypes.string,
  link: PropTypes.string,
  icon: PropTypes.icon,
  children: PropTypes.children
};
const menuHeight = 50;
const padding = 10;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: -4
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: padding
  },
  logo: {
    width: 48,
    height: 48,
    padding: padding
  },
  title: {
    color: 'black'
    // textAlignVertical: 'center',
    // padding: padding,
    // color: Colors.primary
  },
  menu: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignSelf: 'stretch'
  },
  menuItem: {
    height: menuHeight
  },
  menuItemView: {
    flex: 1,
    flexDirection: 'row'
  },
  textAreaMenuItem: {
    fontWeight: '500',
    textAlignVertical: 'center',
    padding: padding,
    alignItems: 'flex-start'
  },
  menuIcon: {},
  icon: {
    fontSize: menuHeight - 2 * padding,
    padding: padding,
    color: 'black'
  }
});

export default HamburgerMenu;
