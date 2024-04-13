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

export const SingleColorView = ({ color, onColorChange, drag, onRemove, onAdd }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isColorPickerVisible, setIsColorPickerVisible] = React.useState(false);
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

  const handleRmoveColor = () => {
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
    //notifyMessage('Color selected: ' + hexCode);
    onColorChange({ ...color, color: hexCode });
  };
  const textColor = pickTextColorBasedOnBgColor(color.color);
  const menuItems = [
    { label: 'Copy Color', onPress: handleCopyColor },
    { label: 'Edit Color', onPress: handleEditColor },
    { label: 'Add Color', onPress: handleAddColor },
    { label: 'Remove Color', onPress: handleRmoveColor }
  ];
  return (
    <Animated.View style={[styles.container, { opacity: color.opacity }]}>
      <TouchableOpacity
        onPress={openModal}
        onLongPress={drag}
        style={[styles.container, { backgroundColor: color.color }]}>
        <Text style={[styles.colorText, { color: textColor }]}>
          {color.color.toUpperCase() + (color.name ? ' (' + color.name + ')' : '')}
        </Text>
        <View style={styles.actionArea}>
          <TouchableOpacity
            style={[styles.actionAreaItem, styles.lockActionAreaItem]}
            onPress={() => {
              onColorChange({ ...color, color: color.color, locked: !color.locked });
            }}>
            <FontAwesome5
              style={[styles.icon, styles.lockIcon, { color: textColor }]}
              name={color.locked ? 'lock' : 'unlock'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionAreaItem, styles.dragActionAreaItem]}
            onPressIn={drag}>
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
                    <>
                      <TouchableOpacity
                        key={index}
                        style={[styles.menuButton]}
                        onPress={item.onPress}>
                        <Text style={styles.menuButtonText}>{item.label}</Text>
                      </TouchableOpacity>
                      <View style={styles.lineseperator}></View>
                    </>
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
              {/* TODO: make this color selection real time by adding onColorChangeCallback. This requires handling revert on close etc. */}
              <ColorPickerModal
                onColorSelected={handleColorSelected}
                onClose={() => {
                  setIsColorPickerVisible(false);
                }}
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
    //justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row'
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
    fontSize: 16,
    opacity: 0.6
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
  copyButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginBottom: 10
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
  lineseperator: {
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
