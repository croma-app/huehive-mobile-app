import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { logEvent } from '../libs/Helpers';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import useUserData from '../hooks/useUserData';
import useAuth from '../hooks/useAuth';
import useApplicationStore from '../hooks/useApplicationStore';

const HamburgerMenu = (props) => {
  const { t } = useTranslation();
  const { userData } = useUserData();
  const { openAuthOverlay } = useAuth();
  const { clearPalette } = useApplicationStore();
  const navigate = function (screen) {
    props.toggleSideMenu();
    props.navigation.navigate(screen);
  };
  return (
    <SafeAreaView style={[styles.container]}>
      {userData ? (
        <TouchableOpacity
          onPress={() => {
            if (userData) {
              navigate('UserProfile');
            }
          }}>
          <View style={[styles.titleArea, { height: props.navigation.headerHeight }]}>
            <Image style={styles.logo} source={{ uri: userData.avatar_url }} />
            <Text style={styles.headerText}>{userData.fullName}</Text>
          </View>
          <View style={styles.horizontalLine}></View>
        </TouchableOpacity>
      ) : (
        <View>
          <View style={[styles.titleArea, { height: props.navigation.headerHeight }]}>
            <Image style={styles.logo} source={require('../assets/images/icon.png')} />
            <Text style={styles.headerText}>{t('Huehive (Color palette app)')}</Text>
          </View>
          <View style={styles.horizontalLine}></View>
        </View>
      )}

      <ScrollView>
        {userData && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={async () => {
              logEvent('hm_chat_session_histories');
              navigate('ChatSessionHistories');
            }}>
            <View style={styles.menuItemView}>
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="history" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>{t('Huehive AI chat history')}</Text>
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.menu}>
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
              <Text style={styles.textAreaMenuItem}>{t('Explore palettes')}</Text>
            </View>
          </TouchableOpacity>
          {
            <MenuLink
              id={'rate-us'}
              link={
                Platform.OS == 'android'
                  ? 'market://details?id=app.croma'
                  : 'https://apps.apple.com/app/id1596763657?action=write-review'
              }
              icon={<MaterialIcons name="star" style={styles.icon} />}>
              {t('Rate us on playstore')}
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
                <Ionicons name="information-circle" style={styles.icon} />
              </View>
              <Text style={[styles.textAreaMenuItem]}>{t('About us')}</Text>
            </View>
          </TouchableOpacity>
          {!userData && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={async () => {
                logEvent('hm_login');
                openAuthOverlay();
                props.toggleSideMenu();
              }}>
              <View style={styles.menuItemView}>
                <View style={{ ...styles.menuIcon, paddingLeft: 4 }}>
                  <MaterialCommunityIcons name="login" style={styles.icon} />
                </View>
                <Text style={[styles.textAreaMenuItem]}>{t('Login/Signup')}</Text>
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
        <View>{props.icon}</View>
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

const menuHeight = 70;
const padding = 10;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: -4
  },
  titleArea: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: padding
  },
  logo: {
    width: 48,
    height: 48,
    padding: padding,
    borderRadius: 24,
    marginBottom: 10
  },
  title: {
    color: 'black'
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
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  textAreaMenuItem: {
    fontWeight: '500',
    fontSize: 16
  },
  icon: {
    fontSize: (menuHeight - 2 * padding) * (6 / 10),
    padding: padding,
    color: '#434343'
  },
  headerText: {
    fontSize: 18
  },
  horizontalLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#ccc'
  }
});

export default HamburgerMenu;
