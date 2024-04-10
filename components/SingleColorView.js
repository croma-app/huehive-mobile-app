import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Clipboard,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback, Animated
} from 'react-native';
import { notifyMessage } from '../libs/Helpers';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function getContrastColor(bgColor) {
  var color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  var uicolors = [r / 255, g / 255, b / 255];
  var c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.179 ? 'black' : 'white';
}

export const SingleColorView = ({ color, onColorChange, drag, onRemove, onAdd }) => {
  const [modalVisible, setModalVisible] = useState(false);

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

  const textColor = getContrastColor(color.color);
  const menuItems = [
    { label: 'Copy Color', onPress: handleCopyColor },
    //{ label: 'Edit Color', onPress: handleEditColor },
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
            style={styles.actionAreaItem}
            onPress={() => {
              onColorChange({ ...color, color: color.color, locked: !color.locked });
            }}>
            <FontAwesome5
              style={[styles.icon, { color: textColor }]}
              name={color.locked ? 'lock' : 'unlock'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionAreaItem} onPressIn={drag}>
            <MaterialIcons style={[styles.icon, { color: textColor }]} name="drag-indicator" />
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
    padding: 8,
    flex: 1,
    flexDirection: 'row'
  },
  icon: {
    fontSize: 24
  },
  actionAreaItem: {
    marginRight: 8,
    marginLeft: 8
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
  copyButtonText: {
    color: 'white',
    fontSize: 16
  },
  closeButton: {
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16
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
  }
});
