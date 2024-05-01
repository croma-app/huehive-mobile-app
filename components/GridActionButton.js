import React from 'react';
import {
  NativeModules,
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Color from 'pigment/full';
import RNColorThief from 'react-native-color-thief';
import Feather from 'react-native-vector-icons/Feather';
import { notifyMessage, sendClientError } from '../libs/Helpers';
import { generateRandomColorPalette } from '../libs/ColorHelper';
import Colors from '../constants/Colors';
import ActionButtonContainer from './ActionButton';
import { logEvent, purchase } from '../libs/Helpers';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Evillcon from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ColorPickerModal from './ColorPickerModal';
import useApplicationStore from '../hooks/useApplicationStore';

const GridActionButtonAndroid = ({ navigation, setPickImageLoading }) => {
  const { t } = useTranslation();
  const [isColorPickerVisible, setIsColorPickerVisible] = React.useState(false);
  const [isImagePickerModalVisible, setIsImagePickerModalVisible] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [automaticColors, setAutomaticColors] = React.useState([]);

  const { isPro, setPurchase, setDetailedColor } = useApplicationStore();

  const pickImageResult = async () => {
    setPickImageLoading(true);
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1
    });
    return result;
  };

  const handleColorSelected = (color) => {
    setDetailedColor(color);
    setIsColorPickerVisible(false);
    navigation.navigate('Palettes');
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
              return hex;
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
    navigation.navigate('ColorList', { colors: automaticColors.map((color) => ({ color })) });
    setSelectedImage(null);
    setAutomaticColors([]);
    setIsImagePickerModalVisible(false);
  };

  const handleAutomaticColors = () => {
    handleNext();
  };

  const handleRandomColors = () => {
    const colorsHex = generateRandomColorPalette(6);
    const randomColors = colorsHex.map((colorHex) => {
      return { color: colorHex, locked: false };
    });
    navigation.navigate('ColorList', { colors: randomColors });
  };
  return (
    <>
      <ActionButtonContainer
        config={[
          [
            {
              icon: <Evillcon name="camera" size={20} />,
              text1: 'Palette',
              text2: 'using camera',
              onPress: async () => {
                const pickedColors = await NativeModules.CromaModule.navigateToColorPicker();
                logEvent('hm_pick_text_colors_from_camera', {
                  length: pickedColors.length
                });
                navigation.navigate('ColorList', { colors: JSON.parse(pickedColors)?.colors });
              }
            },
            {
              icon: <Evillcon name="image" size={20} />,
              text1: t('Palette'),
              text2: t('using image'),
              onPress: handleImagePicker
            },
            {
              icon: <Ionicons name="color-palette-outline" size={20} />,
              text1: t('Palette'),
              text2: t('using color'),
              onPress: () => {
                logEvent('get_palette_from_color');
                setIsColorPickerVisible(true);
              }
            }
          ],
          [
            {
              icon: <Ionicons name="md-shuffle" size={20} />,
              text1: t('Quick'),
              text2: t('palette'),
              onPress: () => {
                logEvent('generate_random_colors');
                handleRandomColors();
              }
            },
            {
              icon: <FontAwesome5 name="magic" size={20} />,
              text1: t('Palette using'),
              text2: t('HueHive ai'),
              onPress: async () => {
                logEvent('chat_session_action_button');
                navigation.navigate('ChatSession');
              }
            },
            isPro
              ? {
                  icon: <Ionicons name="md-color-filter-outline" size={20} />,
                  text1: t('Create palette'),
                  text2: t(' manully'),
                  onPress: () => {
                    logEvent('create_new_palette');
                    navigation.navigate('SavePalette');
                  }
                }
              : {
                  icon: <Feather name="unlock" size={20} />,
                  text1: t('Unlock'),
                  text2: t('Pro'),
                  onPress: () => purchase(setPurchase)
                }
          ]
        ]}></ActionButtonContainer>
      <Modal
        style={styles.modalStyle}
        visible={isColorPickerVisible}
        animationType="slide"
        // transparent={true}
        onRequestClose={() => setIsColorPickerVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setIsColorPickerVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.colorPickerModalContent}>
          <ColorPickerModal
            onColorSelected={handleColorSelected}
            onClose={() => setIsColorPickerVisible(false)}
          />
        </View>
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
              <View style={styles.modalContent}>
                {selectedImage && (
                  <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
                )}
                <View style={styles.colorPreviewContainer}>
                  {automaticColors.length > 0 && (
                    <TouchableOpacity
                      style={styles.automaticColorsContainer}
                      onPress={handleAutomaticColors}>
                      {automaticColors.map((color, index) => (
                        <View
                          key={index}
                          style={[styles.colorPreview, { backgroundColor: color }]}
                        />
                      ))}
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Ionicons name="arrow-forward" size={24} color={Color.fabPrimary} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.pickColorsButton} onPress={handlePickColors}>
                  <Text style={styles.pickColorsButtonText}>Pick Colors Manually</Text>
                </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20
  },
  colorPickerModalContent: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20
  },
  colorPreviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  automaticColorsContainer: {
    flexDirection: 'row',
    marginRight: 10
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5
  },
  pickColorsButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  pickColorsButtonText: {
    fontSize: 18,
    color: Colors.fabPrimary
  },
  nextButton: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: Colors.fabPrimary
  },
  nextButtonText: {
    fontSize: 16,
    color: Colors.fabPrimary
  },
  modalStyle: {
    height: Dimensions.get('window').height / 2
  }
};
