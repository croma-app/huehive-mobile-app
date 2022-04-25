import React, { useState } from "react";
import Touchable from "react-native-platform-touchable";
import { StyleSheet, Text, ActivityIndicator, Dimensions, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";



const ActionButton = function (props) {
  const [active, setActive] = useState(false);
  const _onPress = async () => {

  };
  return (

    active ? <>
      <Touchable onPress={() => { setActive(false) }} style={{ position: 'absolute', display: "flex", justifyContent: 'center', alignItems: 'center', borderRadius: 100, bottom: 80, right: 10, backgroundColor: 'red', zIndex: 2, width: 40, height: 40, }}>
        <AntDesign name="close" size={24} />
      </Touchable>
      <View style={{ position: 'absolute', bottom: 0, backgroundColor: 'red', zIndex: 2, width: Dimensions.get('window').width }}>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly" }}>
          <Text style={{fontSize: 20, padding: 2}}> One</Text>
          <Text style={{fontSize: 20, padding: 2}}> One</Text>
          <Text style={{fontSize: 20, padding: 2}}> One</Text>
        </View>
        <View style={{ height: 1, backgroundColor: '#000' }}></View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly" }}>
        <Text style={{fontSize: 20, padding: 2}}> One</Text>
        <Text style={{fontSize: 20, padding: 2}}> One</Text>
        <Text style={{fontSize: 20, padding: 2}}> One</Text>
        </View>
      </View>
    </>

      :
      <Touchable onPress={() => { setActive(true) }} style={{ position: 'absolute', display: "flex", justifyContent: 'center', alignItems: 'center', borderRadius: 100, bottom: 40, right: 10, backgroundColor: 'red', zIndex: 2, width: 40, height: 40, }}>
        <AntDesign name="plus" size={24} />
      </Touchable>



  );
};

const styles = StyleSheet.create({

});

export default ActionButton;
