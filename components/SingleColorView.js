import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { notifyMessage } from '../libs/Helpers';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { logEvent } from '../libs/Helpers';
import ColorPickerModal from './ColorPickerModal';
import { pickTextColorBasedOnBgColor } from '../libs/ColorHelper';
import { useNavigation } from '@react-navigation/native';

export const SingleColorView = ({ color, showUnlockPro, onColorChange, drag, onRemove, onAdd, currentPlan }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const navigation = useNavigation();

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleCopyColor = () => {
    if (Platform?.OS === 'android' || Platform.OS === 'ios') {
      notifyMessage(color.color + ' copied to clipboard!');
    }
    Clipboard.setString(color.color);
    closeModal();
  };

  const handleRemoveColor = () => {
    onRemove();
    closeModal();
  };

  const handleAddColor = () => {
    onAdd();
    closeModal();
  };

  const handleEditColor = () => {
    logEvent('handle_edit_color');
    setIsColorPickerVisible(true);
    closeModal();
  };

  const handleColorSelected = (hexCode) => {
    onColorChange({ ...color, color: hexCode });
  };

  const textColor = pickTextColorBasedOnBgColor(color.color);
  const menuItems = [
    { label: 'Copy Color', onPress: handleCopyColor },
    { label: 'Edit Color', onPress: handleEditColor },
    { label: 'Add Color', onPress: handleAddColor },
    { label: 'Remove Color', onPress: handleRemoveColor }
  ];

  return (
    <Animated.View style={[styles.container, { opacity: color.opacity }]}>
      <TouchableOpacity
        onPress={showUnlockPro ? () => navigation.navigate('ProVersion') : openModal}
        onLongPress={() => {
          if (!showUnlockPro) drag();
        }}
        style={[styles.container, { backgroundColor: color.color }]}>
        {showUnlockPro && (
          <View style={styles.overlay}>
            <Text
              style={[styles.colorText, { color: textColor, textAlign: 'center', fontSize: 12 }]}>
              Upgrade to Pro to view
            </Text>
          </View>
        )}
        <Text style={[styles.colorText, { color: textColor }]}>
          {showUnlockPro
            ? '#XXXXXX'
            : color.color.toUpperCase() + (color.name ? ' (' + color.name + ')' : '')}
        </Text>
        <View style={styles.actionArea}>
          <TouchableOpacity
            style={[styles.actionAreaItem, styles.lockActionAreaItem]}
            onPress={() => {
              if (!showUnlockPro) {
                onColorChange({ ...color, color: color.color, locked: !color.locked });
              }
            }}>
            <FontAwesome5
              style={[
                styles.icon,
                color.locked ? styles.lockIcon : styles.unlockIcon,
                { color: textColor }
              ]}
              name={color.locked ? 'lock' : 'unlock'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionAreaItem, styles.dragActionAreaItem]}
            onPressIn={() => {
              if (!showUnlockPro) drag();
            }}>
            <MaterialIcons
              style={[styles.icon, styles.dragIcon, { color: textColor }]}
              name="drag-indicator"
            />
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalText}>{color.color.toUpperCase()}</Text>
                  {menuItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <TouchableOpacity style={styles.menuButton} onPress={item.onPress}>
                        <Text style={styles.menuButtonText}>{item.label}</Text>
                      </TouchableOpacity>
                      <View style={styles.lineSeparator}></View>
                    </React.Fragment>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          visible={isColorPickerVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsColorPickerVisible(false)}>
          <View style={styles.colorPickerModalContainer}>
            <TouchableWithoutFeedback onPress={() => setIsColorPickerVisible(false)}>
              <View style={styles.colorPickerModalOverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.colorPickerModalContent}>
              <ColorPickerModal
                onColorSelected={handleColorSelected}
                onClose={() => {
                  setIsColorPickerVisible(false);
                }}
                currentPlan={currentPlan}
              />
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 72,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, .8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorText: {
    fontWeight: '700',
    paddingLeft: 16,
    paddingRight: 8
  },
  actionArea: {
    position: 'absolute',
    right: 0,
    flex: 1,
    flexDirection: 'row'
  },
  icon: {
    paddingHorizontal: 8
  },
  lockIcon: {
    fontSize: 16
  },
  unlockIcon: {
    fontSize: 16,
    opacity: 0.5
  },
  dragIcon: {
    fontSize: 24
  },
  actionAreaItem: {
    marginLeft: 8
  },
  dragActionAreaItem: {
    padding: 8
  },
  lockActionAreaItem: {
    padding: 8,
    marginVertical: 4
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    height: '40%'
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20
  },
  menuButton: {
    paddingHorizontal: 12,
    borderRadius: 8,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center'
  },
  menuButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  lineSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray'
  },
  colorPickerModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  colorPickerModalOverlay: {
    flex: 1
  },
  colorPickerModalContent: {
    height: '50%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  }
});
