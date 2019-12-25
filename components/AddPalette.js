import React from 'react';
import {Text, View, Button, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import { ColorPicker, fromHsv} from 'react-native-color-picker';

export class AddPalette extends React.Component {
  render() {
    return (
     <View>
      <TouchableOpacity
              style={styles.button}
                onPress={() => this.props.navigation.navigate('ColorPicker')}
                >
                <Text> GET PALETTE FROM IMAGE </Text>
          </TouchableOpacity>
        <TouchableOpacity
                    style={styles.button}
                    onPress={() => Alert.alert('GET PALETTE FROM COLOR')}
                    >

                    <Text> GET PALETTE FROM COLOR </Text>

        </TouchableOpacity>
               <TouchableOpacity
                                   style={styles.button}
                                   onPress={() => Alert.alert('ADD COLORS MANUALLY')}
                                   >
                                   <Text> ADD COLORS MANUALLY </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                                                         style={styles.buttonPro}

                                                         onPress={() => Alert.alert('UNLOCK PRO')}
                                                         >
                                                         <Text> UNLOCK PRO </Text>
                                            </TouchableOpacity>


    </View>
    );

  }
}

const styles = StyleSheet.create({
  button: {
      shadowColor: 'rgba(0,0,0, .4)',
      shadowOffset: { height: 1, width: 1 },
      shadowOpacity: 1,
      shadowRadius: 1,
      backgroundColor: '#fff',
      elevation: 2,
      height: 50,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      },
      buttonPro: {
            shadowColor: 'rgba(0,0,0, .4)',
            shadowOffset: { height: 1, width: 1 },
            shadowOpacity: 1,
            shadowRadius: 1,
            backgroundColor: '#f06860',
            elevation: 2,
            height: 50,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            },
});