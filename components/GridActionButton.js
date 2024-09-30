import React from 'react';
import {
  NativeModules,
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Color from 'pigment/full';
import RNColorThief from 'react-native-color-thief';

import { notifyMessage, sendClientError } from '../libs/Helpers';
import { generateRandomColorPalette } from '../libs/ColorHelper';
import Colors from '../constants/Styles';
import ActionButtonContainer from './ActionButton';
import { logEvent } from '../libs/Helpers';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ColorPickerModal from './ColorPickerModal';
import useApplicationStore from '../hooks/useApplicationStore';
import MultiColorView from './MultiColorView';


const GridActionButtonAndroid = ({ navigation, setPickImageLoading }) => {
  const { t } = useTranslation();
  const [isColorPickerVisible, setIsColorPickerVisible] = React.useState(false);
  const [isImagePickerModalVisible, setIsImagePickerModalVisible] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [automaticColors, setAutomaticColors] = React.useState([]);

  const { pro } = useApplicationStore();

  const pickImageResult = async () => {
    setPickImageLoading(true);
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1
    });
    return result;
  };

  const handleColorSelected = (color) => {
    setIsColorPickerVisible(false);
    navigation.navigate('Palettes', { hexColor: color });
  };

  const handleImagePicker = async () => {
    logEvent('pick_colors_from_image');
    try {
      const imageResult = await pickImageResult();
      if (!imageResult.didCancel) {
        setSelectedImage(imageResult.assets[0]);
        setIsImagePickerModalVisible(true);
        try {
          const pickedColors = await RNColorThief.getPalette(
            imageResult.assets[0].uri,
            6,
            10,
            false
          );
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
          notifyMessage(t('Error while extracting colors - ') + error);
          sendClientError('error_extracting_colors', error.message);
        }
      }
    } finally {
      setPickImageLoading(false);
    }
  };

  const handlePickColors = async () => {
    const pickedColors = await NativeModules.CromaModule.navigateToImageColorPicker(
      selectedImage.uri
    );
    logEvent('hm_pick_colors_from_img', {
      length: pickedColors.length
    });
    navigation.navigate('ColorList', { colors: JSON.parse(pickedColors)?.colors });
    //setPickedColors(JSON.parse(pickedColors)?.colors);
    setIsImagePickerModalVisible(false);
  };

  const handleNext = () => {
    navigation.navigate('ColorList', { colors: automaticColors });
    setSelectedImage(null);
    setAutomaticColors([]);
    setIsImagePickerModalVisible(false);
  };

  const handleRandomColors = () => {
    const colorsHex = generateRandomColorPalette(pro.plan == 'starter' ? 4 : 6);
    const randomColors = colorsHex.map((colorHex) => {
      return { color: colorHex, locked: false };
    });
    navigation.navigate('ColorList', { colors: randomColors });
  };
  const actionButtonConfig = [
    [
      Platform.OS === 'android'
        ? {
            id: 1,
            icon: <MaterialCommunityIcons name="camera" size={20} />,
            text1: 'Palette',
            text2: 'using camera',
            onPress: async () => {
              const pickedColors = await NativeModules.CromaModule.navigateToColorPicker();
              logEvent('hm_pick_text_colors_from_camera', {
                length: pickedColors.length
              });
              navigation.navigate('ColorList', { colors: JSON.parse(pickedColors)?.colors });
            }
          }
        : null, // Camera option not available on iOS
      {
        id: 2,
        icon: <MaterialCommunityIcons name="image" size={20} />,
        text1: t('Palette'),
        text2: t('using image'),
        onPress: handleImagePicker
      },
      {
        id: 3,
        icon: <MaterialIcons name="palette" size={20} />,
        text1: t('Palette'),
        text2: t('using color'),
        onPress: () => {
          logEvent('get_palette_from_color');
          setIsColorPickerVisible(true);
        }
      }
    ].filter(Boolean),
    [
      {
        id: 4,
        icon: <MaterialCommunityIcons name="shuffle-variant" size={20} />,
        text1: t('Quick'),
        text2: t('palette'),
        onPress: () => {
          logEvent('generate_random_colors');
          handleRandomColors();
        }
      },
      {
        id: 5,
        icon: <FontAwesome name="magic" size={20} />,
        text1: t('Palette using'),
        text2: t('HueHive ai'),
        onPress: async () => {
          logEvent('chat_session_action_button');
          navigation.navigate('ChatSession');
        }
      },
      Platform.OS == 'android' ? (
      pro.plan !== 'starter'
        ? {
            id: 6,
            icon: <MaterialIcons name="create" size={20} />,
            text1: t('Create palette'),
            text2: t(' manually'),
            onPress: () => {
              logEvent('create_new_palette');
              navigation.navigate('SavePalette');
            }
          }
        : {
            id: 7,
            icon: <FontAwesome5 name="unlock" size={20} />,
            text1: t('Unlock'),
            text2: t('Pro'),
            onPress: () => {
              logEvent('home_screen_pro_button');
              navigation.navigate('ProVersion');
            }
          }) : null
    ].filter(Boolean)
  ];
  return (
    <>
      <ActionButtonContainer
        config={actionButtonConfig} />
      <Modal
        visible={isColorPickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsColorPickerVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setIsColorPickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.colorPickerModalContent}>
              <ColorPickerModal
                onColorSelected={handleColorSelected}
                onClose={() => setIsColorPickerVisible(false)}
                currentPlan={pro.plan}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={isImagePickerModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsImagePickerModalVisible(false);
          setSelectedImage(null);
          setAutomaticColors([]);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setIsImagePickerModalVisible(false);
            setSelectedImage(null);
            setAutomaticColors([]);
          }}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.imageColorPreviewModelContent}>
                {selectedImage && (
                  <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                )}

                <View style={styles.imageActionArea}>
                  <View style={styles.imageExtractedColorPreview}>
                    <MultiColorView colors={automaticColors}></MultiColorView>
                  </View>
                  <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>{t('Next')}</Text>
                    <MaterialIcons name="arrow-forward" size={24} color={Color.primaryDark} />
                  </TouchableOpacity>
                  {Platform.OS == 'android' && (<><View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                    <Text style={{ backgroundColor: '#ccc', height: 1, flex: 1 }}> </Text>
                    <Text style={{ marginHorizontal: 10 }}> {t('OR')}</Text>
                    <Text style={{ backgroundColor: '#ccc', height: 1, flex: 1 }}> </Text>
                  </View>
                  <TouchableOpacity style={styles.pickColorsButton} onPress={handlePickColors}>
                    <Text style={styles.pickColorsButtonText}>{t('Pick colors Manually')}</Text>
                  </TouchableOpacity>
                  </>
                  )}
                </View>
                  
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

GridActionButtonAndroid.propTypes = {
  navigation: PropTypes.any,
  setPickImageLoading: PropTypes.func
};

export default GridActionButtonAndroid;

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%',
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  imageColorPreviewModelContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    height: '50%',
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  imageActionArea: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 120
  },
  imageExtractedColorPreview: {
    margin: 16,
  },
  colorPickerModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '60%',
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  previewImage: {
    height: 150,
    resizeMode: 'contain',
    marginHorizontal: 20,
  },
  colorPreviewContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5
  },
  pickColorsButton: {
    alignItems: 'center',
    marginVertical: 8,
  },
  pickColorsButtonText: {
    fontSize: 18,
    color: Colors.primary
  },
  nextButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.primary
  },
  nextButtonText: {
    fontSize: 18
  }
};
