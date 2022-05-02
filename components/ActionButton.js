import React, { useState } from "react";
import Touchable from "react-native-platform-touchable";
import { StyleSheet, Text, Dimensions, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const VerticalLine = function () {
  return <View style={{ width: 1, backgroundColor: '#7f8487' }}></View>
}

const ActionButton = function ({ t1, t2, icon } = props) {
  return <View style={[styles.item]} >
    {icon}
    <Text style={[styles.itemText]}> {t1}</Text>
    <Text style={[styles.itemText]}> {t2}</Text>
  </View>
}


const ActionButtonContainer = function (props) {
  const [active, setActive] = useState(false);
  const _onPress = async () => {

  };
  return (

    active ? <>
      <Touchable onPress={() => { setActive(false) }} style={{
        position: 'absolute',
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        bottom: 200,
        right: 30,
        backgroundColor: '#5f6366',
        zIndex: 2,
        width: 40,
        height: 40
      }}>
        <AntDesign name="close" color={'#fff'} size={24} />
      </Touchable>
      <View style={{ position: 'absolute', bottom: 0, backgroundColor: '#fff', padding: 10, zIndex: 2, width: Dimensions.get('window').width }}>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <ActionButton icon={<Ionicons name="md-camera" size={20} color="#f0675f" style={styles.actionButtonIcon} />} t1={'Pick colors'} t2={'form cemera'} />
          <VerticalLine />
          <ActionButton icon={ <Ionicons name="md-image" size={20} color="#f0675f" style={styles.actionButtonIcon} />}  t1={'Get pelette'} t2={'form image'} />
          <VerticalLine/>
          <ActionButton icon={<MaterialCommunityIcons
                name="palette-swatch"
                color="#f0675f"
                size={20}
                style={styles.actionButtonIcon}
            />} t1={'Get pelette'} t2={'form color'} />
        </View>
        <View style={{ height: 1, backgroundColor: '#7f8487' }}></View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <ActionButton  icon={<FontAwesome5 size={20} color="#f0675f" name="unlock" style={styles.actionButtonIcon} />} t1={'Unlock'} t2={'pro'} />
          <VerticalLine />
          <ActionButton icon={<Ionicons size={20} color="#f0675f" name="md-color-filter" style={styles.icon} />} t1={'Palette'} t2={'library'} />
          <VerticalLine />
          <ActionButton icon={<FontAwesome5 size={20} color="#f0675f" name="file-import" style={styles.icon} />} t1={'Import Export '} t2={'palettes'} />
        </View>
      </View>
    </>

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
    flexBasis: 90,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
  },
  itemText: {
    // fontSize: 14,
  }
});

export default ActionButtonContainer;
