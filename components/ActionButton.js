import React, { useState } from 'react';
import { StyleSheet, Text, Dimensions, View, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useHeaderHeight } from '@react-navigation/elements';
import Colors from '../constants/Colors';
import * as Animatable from 'react-native-animatable';

const VerticalLine = function () {
  return <View style={{ width: 1, backgroundColor: '#cacbcc' }}></View>;
};

const ActionButton = function ({ t1, t2, icon } = props) {
  return (
    <View style={[styles.item]}>
      {icon}
      <Text style={[styles.itemText, { paddingTop: 5 }]}> {t1}</Text>
      <Text style={[styles.itemText]}> {t2}</Text>
    </View>
  );
};
const rotateAnimation = {
  from: {
    transform: [{ rotateZ: '0deg' }]
  },
  to: {
    transform: [{ rotateZ: '45deg' }]
  }
};

const ActionButtonContainer = function (props) {
  const { config } = props;
  const [active, setActive] = useState(false);
  const headerHeight = useHeaderHeight();
  const rows = config;
  return active ? (
    <View
      style={[
        styles.actionButtonContainer,
        { height: Dimensions.get('window').height - headerHeight }
      ]}>
      <TouchableOpacity
        onPress={() => {
          setActive(false);
        }}
        style={[styles.actionButton, styles.actionButtonClose]}>
        <Animatable.View duration={300} animation={rotateAnimation}>
          <AntDesign name="plus" color={'#fff'} size={24} />
        </Animatable.View>
      </TouchableOpacity>
      <Animatable.View
        duration={300}
        animation="slideInUp"
        style={{ backgroundColor: '#fff', padding: 10 }}>
        {rows.map((cols, index) => {
          return (
            <>
              <View
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                {cols.map((item, index) => {
                  const { icon, text1, text2, onPress } = item;
                  return (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setActive(false);
                          onPress();
                        }}
                        style={{ flexBasis: 90 }}>
                        <ActionButton icon={icon} t1={text1} t2={text2} />
                      </TouchableOpacity>
                      {index < cols.length - 1 && <VerticalLine />}
                    </>
                  );
                })}
              </View>
              {index < rows.length - 1 && (
                <View style={{ height: 1, backgroundColor: '#cacbcc' }}></View>
              )}
            </>
          );
        })}
      </Animatable.View>
    </View>
  ) : (
    <TouchableOpacity
      onPress={() => {
        setActive(true);
      }}
      style={[styles.actionButton, styles.actionButtonOpen]}>
      <AntDesign name="plus" color={'#fff'} size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  itemText: {
    fontSize: 13,
    fontWeight: '600'
  },
  actionButtonContainer: {
    position: 'absolute',
    justifyContent: 'flex-end',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: Dimensions.get('window').width
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    width: 56,
    height: 56
  },
  actionButtonOpen: {
    position: 'absolute',
    display: 'flex',
    bottom: 40,
    right: 30,
    backgroundColor: Colors.fabPrimary,
    zIndex: 2,
    elevation: 5,
    // ios shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1
  },
  actionButtonClose: {
    display: 'flex',
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginRight: 30,
    backgroundColor: '#5f6366'
  }
});

export default ActionButtonContainer;
