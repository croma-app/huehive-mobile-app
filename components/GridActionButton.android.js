import React from 'react';
import { NativeModules } from 'react-native';
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

const GridActionButtonAndroid = ({ navigation, setPickImageLoading }) => {
  const { t } = useTranslation();

  const {
    isPro,
    setPurchase,
    setColorList,
    setColorPickerCallback,
    setDetailedColor,
    clearPalette
  } = React.useContext(CromaContext);

  const pickImageResult = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1
    });
    return result;
  };
  return (
    <ActionButtonContainer
      config={[
        [
          {
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
          },
          {
            icon: <Ionicons name="md-image" color={Colors.fabPrimary} size={20} />,
            text1: t('Get palette'),
            text2: t('from image'),
            onPress: async () => {
              try {
                setPickImageLoading(true);
                const image = await pickImageResult();
                logEvent('get_palette_from_image');
                // get dominant color object { r, g, b }
                const pickedColors = await RNColorThief.getPalette(
                  image.assets[0].uri,
                  6,
                  10,
                  false
                );
                console.log(t('Picked colors: '), pickedColors);
                clearPalette();
                setColorList(
                  pickedColors.map((colorThiefColor) => {
                    //console.log("colorThiefColor: ", colorThiefColor);
                    const hex = new Color(
                      'rgb(' +
                        colorThiefColor.r +
                        ', ' +
                        colorThiefColor.g +
                        ', ' +
                        colorThiefColor.b +
                        ')'
                    ).tohex();
                    //console.log("Hex: ", hex, colorThiefColor);
                    return { color: hex };
                  })
                );
                navigation.navigate('ColorList');
              } catch (error) {
                notifyMessage(t('Error while extracting colors - ') + error);
              } finally {
                setPickImageLoading(false);
              }
            }
          },
          {
            icon: (
              <MaterialCommunityIcons name="palette-swatch" color={Colors.fabPrimary} size={20} />
            ),
            text1: t('Get palette'),
            text2: t('from color'),
            onPress: () => {
              logEvent('get_palette_from_color');
              clearPalette();
              setColorPickerCallback(({ color }) => {
                clearPalette();
                setDetailedColor(color);
                navigation.navigate('Palettes');
              });
              navigation.navigate('ColorPicker');
            }
          }
        ],
        [
          {
            icon: <MaterialCommunityIcons name="image" size={20} color={Colors.fabPrimary} />,
            text1: t('Pick color'),
            text2: t('from image'),
            onPress: async () => {
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
                navigation.navigate('ColorList');
              }
            }
          },
          {
            icon: <Ionicons size={20} color={Colors.fabPrimary} name="md-color-filter" />,
            text1: t('Palette'),
            text2: t('library'),
            onPress: async () => {
              logEvent('hm_palette_library');
              clearPalette();
              navigation.navigate('PaletteLibrary');
            }
          },
          isPro
            ? {
                icon: (
                  <MaterialCommunityIcons
                    name="credit-card-scan-outline"
                    size={20}
                    color={Colors.fabPrimary}
                  />
                ),
                text1: 'Scan color',
                text2: 'codes',
                onPress: async () => {
                  const pickedColors = await NativeModules.CromaModule.navigateToColorPicker();
                  logEvent('hm_pick_text_colors_from_camera', {
                    length: pickedColors.length
                  });
                  clearPalette();
                  setColorList(JSON.parse(pickedColors)?.colors);
                  navigation.navigate('ColorList');
                }
              }
            : {
                icon: <FontAwesome5 size={20} color={Colors.fabPrimary} name="unlock" />,
                text1: t('Unlock'),
                text2: t('pro'),
                onPress: () => purchase(setPurchase)
              }
        ]
      ]}></ActionButtonContainer>
  );
};

GridActionButtonAndroid.propTypes = {
  navigation: PropTypes.any,
  setPickImageLoading: PropTypes.func
};

export default GridActionButtonAndroid;
