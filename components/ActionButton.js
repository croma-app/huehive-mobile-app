import React, { useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View, TouchableOpacity, Modal } from 'react-native';
import Colors, { Spacing } from '../constants/Styles';
import * as Animatable from 'react-native-animatable';
import FloatingActionButton from './FloatingActionButton';

const VerticalLine = () => <View style={styles.verticalLine} />;

const ActionButton = ({ t1, t2, icon }) => (
  <View style={styles.item}>
    {icon}
    <Text style={[styles.itemText, styles.paddingTop]}>{t1}</Text>
    <Text style={styles.itemText}>{t2}</Text>
  </View>
);

const ActionButtonContainer = ({ config }) => {
  const [active, setActive] = useState(false);  
  return (
    <View>
      <FloatingActionButton
        onPress={() => {
          setActive(true);
        }}
      />
      <Modal
        visible={active}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActive(false)}>
        <TouchableWithoutFeedback onPress={() => setActive(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Animatable.View duration={150} animation="slideInUp" style={styles.slideUpContainer}>
                {config.map((cols, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <View style={styles.row}>
                      {cols.map((item, colIndex) => (
                        <React.Fragment key={item.id}>
                          <TouchableOpacity
                            onPress={() => {
                              setActive(false);
                              item.onPress();
                            }}
                            style={styles.flexBasis}>
                            <ActionButton icon={item.icon} t1={item.text1} t2={item.text2} />
                          </TouchableOpacity>
                          {colIndex < cols.length - 1 && <VerticalLine />}
                        </React.Fragment>
                      ))}
                    </View>
                    {rowIndex < config.length - 1 && <View style={styles.horizontalLine} />}
                  </React.Fragment>
                ))}
              </Animatable.View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  item: { alignItems: 'center', padding: Spacing.medium },
  itemText: { fontSize: 13, fontWeight: '600' },
  paddingTop: { paddingTop: 5 },
  verticalLine: { width: 1, backgroundColor: Colors.lightGrey },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  slideUpContainer: { backgroundColor: Colors.backgroundColor, padding: Spacing.medium },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  flexBasis: { flex: 1 },
  horizontalLine: { height: 1, backgroundColor: Colors.lightGrey },
});

export default ActionButtonContainer;
