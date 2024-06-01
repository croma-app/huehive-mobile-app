import React, { useState } from 'react';
import { StyleSheet, Text, Dimensions, View, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors, { Spacing } from '../constants/Styles';
import * as Animatable from 'react-native-animatable';

const VerticalLine = () => <View style={styles.verticalLine} />;

const ActionButton = ({ t1, t2, icon }) => (
  <View style={styles.item}>
    {icon}
    <Text style={[styles.itemText, styles.paddingTop]}>{t1}</Text>
    <Text style={styles.itemText}>{t2}</Text>
  </View>
);

const rotateAnimation = {
  from: { transform: [{ rotateZ: '0deg' }] },
  to: { transform: [{ rotateZ: '45deg' }] }
};

const ActionButtonContainer = ({ config }) => {
  const [active, setActive] = useState(false);
  const headerHeight = useHeaderHeight();
  const screenHeight = Dimensions.get('window').height;

  return active ? (
    <TouchableOpacity
      style={[styles.actionButtonContainer, { height: screenHeight - headerHeight }]}
      onPress={() => setActive(false)}>
      <View style={[styles.actionButton, styles.actionButtonClose]}>
        <Animatable.View duration={300} animation={rotateAnimation}>
          <AntDesign name="plus" color="#fff" size={24} />
        </Animatable.View>
      </View>
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
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={() => setActive(true)}
      style={[styles.actionButton, styles.actionButtonOpen]}>
      <AntDesign name="plus" color="#fff" size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: { alignItems: 'center', padding: Spacing.medium },
  itemText: { fontSize: 13, fontWeight: '600' },
  paddingTop: { paddingTop: 5 },
  verticalLine: { width: 1, backgroundColor: Colors.lightGrey },
  actionButtonContainer: {
    position: 'absolute',
    justifyContent: 'flex-end',
    zIndex: 10,
    backgroundColor: Colors.overlay,
    width: Dimensions.get('window').width
  },
  slideUpContainer: { backgroundColor: Colors.backgroundColor, padding: Spacing.medium },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  flexBasis: { flex: 1 },
  horizontalLine: { height: 1, backgroundColor: Colors.lightGrey },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    width: 56,
    height: 56
  },
  actionButtonOpen: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: Colors.primary,
    zIndex: 2,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1
  },
  actionButtonClose: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginRight: 30,
    backgroundColor: '#5f6366'
  }
});

export default ActionButtonContainer;
