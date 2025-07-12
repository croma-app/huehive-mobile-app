import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  Platform,
  NativeModules,
  Modal,
  Image
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Styles';
import React, { useState, useEffect, useRef } from 'react';
import { material } from 'react-native-typography';
import { logEvent, notifyMessage } from '../libs/Helpers';
import useApplicationStore from '../hooks/useApplicationStore';
import AdBanner from '../components/AdBanner';
import RNColorThief from 'react-native-color-thief';
import Color from 'pigment/full';
import ColorPickerModal from '../components/ColorPickerModal';
import MultiColorView from '../components/MultiColorView';
import LinearGradient from 'react-native-linear-gradient';


const ChatSessionScreen = (props) => {
  const { navigation } = props;
  const [userQuery, setUserQuery] = useState('');
  const scrollViewRef = useRef();
  const { pro } = useApplicationStore();

  // --- New state for modals and palette extraction ---
  const [pickImageLoading, setPickImageLoading] = useState(false);
  const [isImagePickerModalVisible, setIsImagePickerModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [automaticColors, setAutomaticColors] = useState([]);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  // Tip banner state
  const [showTip, setShowTip] = useState(true);

  // --- Handlers for image palette extraction ---
  const pickImageResult = async () => {
    setPickImageLoading(true);
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
      return result;
    } finally {
      setPickImageLoading(false);
    }
  };

  const handleImageButton = async () => {
    try {
      const result = await pickImageResult();
      if (!result.didCancel && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0]);
        setIsImagePickerModalVisible(true);
        try {
          const pickedColors = await RNColorThief.getPalette(result.assets[0].uri, 6, 10, false);
          setAutomaticColors(
            pickedColors.map((colorThiefColor) => {
              const hex = new Color(
                'rgb(' +
                  colorThiefColor.r +
                  ', ' +
                  colorThiefColor.g +
                  ', ' +
                  colorThiefColor.b +
                  ')'
              ).tohex();
              return { color: hex };
            })
          );
        } catch (error) {
          notifyMessage('Error while extracting colors - ' + error);
          setAutomaticColors([{ color: '#000000' }]);
        }
      }
    } catch (error) {
      notifyMessage('Image selection failed.');
    }
  };
  const handleImageModalNext = () => {
    navigation.navigate('ColorList', { colors: automaticColors });
    setIsImagePickerModalVisible(false);
    setSelectedImage(null);
    setAutomaticColors([]);
  };

  // --- Handler for color picker ---
  const handleColorPickerButton = () => {
    setIsColorPickerVisible(true);
  };
  const handleColorSelected = (color) => {
    setIsColorPickerVisible(false);
    navigation.navigate('ColorList', { colors: [{ color }] });
  };

  useEffect(() => {
    logEvent('chat_session_follow_up_screen');
  }, []);

  // Only keep the first 4 options in featureList, and improve the design
  const featureList = [
    Platform.OS === 'android' && {
      key: 'camera',
      label: 'Camera',
      icon: <MaterialCommunityIcons name="camera" size={22} color={'#222'} />,
      iconBg: '#F7F9FC',
      onPress: async () => {
        const pickedColors = await NativeModules.CromaModule.navigateToColorPicker();
        navigation.navigate('ColorList', { colors: JSON.parse(pickedColors)?.colors });
      }
    },
    {
      key: 'image',
      label: 'Image',
      icon: <MaterialCommunityIcons name="image" size={22} color={'#222'} />,
      iconBg: '#F7F9FC',
      onPress: handleImageButton
    },
    {
      key: 'color',
      label: 'Color Picker',
      icon: <MaterialIcons name="palette" size={22} color={'#222'} />,
      iconBg: '#F7F9FC',
      onPress: handleColorPickerButton
    },
    {
      key: 'quick',
      label: 'Quick',
      icon: <MaterialCommunityIcons name="shuffle-variant" size={22} color={'#222'} />,
      iconBg: '#F7F9FC',
      onPress: () => {
        const colorsHex = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E67E22'];
        const randomColors = colorsHex.map((colorHex) => ({ color: colorHex, locked: false }));
        navigation.navigate('ColorList', { colors: randomColors });
      }
    }
  ].filter(Boolean);

  return (
    <LinearGradient colors={["#F4F7FB", "#E9F0FF", "#F4F7FB"]} style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <View style={styles.bgImageOpecity}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.chat_container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.searchContainer}>
              <Text style={styles.searchTitle}>Welcome to HueHive AI!</Text>
              {/* Onboarding/Tip Banner */}
              {showTip && (
                <View style={styles.tipBanner}>
                  <Text style={styles.tipText}>💡 Tip: Try generating a palette with your favorite movie or theme!</Text>
                  <TouchableOpacity onPress={() => setShowTip(false)} style={styles.tipCloseBtn}>
                    <Text style={styles.tipCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.searchInputContainer}>
                <View style={styles.searchBoxRow}>
                  <TextInput
                    style={styles.input}
                    value={userQuery}
                    onChangeText={setUserQuery}
                    placeholder="Generate a Barbie movie color palette."
                    placeholderTextColor="#A0A7B8"
                    onSubmitEditing={() => {
                      if (userQuery.trim() !== '') {
                        navigation.navigate('ChatSession', { userQuery: userQuery });
                        setUserQuery('');
                      }
                    }}
                    returnKeyType="search"
                  />
                  <TouchableOpacity
                    disabled={userQuery.trim() === ''}
                    onPress={() => {
                      navigation.navigate('ChatSession', { userQuery: userQuery });
                      setUserQuery('');
                    }}
                    style={userQuery.trim() === '' ? styles.disableGenerateButton : styles.generateButtonIcon}>
                    <FontAwesome
                      name="magic"
                      color={'white'}
                      size={20}
                      style={{ marginTop: 1 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Microcopy below search box */}
              <Text style={styles.microcopy}>Describe a mood, theme, or object to generate a palette with AI.</Text>
            </View>
            {/* Move feature grid and heading to the bottom */}
            <View style={{ height: 32 }} />
            <Text style={styles.featureGridHeadingSubtle}>Other ways to create a palette</Text>
            <View style={styles.featureGrid}>
              {featureList.map((feature) => (
                <TouchableOpacity
                  key={feature.key}
                  style={styles.featureCircleBtn}
                  activeOpacity={0.7}
                  onPress={feature.onPress}>
                  <View style={[styles.featureCircleIcon, { backgroundColor: feature.iconBg }]}>{feature.icon}</View>
                  <Text style={styles.featureCircleLabelBlack}>{feature.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {Platform.OS == 'android' && <AdBanner plan={pro.plan} />}
        </View>
        {/* Image Palette Extraction Modal */}
        <Modal
          visible={isImagePickerModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setIsImagePickerModalVisible(false);
            setSelectedImage(null);
            setAutomaticColors([]);
          }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
            activeOpacity={1}
            onPressOut={() => {
              setIsImagePickerModalVisible(false);
              setSelectedImage(null);
              setAutomaticColors([]);
            }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 20, width: 300 }}>
                {selectedImage && (
                  <Image source={{ uri: selectedImage.uri }} style={{ width: 220, height: 120, borderRadius: 8, alignSelf: 'center' }} />
                )}
                <Text style={{ marginTop: 12, marginBottom: 8, fontWeight: 'bold', textAlign: 'center' }}>Extracted Palette</Text>
                <MultiColorView colors={automaticColors} />
                <TouchableOpacity style={{ marginTop: 18, backgroundColor: Colors.primary, borderRadius: 8, padding: 10, alignItems: 'center' }} onPress={handleImageModalNext}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        {/* Color Picker Modal */}
        <Modal
          visible={isColorPickerVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsColorPickerVisible(false)}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} activeOpacity={1} onPressOut={() => setIsColorPickerVisible(false)}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 10, width: 320, height: 420, maxWidth: '90%', maxHeight: '80%', justifyContent: 'center' }}>
                <ColorPickerModal onColorSelected={handleColorSelected} onClose={() => setIsColorPickerVisible(false)} />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  chat_container: {
    flex: 1,
    padding: 5
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  bgImageOpecity: {
    flex: 1
  },
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  searchTitle: {
    ...material.headline,
    textAlign: 'center',
    marginBottom: 10
  },
  searchSubtitle: {
    ...material.body1,
    textAlign: 'center',
    marginBottom: 20
  },
  searchInputContainer: {
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
  },
  searchBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: '#222B45',
    paddingLeft: 0,
    paddingRight: 8,
  },
  generateButtonIcon: {
    backgroundColor: Colors.primary,
    borderRadius: 22,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    shadowColor: Colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  disableGenerateButton: {
    backgroundColor: '#C5C9D6',
    borderRadius: 22,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  textGenerate: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16
  },
  featureCircleBtn: {
    alignItems: 'center',
    marginHorizontal: 14,
    marginVertical: 4,
    width: 68,
  },
  featureCircleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 6,
  },
  featureCircleLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    textAlign: 'center',
    marginTop: 2
  },
  featureCircleLabelBlack: {
    fontSize: 12,
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
    marginTop: 2
  },
  tipBanner: {
    backgroundColor: '#E6F0FF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    maxWidth: 400,
    alignSelf: 'center',
  },
  tipText: {
    color: '#3A4A6B',
    fontSize: 14,
    flex: 1,
  },
  tipCloseBtn: {
    marginLeft: 10,
    padding: 4,
  },
  tipCloseText: {
    fontSize: 16,
    color: '#3A4A6B',
    opacity: 0.5,
  },
  microcopy: {
    color: '#7A869A',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 2,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  featureGridHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3A4A6B',
    marginTop: 18,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  featureGridHeadingSubtle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A0A7B8',
    marginTop: 18,
    marginBottom: 2,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});

export default ChatSessionScreen;
