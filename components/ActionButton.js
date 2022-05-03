import React, { useState } from "react";
import Touchable from "react-native-platform-touchable";
import { StyleSheet, Text, Dimensions, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useHeaderHeight } from '@react-navigation/elements';

const VerticalLine = function () {
  return <View style={{ width: 1, backgroundColor: '#cacbcc' }}></View>
}

const ActionButton = function ({ t1, t2, icon } = props) {
  return <View style={[styles.item]} >
    {icon}
    <Text style={[styles.itemText, { paddingTop: 5 }]}> {t1}</Text>
    <Text style={[styles.itemText]}> {t2}</Text>
  </View>
}

const ActionButtonContainer = function (props) {
  const { config } = props;
  const [active, setActive] = useState(false);
  const headerHeight = useHeaderHeight();

  const rows = config;
  return (

    active ? <View style={{ position: 'absolute', justifyContent: 'flex-end', zIndex: 10, backgroundColor: 'rgba(0, 0, 0, 0.4)', height: Dimensions.get('window').height - headerHeight, width: Dimensions.get('window').width }}>
      <Touchable onPress={() => { setActive(false) }} style={{
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        backgroundColor: '#5f6366',
        width: 40,
        height: 40,
        alignSelf: 'flex-end',
        marginBottom: 30,
        marginRight: 30,
      }}>
        <AntDesign name="close" color={'#fff'} size={24} />
      </Touchable>
      <View style={{ backgroundColor: '#fff', padding: 10 }}>
        {rows.map((cols, index) => {
          return <>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
              {
                cols.map((item, index) => {
                  const { icon, text1, text2, onPress } = item;
                  console.log(icon)
                  return <>
                    <Touchable onPress={() => { setActive(false); onPress() }} style={{flexBasis: 90}}>
                      <ActionButton icon={icon} t1={text1} t2={text2} />
                    </Touchable>
                    {index < cols.length - 1 && <VerticalLine />}
                  </>
                })
              }
            </View>
            {index < rows.length - 1 && <View style={{ height: 1, backgroundColor: '#cacbcc' }}></View>}
          </>
        })}
      </View>
    </View >

      :
      <Touchable onPress={() => { setActive(true) }} style={
        {
          position: 'absolute',
          display: "flex",
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 40,
          bottom: 40,
          right: 30,
          backgroundColor: '#f0675f',
          zIndex: 2,
          width: 40,
          height: 40
        }}>
        <AntDesign name="plus" color={'#fff'} size={24} />
      </Touchable>
  );
};

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  itemText: {
    fontSize: 13,
    fontWeight: '600'
  }
});

export default ActionButtonContainer;
