import React from 'react';
import {
  NativeModules,
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import Color from 'pigment/full';
import RNColorThief from 'react-native-color-thief';
import { notifyMessage } from '../libs/Helpers';
import Colors from '../constants/Colors';
import ActionButtonContainer from './ActionButton';
import { logEvent, purchase } from '../libs/Helpers';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { CromaContext } from '../store/store';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ColorPickerModal from './ColorPickerModal';

const GridActionButtonAndroid = ({ navigation, setPickImageLoading }) => {
  const { t } = useTranslation();
  const [isColorPickerVisible, setIsColorPickerVisible] = React.useState(false);
  const [isImagePickerModalVisible, setIsImagePickerModalVisible] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [automaticColors, setAutomaticColors] = React.useState([]);

  const { isPro, setPurchase, setColorList, setDetailedColor, clearPalette } =
    React.useContext(CromaContext);

  const pickImageResult = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1
    });
    return result;
  };

  const handleColorSelected = (color) => {
    clearPalette();
    setDetailedColor(color);
    setIsColorPickerVisible(false);
    navigation.navigate('Palettes');
  };

  const handleImagePicker = async () => {
    logEvent('pick_colors_from_image');
    const imageResult = await pickImageResult();
    if (!imageResult.didCancel) {
      setSelectedImage(imageResult.assets[0]);
      setIsImagePickerModalVisible(true);
      try {
        const pickedColors = await RNColorThief.getPalette(imageResult.assets[0].uri, 6, 10, false);
        setAutomaticColors(
          pickedColors.map((colorThiefColor) => {
            const hex = new Color(
              'rgb(' + colorThiefColor.r + ', ' + colorThiefColor.g + ', ' + colorThiefColor.b + ')'
            ).tohex();
            return hex;
          })
        );
      } catch (error) {
        notifyMessage(t('Error while extracting colors - ') + error);
      }
    }
  };

  const handlePickColors = async () => {
    const pickedColors = await NativeModules.CromaModule.navigateToImageColorPicker(
      selectedImage.uri
    );
    logEvent('hm_pick_colors_from_img', {
      length: pickedColors.length
    });
    setColorList(JSON.parse(pickedColors)?.colors);
    navigation.navigate('ColorList');
    //setPickedColors(JSON.parse(pickedColors)?.colors);
    setIsImagePickerModalVisible(false);
  };

  const handleNext = () => {
    clearPalette();
    setColorList(automaticColors.map((color) => ({ color })));
    navigation.navigate('ColorList');
    setSelectedImage(null);
    setAutomaticColors([]);
  };

  const handleAutomaticColors = () => {
    clearPalette();
    setColorList(automaticColors.map((color) => ({ color })));
    navigation.navigate('ColorList');
    setSelectedImage(null);
    setAutomaticColors([]);
  };

  const handleRandomColors = () => {
    const randomColors = Array.from({ length: 6 }, () => {
      const randomColor = Color.random().tohex();
      return { color: randomColor, locked: false };
    });
    clearPalette();
    setColorList(randomColors);
    navigation.navigate('ColorList');
  };
  return (
    <>
      <ActionButtonContainer
        config={[
          [
            {
              icon: <MaterialCommunityIcons name="camera" size={20} color={Colors.fabPrimary} />,
              text1: 'Pick colors',
              text2: 'from camera',
              onPress: async () => {
                const pickedColors = await NativeModules.CromaModule.navigateToColorPicker();
                logEvent('hm_pick_text_colors_from_camera', {
                  length: pickedColors.length
                });
                clearPalette();
                setColorList(JSON.parse(pickedColors)?.colors);
                navigation.navigate('ColorList');
              }
            },
            {
              icon: <Ionicons name="md-image" color={Colors.fabPrimary} size={20} />,
              text1: t('Pick colors'),
              text2: t('from Image'),
              onPress: handleImagePicker
            },
            {
              icon: (
                <MaterialCommunityIcons name="palette-swatch" color={Colors.fabPrimary} size={20} />
              ),
              text1: t('Get Palette'),
              text2: t('from Color'),
              onPress: () => {
                logEvent('get_palette_from_color');
                setIsColorPickerVisible(true);
              }
            }
          ],
          [
            {
              icon: <Ionicons name="md-color-palette" color={Colors.fabPrimary} size={20} />,
              text1: t('Create quick'),
              text2: t('Palette'),
              onPress: () => {
                logEvent('generate_random_colors');
                handleRandomColors();
              }
            },
            {
              icon: <FontAwesome5 name="magic" size={20} color={Colors.fabPrimary} />,
              text1: t('Create with'),
              text2: t('HueHive AI'),
              onPress: async () => {
                logEvent('chat_session_action_button');
                navigation.navigate('ChatSession');
              }
            },
            isPro
              ? {
                  icon: <Ionicons name="md-color-filter" color={Colors.fabPrimary} size={20} />,
                  text1: t('Create New'),
                  text2: t('Palette'),
                  onPress: () => {
                    try {
                      logEvent('create_new_palette');
                      clearPalette();
                      navigation.navigate('AddPaletteManually');
                    } catch (error) {
                      notifyMessage(t('Error  - ') + error);
                    }
                  }
                }
              : {
                  icon: <FontAwesome5 size={20} color={Colors.fabPrimary} name="unlock" />,
                  text1: t('Unlock'),
                  text2: t('Pro'),
                  onPress: () => purchase(setPurchase)
                }
          ]
        ]}></ActionButtonContainer>
      <Modal
        visible={isColorPickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsColorPickerVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setIsColorPickerVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
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
                    <Ionicons name="arrow-forward" size={24} color={Colors.fabPrimary} />
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
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
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
  }
};
